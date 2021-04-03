import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";

const PatientProfile = (props) => {
  const [state, setState] = useState({});
  useEffect(() => {
      axios
        .get(`/api/patients/${props.match.params.id}`)
        .then((res) => setState(res.data))
        .catch((error) => console.log(error));
  }, []);

  const onChange = (e) => {};
  return (
    <div>
      <Form className="container mt-5">
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Initials</Form.Label>
            <Form.Control
              type="text"
              name="middleInitial"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
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
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>DOB</Form.Label>
            <Form.Control
              type="text"
              name="dob"
              type="date"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Insurance #</Form.Label>
            <Form.Control
              type="text"
              name="insuranceNum"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default PatientProfile;
