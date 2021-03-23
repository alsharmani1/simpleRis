import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

function Schedule() {
  const [state, setState] = useState([]);

  useEffect(() => {
    getSchedule();
  }, []);

  const getSchedule = () =>
    axios
      .get("/api/schedule")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  const editHandler = (e, appointmentId) => {
    e.preventDefault();
    window.location = `/appointments/${appointmentId}`;
  };

  const deleteHandler = (e, appointmentId, index) => {
    e.preventDefault();
    axios
      .delete(`/api/appointment/delete/${appointmentId}`)
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

  const checkInOutHandler = (e, appointmentId, status) => {
    e.preventDefault();
    axios
      .post(`/api/appointment/status/${appointmentId}`)
      .then((res) => {
        getSchedule()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AppointmentList = () =>
    state.map((info, index) => {
      const {
        firstName,
        lastName,
        physician,
        status,
        time,
        date,
        appointmentId,
        patientId,
      } = info;

      const statusName = status === "Not Started" ? "Check-in" : "Check-out";
      return (
        <div key={index}>
          <h4 className="text-center mt-5 mb-5">TODAY'S SCHEDULE</h4>
          {state.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Physician</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a
                      href={`/patients/${patientId}`}
                    >{`${firstName}, ${lastName}`}</a>
                  </td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{physician}</td>
                  <td>
                    <a
                      href="#"
                      className="mr-2"
                      onClick={(e) => editHandler(e, appointmentId)}
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="mr-2"
                      onClick={(e) => deleteHandler(e, appointmentId, index)}
                    >
                      Delete
                    </a>
                    <a
                      href="#"
                      onClick={(e) =>
                        checkInOutHandler(e, appointmentId, statusName)
                      }
                    >
                      {statusName}
                    </a>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </div>
      );
    });

  return (
    <div>
      {!state.length ? (
        <h4 className="text-center mt-5">
          There are no appointments for today!
        </h4>
      ) : (
        <AppointmentList />
      )}
    </div>
  );
}

export default Schedule;
