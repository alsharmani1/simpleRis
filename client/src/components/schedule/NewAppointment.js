import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row } from "react-bootstrap";

const NewAppointment = () => {
  const [state, setState] = useState({});

  const onSubmit = () => {
    axios
      .post("/api/appointment/create", state)
      .then((res) => {})
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <Form>
        {/* <Form.Row */}
        <Button varient="primary">Create Appointment</Button>
      </Form>
    </div>
  );
};

export default NewAppointment;
