import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import DeleteModal from "./DeleteModal";
import NewAppointment from "./NewAppointment";

export const convertHr24To12 = (hour, minute) => {
  const hr = ((parseInt(hour) + 11) % 12) + 1;
  const suffix = parseInt(hour) >= 12 ? "PM" : "AM";
  return `${hr}:${minute} ${suffix}`;
};

function Schedule() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { jobRole } = userInfo;
  const { addToast } = useToasts();
  const [state, setState] = useState([]);
  const [modalState, setModalState] = useState({
    showModal: false,
    showDeleteModal: false,
    appointmentId: "",
  });

  useEffect(() => {
    getSchedule();
  }, []);

  const getSchedule = () => {
    axios
      .post(`/api/appointments`, userInfo)
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteHandler = (appointmentId, index) => {
    axios
      .delete(`/api/appointment/delete/${appointmentId}`)
      .then((res) => {
        addToast(res.data, {
          appearance: "success",
          autoDismiss: true,
        });
        setState((state) => {
          let list = [...state];
          list.splice(index, 1);
          return list;
        });
        setModalState((state) => ({
          ...state,
          showDeleteModal: !state.showDeleteModal,
        }));
      })
      .catch((error) => {
        addToast(error.response.data, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const checkInOutHandler = (e, appointmentId, status) => {
    e.preventDefault();
    axios
      .post(`/api/appointment/status/${appointmentId}`, { status })
      .then((res) => {
        getSchedule();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleModal = (appointmentInfo) =>
    setModalState((state) => ({
      ...state,
      showModal: !state.showModal,
      appointmentInfo,
    }));

  const toggleDeleteModal = (appointmentId, index) =>
    setModalState((state) => ({
      ...state,
      showDeleteModal: !state.showDeleteModal,
      deleteAppointmentInfo: {
        appointmentId,
        index,
      },
    }));

  const saveAppointment = (appointmentState) => {
    axios
      .post("/api/appointment/update", appointmentState)
      .then((res) => {
        setModalState((state) => ({ ...state, showModal: false }));
        addToast(res.data, {
          appearance: "success",
          autoDismiss: true,
        });
        getSchedule();
      })
      .catch((error) =>
        addToast("Unable to save patient info", {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  const AppointmentList = () => {
    return (
      <div>
        {state.length && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Physician</th>
                <th>Appointment ID</th>
                {(jobRole === "receptionist" || jobRole === "technician") && (
                  <th>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {state.map((info, index) => {
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

                const hm = time.split(":");
                const statusName =
                  status === "Not Started" ? "Check-in" : "Check-out";
                return (
                  status !== "Complete" && (
                    <tr key={index}>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (
                              status === "Not Started" &&
                              jobRole === "technician"
                            ) {
                              addToast("Patient has not checked in yet.", {
                                appearance: "info",
                                autoDismiss: true,
                              });
                            } else {
                              window.location =
                                jobRole === "MD"
                                  ? `/appointments/${appointmentId}`
                                  : jobRole === "radiologist" ||
                                    jobRole === "technician"
                                  ? `/worklist/${appointmentId}`
                                  : `/patients/${patientId}`;
                            }
                          }}
                        >{`${lastName}, ${firstName}`}</a>
                      </td>
                      <td>{date}</td>
                      <td>{convertHr24To12(hm[0], hm[1])}</td>
                      <td>{physician}</td>
                      <td>{appointmentId}</td>
                      {(jobRole === "receptionist" ||
                        jobRole === "technician") && (
                        <td>
                          {jobRole === "receptionist" && (
                            <>
                              <a
                                href="#"
                                className="mr-2"
                                onClick={(e) => {
                                  toggleModal(info);
                                }}
                              >
                                Edit
                              </a>
                              <a
                                href="#"
                                className="mr-2"
                                onClick={(e) =>
                                  toggleDeleteModal(appointmentId, index)
                                }
                              >
                                Delete
                              </a>
                            </>
                          )}
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              jobRole === "receptionist"
                                ? checkInOutHandler(
                                    e,
                                    appointmentId,
                                    statusName
                                  )
                                : addToast(
                                    "You are only allowed to check-out the patient. Please wait for the patient to be checked in.",
                                    {
                                      appearance: "info",
                                      autoDismiss: true,
                                    }
                                  );
                            }}
                          >
                            {statusName}
                          </a>
                        </td>
                      )}
                    </tr>
                  )
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    );
  };

  return (
    <div>
      {!state.length ? (
        <h4 className="text-center mt-5">
          There are no appointments for today!
        </h4>
      ) : (
        <>
          <h4 className="text-center mt-5 mb-5">TODAY'S SCHEDULE</h4>
          <AppointmentList />
          {modalState.showModal && (
            <NewAppointment
              showModal={modalState.showModal}
              toggleModal={toggleModal}
              appointmentInfo={modalState.appointmentInfo}
              saveAppointment={saveAppointment}
              physicianRole="MD"
            />
          )}
          {modalState.showDeleteModal && (
            <DeleteModal
              showModal={modalState.showDeleteModal}
              toggleModal={toggleDeleteModal}
              deleteHandler={deleteHandler}
              deleteAppointmentInfo={modalState.deleteAppointmentInfo}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Schedule;
