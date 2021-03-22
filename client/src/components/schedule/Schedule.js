import axios from "axios";
import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

function Schedule() {
  const [state, setState] = useState([]);

  useEffect(() => {
    axios
      .get("/api/schedule")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteHandler = (e, id, index) => {
    e.preventDefault()
    axios.delete(`/api/appointment/delete/${id}`).then(res => {
      setState(state => {
        const removeItem = state.splice(index, 1)
        return removeItem
      })
    }).catch(error => {
      console.log(error)
    })
  }
  
  const checkInHandler = (e) => {
    e.preventDefault()
    axios.post("/api/appointment/checkin/:id").then((res) => {
      setState((state) => ({ ...state, status: "Started" }));
    })
    .catch((err) => {
        console.log(err);
    });
  };

  const checkOutHandler = () => {
    axios.post("/api/appointment/checkin/:id").then((res) => {
      setState((state) => ({ ...state, status: "Finished" }));
    })
    .catch((err) => {
        console.log(err);
    });
  };

  const appointmentList = state.map((appointment, index) => (
    <ListGroup horizontal key={index}>
      <ListGroupItem>
        {appointment.firstName} {appointment.lastName}
      </ListGroupItem>
      <ListGroupItem>{appointment.date}</ListGroupItem>
      <ListGroupItem>{appointment.physician}</ListGroupItem>
      <ListGroupItem>
        <a> edit </a>
        <a onClick={(e) => deleteHandler(e, appointment.id, index)}> Delete </a>
        {appointment.status === "Not Started" ? (<a> check-in </a>) : (<a> check-out </a>)}
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
