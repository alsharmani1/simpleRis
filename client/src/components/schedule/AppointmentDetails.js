import axios from "axios";
import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Form, Row, Button, Col } from "react-bootstrap";
import { scanTypes } from "../common/consts";

const AppointmentDetails = (props) => {
  const { addToast } = useToasts();
  const [state, setState] = useState({
    patient: {},
    appointment: {},
    createReferral: "No",
    formValues: {},
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
      setState((state) => ({
        ...state,
        appointment: appointment.data,
        patient: patient.data,
      }));
    } catch (error) {
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
      
      if(e.target.name === "createReferral") {
        saveState[e.target.name] = e.target.value;
        if (e.target.value === "No") {
          delete saveState.formValues["scanType"];
          delete saveState.formValues["scanArea"];
        }
      } else {
        saveState.formValues[e.target.name] = e.target.value;
      }

      return saveState;
    });
  };

  const handleSubmit = () => {};
  const extractAppointmentInfo = () => {
    const {
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

    const {
      physician,
      date,
      time,
      status
    } = state.appointment;

    return (
      <>
        <Row>
          <Col>
            <p>
              <b>Patient Name:</b> {`${firstName}, ${middleInitial} ${lastName}`}
            </p>
            <p>
              <b>DOB:</b> {dob}
            </p>
            <p>
              <b>Insurance #:</b> {insuranceNum}
            </p>
            <p><b>Phone #:</b> {phone}</p>
          </Col>
          <Col>
            <p><b>Street Name:</b> {address}</p>
            <p><b>City:</b> {city}</p>
            <p><b>State:</b> {theState}</p>
            <p><b>Zip:</b> {zip}</p>
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
              <b>Time:</b> {time}
            </p>
            <p><b>Physician:</b> {physician}</p>
          </Col>
        </Row>
      </>
    );
  };
  const refOptionSize = state.createReferral === "Yes" ? 12 : 4;
  return (
    <div style={{margin: "0 auto", maxWidth: "85%"}}>
      <h4 className="text-center mt-5">Appointment {state.appointment?.appointmentId}</h4>
      <div className="mt-5 doctor-notes">{extractAppointmentInfo()}</div>
      <div className="mt-5 patient-info">
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Create referral?</Form.Label>
              <Form.Control
                as="select"
                className={`col-lg-${refOptionSize} col-md-${refOptionSize} col-sm-${refOptionSize}`}
                name="createReferral"
                onChange={onChange}
                value={state.createReferral}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Control>
            </Form.Group>

            {state.createReferral !== "No" && (
              <>
                <Form.Group as={Col}>
                  <Form.Label>Scan Type</Form.Label>
                  <Form.Control as="select" name="scanType" onChange={onChange}>
                    <option value="">Select...</option>
                    {scanTypes.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Scan Area</Form.Label>
                  <Form.Control
                    type="text"
                    name="scanArea"
                    onChange={onChange}
                  />
                </Form.Group>
              </>
            )}
          </Form.Row>
          <Form.Group>
            <Form.Label>Doctor's Notes</Form.Label>
            <Form.Control
              rows={4}
              cols={50}
              as="textarea"
              onChange={onChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AppointmentDetails;
