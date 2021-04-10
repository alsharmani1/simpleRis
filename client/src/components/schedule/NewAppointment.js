import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Col } from "react-bootstrap";

const NewAppointment = (props) => {
  const [state, setState] = useState({
    appointmentId:
      props?.appointmentInfo.appointmentId ||
      `A-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "Not Started",
    date: props?.appointmentInfo.date || "",
    time: props?.appointmentInfo.time || "",
    physician: props?.appointmentInfo.physician || ""
  });

  const [physicians, setPhysicians] = useState([]);
  useEffect(() => {
    axios.get(`/api/users/MD`).then((res) => {
      setPhysicians((state) => res.data);
    });
  }, []);

  const onChange = (e) =>
    setState((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));

  return (
    <Modal show={props.showModal}>
      <Modal.Header>
        <Modal.Title>Create Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="date"
                type="date"
                onChange={(e) => onChange(e)}
                value={state["date"]}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="time"
                type="time"
                onChange={(e) => onChange(e)}
                value={state["time"]}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Physican</Form.Label>
              <Form.Control
                as="select"
                name="physician"
                onChange={(e) => onChange(e)}
                defaultValue="Select..."
              >
                <option>Select...</option>
                {physicians.map(({ lastName, firstName, userRole }, index) => (
                  <option
                    key={index}
                    value={`${lastName}, ${firstName} ${userRole}`}
                  >{`${lastName}, ${firstName} ${userRole}`}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setState({});
            props.toggleModal();
          }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={(e) => props.saveAppointment(state)}>
          Save Appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAppointment;
