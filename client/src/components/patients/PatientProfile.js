import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import NewAppointment from "../schedule/NewAppointment";
import VisitHistory from "./VisitHistory";

const PatientProfile = (props) => {
  const { addToast } = useToasts();
  const [state, setState] = useState({
    profileInfo: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      phone: "",
      dob: "",
      insuranceNum: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    showModal: false,
    disabled: false,
    fetching: true
  });
  useEffect(() => {
    axios
      .get(`/api/patients/${props.match.params.id}`)
      .then((res) =>
        setState((state) => ({ ...state, fetching: false, profileInfo: {...res.data} }))
      )
      .catch((error) =>
        addToast("Unable to retrieve patient info", {
          appearance: "error",
          autoDismiss: true,
        })
      );
  }, []);

  const onChange = (e) =>
    setState((state) => ({
      ...state,
      profileInfo: { ...state.profileInfo, [e.target.name]: e.target.value },
    }));

  const toggleModal = (e) =>
    setState((state) => ({ ...state, showModal: !state.showModal }));

  const saveAppointment = (appointmentState) => {
    const data = {
      ...appointmentState,
      patientId: state.profileInfo.id
    };

    axios
      .post("/api/appointment/create", data)
      .then((res) => {
        setState(state => ({...state, showModal: false}))
        addToast(res.data, {
          appearance: "success",
          autoDismiss: true,
        })
      })
      .catch((error) => addToast("Unable to save patient info", {
        appearance: "error",
        autoDismiss: true,
      }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/patients/update", state.profileInfo)
      .then((res) =>
        addToast(res.data, {
          appearance: "success",
          autoDismiss: true,
        })
      )
      .catch((error) =>
        addToast("Unable to save patient info", {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  if(state.fetching) return ""
  return (
    <div>
      <Form className="container mt-5">
        <h4 className="mb-3">Patient Information</h4>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={state.profileInfo["firstName"]}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Initials</Form.Label>
            <Form.Control
              type="text"
              name="middleInitial"
              value={state.profileInfo["middleInitial"]}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={state.profileInfo["lastName"]}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Phone #</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={state.profileInfo["phone"]}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>DOB</Form.Label>
            <Form.Control
              type="text"
              name="dob"
              type="date"
              value={state.profileInfo["dob"]}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Insurance #</Form.Label>
            <Form.Control
              type="text"
              name="insuranceNum"
              value={state.profileInfo["insuranceNum"]}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>Street Name</Form.Label>
          <Form.Control
            name="address"
            onChange={(e) => onChange(e)}
            value={state.profileInfo["address"]}
          />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              onChange={(e) => onChange(e)}
              value={state.profileInfo["city"]}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>State</Form.Label>
            <Form.Control
              name="state"
              onChange={(e) => onChange(e)}
              value={state.profileInfo["state"]}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Zip</Form.Label>
            <Form.Control
              name="zip"
              onChange={(e) => onChange(e)}
              value={state.profileInfo["zip"]}
            />
          </Form.Group>
        </Form.Row>
        <Button
          varient="primary"
          className="mt-3"
          onClick={(e) => handleSubmit(e)}
        >
          Save
        </Button>
        <Button
          varient="primary"
          className="mt-3 ml-3 float-right"
          onClick={(e) => toggleModal(e)}
        >
          Creat Appointment
        </Button>
      </Form>

      <VisitHistory patientInfo={state.patientInfo} />
      {state.showModal && (
        <NewAppointment
          showModal={state.showModal}
          toggleModal={toggleModal}
          saveAppointment={saveAppointment}
          physicianRole="MD"
        />
      )}
    </div>
  );
};

export default PatientProfile;
