import axios from "axios";
import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Form, Row, Button, Col } from "react-bootstrap";
import { scanTypes } from "../common/consts";
import { convertHr24To12 } from "../schedule/Schedule";

const ReferralDetails = (props) => {
  const { addToast } = useToasts();
  const [state, setState] = useState({
    patient: {},
    appointment: {},
    images: [],
    formValues: { scanArea: "", scanType: "" },
    fetching: true,
  });
  useEffect(() => {
    getAppointmentAndPatient();
  }, []);

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
      const { scanArea, scanType, finalImagePaths } = referrals.data;
      setState((state) => ({
        ...state,
        fetching: false,
        formValues: {
          ...state.formValues,
          scanArea: scanArea || state.formValues.scanArea,
          scanType: scanType || state.formValues.scanType,
        },
        images: finalImagePaths || [],
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
      const diagnosis = await axios.post(
        `/api/appointment/diagnosis/${state.appointment.appointmentId}`,
        {
          details,
          createReferral,
        }
      );

      diagnosis.status === 200 && await axios.post(`/api/appointment/status/${state.appointment.appointmentId}`, {status: "Check-out"})
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
                  return <li key={i}>
                    <a href={path} target="_blank">Image #{i + 1}</a>
                  </li>;
                })}
              </ul>
          </Col>
        </Row>
      </>
    );
  };

  if (state.fetching) return "";
  return (
    <div style={{ margin: "0 auto", maxWidth: "85%" }}>
      <h4 className="text-center mt-5">
        Appointment {state.appointment?.appointmentId}
      </h4>
      <div className="mt-5 doctor-notes">{extractAppointmentInfo()}</div>
      <div className="mt-3 mb-5 patient-info">
        <Form>
          <Form.Row></Form.Row>
          <Form.Group>
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
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ReferralDetails;
