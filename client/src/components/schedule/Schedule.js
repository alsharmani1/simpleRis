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
    e.preventDefault();
    axios
      .delete(`/api/appointment/delete/${id}`)
      .then((res) => {
        setState((state) => {
          const removeItem = state.splice(index, 1);
          return removeItem;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkInHandler = (e) => {
    e.preventDefault();
    axios
      .post("/api/appointment/checkin/:id")
      .then((res) => {
        setState((state) => ({ ...state, status: "Started" }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkOutHandler = () => {
    axios
      .post("/api/appointment/checkin/:id")
      .then((res) => {
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
        <a style={actionBtnStyle} className="mr-2">
          Edit
        </a>
        <a
          style={actionBtnStyle}
          onClick={(e) => deleteHandler(e, appointment.id, index)}
          className="mr-2"
        >
          Delete
        </a>
        {appointment.status === "Not Started" ? (
          <a style={actionBtnStyle} className="mr-2">
            Check-in
          </a>
        ) : (
          <a style={actionBtnStyle} className="mr-2">
            Check-out
          </a>
        )}
      </ListGroupItem>
    </ListGroup>
  ));

  return (
    <div>
      {!state.length ? (
        <h4 className="text-center mt-5" >There are no appointments for today!</h4>
      ) : (
        <div className="schedule">{appointmentList}</div>
      )}
    </div>
  );
}

const actionBtnStyle = {
  cursor: "pointer",
  color: "blue",
};
export default Schedule;
