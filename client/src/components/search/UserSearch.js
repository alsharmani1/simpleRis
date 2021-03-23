import React, { useState, useEffect } from "react";
import { Form, Button, Col, Table } from "react-bootstrap";
import axios from "axios";

const UserSearch = (props) => {
  const [state, setState] = useState({ search: {}, patients: {} });

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

  const getPatients = () =>
    axios
      .post("/api/patient/search", state.search)
      .then((res) => {
        // save data to state if you don't know something ; console log it
        setState((state) => ({ ...state, patients: res.data }));
      })
      .catch((error) => {
        // console log the error or do something with it
        console.log(error);
      });

  const newPatient = () =>
    axios
      .post("/api/patient/create", state.search)
      .then((res) => {
        // save data to state if you don't know something ; console log it
        getPatients()
      })
      .catch((error) => {
        // console log the error or do something with it
        console.log(error);
      });

  const renderPatientList = () => {
    return state.patients.map(
      (
        { firstName, lastName, middleInitial, insuranceNum, dob, phone },
        index
      ) => {
        return (
          <tbody>
            <tr>
              <td>
                <a
                  href={`/patients/${state.patients[index].id}`}
                >{`${firstName} ${middleInitial}. ${lastName}`}</a>
              </td>
              <td>{dob}</td>
              <td>{phone}</td>
              <td>{insuranceNum}</td>
            </tr>
          </tbody>
        );
      }
    );
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
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Initials</Form.Label>
            <Form.Control
              type="text"
              name="middleInitial"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              onChange={(e) => onChange(e)}
            />
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
          </Form.Group>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>DOB</Form.Label>
            <Form.Control
              type="text"
              name="dob"
              type="date"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Insurance #</Form.Label>
            <Form.Control
              type="text"
              name="insuranceNum"
              onChange={(e) => onChange(e)}
            />
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
        <Button variant="primary" type="submit" onClick={(e) => newPatient(e)}>
          New Patient
        </Button>
      </Form>

      <div>
        <h4 className="text-center mt-5 mb-5">PATIENTS RESULTS </h4>
        {state.patients.length && (
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
        )}
      </div>
    </div>
  );
};

export default UserSearch;
