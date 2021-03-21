import axios from "axios";
import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

function Schedule() {
  const [state, setState] = useState([
    {
      id: "",
      firstName: "",
      lastName: "",
      date: "",
      time: "",
      physician: "",
    },
  ]);

  useEffect(() => {
    axios
      .get("/api/schedule")
      .then((res) => {
        console.log(res);
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const appointmentList = state.map((appointment) => (
    <ListGroup horizontal>
      <ListGroupItem action href="/patient/:id">
        {appointment.firstName} {appointment.lastName}
      </ListGroupItem>
      <ListGroupItem>{appointment.date}</ListGroupItem>
      <ListGroupItem>{appointment.physician}</ListGroupItem>
      <ListGroupItem>
        <a>edit</a>
        <a>delete</a>
        {appointment.status === "Not Started" ? <a>check-in</a> : <a>check-out</a>}
      </ListGroupItem>
    </ListGroup>
  ));
  
  return (
    <div>
      <div className="schedule">{appointmentList}</div>
    </div>
  );
}

export default Schedule;
