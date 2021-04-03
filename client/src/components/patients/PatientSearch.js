import React, { useState, useEffect } from "react";
import { Form, Button, Col, Table } from "react-bootstrap";
import axios from "axios";
import OnSubmitErrorMessage from "../common/OnSubmitErrorMessage";
import { useToasts } from "react-toast-notifications";
import { Redirect } from "react-router";

const PatientSearch = (props) => {
  const [state, setState] = useState({
    search: {
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      insuranceNum: "",
    },
    redirect: false,
    patients: [],
    errors: {},
  });
  const { addToast } = useToasts();
  const fieldRequired = (
    <OnSubmitErrorMessage type="error" message={`Field is required`} />
  );

  useEffect(() => {
    getPatients();
  }, []);
  const onChange = (e) => {
    e.preventDefault();
    setState((state) => ({
      ...state,
      search: { ...state.search, [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getPatients();
  };

  const getPatients = () => {
    axios
      .post("/api/patient/search", { ...state.search })
      .then((res) => {
        setState((state) => ({
          ...state,
          patients: res.data,
          redirect: false,
        }));
      })
      .catch((error) => {
        addToast("Unable to retrieve patient list", {
          appearance: "error",
          autoDismiss: true,
        });
        console.log(error);
      });
  };

  const newPatient = (e) => {
    e.preventDefault();
    let validFields = true;
    let errors = {};
    const keys = Object.keys(state.search);

    for (let i = 0; i <= keys.length - 1; i++) {
      console.log(state.search[keys]);
      if (keys[i] !== "middleInitials" && !state.search[keys[i]]) {
        errors = { ...errors, [keys[i]]: true };
        setState((state) => ({ ...state, errors }));
        validFields = false;
        break;
      } else {
        errors = { ...errors, [keys[i]]: false };
        setState((state) => ({ ...state, errors }));
      }
    }

    validFields &&
      axios
        .post("/api/patient/create", { ...state.search, middleInitial: "" })
        .then((res) => {
          window.location = "/patients";
        })
        .catch((error) => {
          addToast("Unable to create a patient", {
            appearance: "error",
            autoDismiss: true,
          });
        });
  };

  const renderPatientList = () => {
    return state.patients.map((patient, index) => {
      const {
        firstName,
        lastName,
        middleInitial,
        insuranceNum,
        dob,
        phone,
      } = patient;
      return (
        <tbody key={index}>
          <tr>
            <td>
              <a
                className="anchor-link"
                href={`/patients/${state.patients[index].id}`}
              >{`${firstName} ${middleInitial}. ${lastName}`}</a>
            </td>
            <td>{dob}</td>
            <td>{phone}</td>
            <td>{insuranceNum}</td>
          </tr>
        </tbody>
      );
    });
  };

  return (
    <div>
      <Form className="container mt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              onChange={(e) => onChange(e)}
            />
            {state.errors["firstName"] && fieldRequired}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Initials</Form.Label>
            <Form.Control
              type="text"
              name="middleInitial"
              onChange={(e) => onChange(e)}
            />
            {state.errors["middleInitial"] && fieldRequired}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              onChange={(e) => onChange(e)}
            />
            {state.errors["lastName"] && fieldRequired}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Phone #</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              onChange={(e) => onChange(e)}
            />
            {state.errors["phone"] && fieldRequired}
          </Form.Group>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>DOB</Form.Label>
            <Form.Control
              type="text"
              name="dob"
              type="date"
              onChange={(e) => onChange(e)}
            />
            {state.errors["dob"] && fieldRequired}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Insurance #</Form.Label>
            <Form.Control
              type="text"
              name="insuranceNum"
              onChange={(e) => onChange(e)}
            />
            {state.errors["insuranceNum"] && fieldRequired}
          </Form.Group>
        </Form.Row>

        <Button
          variant="primary"
          className="mr-2"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Search
        </Button>
        <Button
          variant="primary"
          className="mr-2"
          type="submit"
          onClick={(e) => newPatient(e)}
        >
          New Patient
        </Button>
      </Form>

      <div>
        <h4 className="text-center mt-5 mb-5">PATIENTS RESULTS </h4>
        {(state.patients.length && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Patient</th>
                <th>D.O.B</th>
                <th>Phone #</th>
                <th>Insurance #</th>
              </tr>
            </thead>
            {renderPatientList()}
          </Table>
        )) || (
          <p className="text-center mt-5 mb-5">
            There are no results to display!
          </p>
        )}
      </div>
    </div>
  );
};

export default PatientSearch;
