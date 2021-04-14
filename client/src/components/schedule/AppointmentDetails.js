import axios from "axios";
import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Form, Row, Button, Col } from "react-bootstrap";
import { scanTypes } from "../common/consts";
import { convertHr24To12 } from "../schedule/Schedule";

const AppointmentDetails = (props) => {
  const { addToast } = useToasts();
  const [state, setState] = useState({
    patient: {},
    appointment: {},
    formValues: { scanArea: "", scanType: "" },
    fetching: true,
  });
  useEffect(() => {
    getAppointmentAndPatient();
    getReferralInfo();
  }, []);

  const getReferralInfo = () => {
    axios.get(`/api/referrals/${props.match.params.id}`).then(
      (res) =>
        res.data &&
        setState((state) => ({
          ...state,
          formValues: {
            scanArea: res.data.scanArea,
            scanType: res.data.scanType,
          },
        }))
    );
  };
  const getAppointmentAndPatient = async () => {
    try {
      const appointment = await axios.get(
        `/api/appointment/${props.match.params.id}`
      );
      const patient = await axios.get(
        `/api/patients/${appointment.data.patientId}`
      );

      const referrals = await axios.get(
        `/api/worklist/${props.match.params.id}`
      );

      const { scanArea, scanType } =
        appointment.data.createReferral === "Yes" &&
        (await axios.get(`/api/referrals/${appointment.data.appointmentId}`));
      setState((state) => ({
        ...state,
        fetching: false,
        formValues: {
          ...state.formValues,
          scanArea: scanArea || state.formValues.scanArea,
          scanType: scanType || state.formValues.scanType,
        },
        images: referrals.data.finalImagePaths || [],
        appointment: {
          ...appointment.data,
          createReferral: appointment.data.createReferral || "No",
        },
        verifyCreateReferral: appointment.data.createReferral || "No",
        patient: patient.data,
      }));
    } catch (error) {
      setState((state) => ({
        ...state,
        fetching: false,
      }));
      addToast(error.response.data, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const onChange = (e) => {
    e.preventDefault();
    setState((state) => {
      let saveState = { ...state };

      if (e.target.name === "createReferral") {
        saveState.appointment[e.target.name] = e.target.value;
        if (e.target.value === "No") {
          delete saveState.formValues["scanType"];
          delete saveState.formValues["scanArea"];
        }
      } else if (e.target.name === "details") {
        saveState.appointment[e.target.name] = e.target.value;
      } else {
        saveState.formValues[e.target.name] = e.target.value;
      }

      return saveState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      createReferral,
      appointmentId,
      physicianId,
      details,
    } = state.appointment;

    try {
      await axios.post(
        `/api/appointment/diagnosis/${state.appointment.appointmentId}`,
        {
          details,
          createReferral,
        }
      );

      if (createReferral === "Yes") {
        await axios.post(`/api/referrals/create`, {
          details,
          createReferral,
          appointmentId,
          physicianId,
          scanType: state.formValues.scanType,
          scanArea: state.formValues.scanArea,
          patientId: state.patient.id,
        });
      }

      addToast("Saved successfully!", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      addToast(error.response.data, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const extractAppointmentInfo = () => {
    const {
      id,
      firstName,
      lastName,
      middleInitial,
      phone,
      dob,
      insuranceNum,
      address,
      city,
      state: theState,
      zip,
    } = state.patient;

    const { physician, date, time, status } = state.appointment;
    const { scanArea, scanType } = state.formValues;
    const hm = time.split(":");

    return (
      <>
        <Row>
          <Col>
            <p>
              <b>Patient Name:</b>{" "}
              <a
                href={`/patients/${id}`}
              >{`${firstName}, ${middleInitial} ${lastName}`}</a>
            </p>
            <p>
              <b>DOB:</b> {dob}
            </p>
            <p>
              <b>Insurance #:</b> {insuranceNum}
            </p>
            <p>
              <b>Phone #:</b> {phone}
            </p>
          </Col>
          <Col>
            <p>
              <b>Street Name:</b> {address}
            </p>
            <p>
              <b>City:</b> {city}
            </p>
            <p>
              <b>State:</b> {theState}
            </p>
            <p>
              <b>Zip:</b> {zip}
            </p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <p>
              <b>Date:</b> {date}
            </p>
            <p>
              <b>Status:</b> {status}
            </p>
          </Col>
          <Col>
            <p>
              <b>Time:</b> {convertHr24To12(hm[0], hm[1])}
            </p>
            <p>
              <b>Physician:</b> {physician}
            </p>
          </Col>
        </Row>

        {state.images && (
          <>
            <h4 className="mb-5 mt-5 text-center">Patient Scan Information</h4>
            <Row className="mt-5">
              <Col>
                <p>
                  <b>Scan Type:</b> {scanType}
                </p>
                <p>
                  <b>Scan Area:</b> {scanArea}
                </p>
                <p>
                  <b>Image List:</b>
                </p>
                <ul>
                  {state.images.map((path, i) => {
                    return (
                      <li key={i}>
                        <a href={path} target="_blank">
                          Image #{i + 1}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  };
  const refOptionSize = state.appointment.createReferral === "Yes" ? 12 : 4;
  if (state.fetching) return "";
  return (
    <div style={{ margin: "0 auto", maxWidth: "85%" }}>
      <h4 className="text-center mt-5">
        Appointment {state.appointment?.appointmentId}
      </h4>
      <div className="mt-5 doctor-notes">{extractAppointmentInfo()}</div>
      <div className="mt-5 patient-info">
        <Form className="mb-5">
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Create referral?</Form.Label>
              <Form.Control
                as="select"
                className={`col-lg-${refOptionSize} col-md-${refOptionSize} col-sm-${refOptionSize}`}
                name="createReferral"
                onChange={onChange}
                value={state.appointment.createReferral}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Control>
            </Form.Group>

            {state.appointment.createReferral !== "No" && (
              <>
                <Form.Group as={Col}>
                  <Form.Label>Scan Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="scanType"
                    onChange={onChange}
                    value={state.formValues.scanType}
                  >
                    <option value="">Select...</option>
                    {scanTypes.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Scan Area</Form.Label>
                  <Form.Control
                    type="text"
                    name="scanArea"
                    onChange={onChange}
                    value={state.formValues.scanArea}
                  />
                </Form.Group>
              </>
            )}
          </Form.Row>
          <Form.Group >
            <Form.Label>Doctor's Notes</Form.Label>
            <Form.Control
              rows={4}
              cols={50}
              as="textarea"
              name="details"
              value={state.appointment.details}
              onChange={onChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={state.appointment.status === "Complete"}
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AppointmentDetails;
