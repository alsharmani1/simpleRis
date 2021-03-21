import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

function Schedule  () {
  const [state, setState] = useState([
    {
      id: "",
      firstName: "",
      lastName: "",
      time: "",
      date: "",
      physician: "",
    },
  ])
  
    useEffect(() => {
      axios.get("/api/schedule", state)
      .then(res => {
        console.log(res)
        setState(res.data)
      }) 
      .catch(err => {
        console.log(err)
      })  
    }, [])
  const appointmentList = state.map(appointment => (
    <ListGroup horizontal>
      <ListGroupItem action href = "/patient/:id">{appointment.firstName} {appointment.lastName}</ListGroupItem> 
      <ListGroupItem>{appointment.date}</ListGroupItem>
      <ListGroupItem>{appointment.time}</ListGroupItem>
      <ListGroupItem>{appointment.physician}</ListGroupItem>
      <ListGroupItem action href = "appointments/:id">edit</ListGroupItem>
      <ListGroupItem action href = "/api/appointment/delete/:id" METHOD DELETE>delete</ListGroupItem> 
      <ListGroupItem action href = "/api/appointment/checkin/:id" METHOD POST>check-in</ListGroupItem>
      <ListGroupItem action href = "/api/appointment/checkin/:id" METHOD POST>check-out</ListGroupItem> 
    </ListGroup>))
  return (
    <div>
      <div className = "schedule">
        {appointmentList}
      </div>
    </div>
  );
};

export default Schedule;
