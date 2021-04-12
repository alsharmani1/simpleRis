import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import DeleteModal from "../schedule/DeleteModal";
import NewAppointment from "../schedule/NewAppointment";

function Referrals() {
  const { userRole, userId } = JSON.parse(localStorage.getItem("userInfo"));
  const { addToast } = useToasts();
  const [state, setState] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [modalState, setModalState] = useState({
    showModal: false,
    showDeleteModal: false,
    appointmentId: "",
    appointmentIdFromReferral: "",
  });

  useEffect(() => {
    getReferralList();
  }, []);

  const getReferralList = () => {
    axios
      .get(`/api/referrals`)
      .then((res) => {
        setState(res.data.filter(referral => !referral.referralAppointmentId && referral));
        setFetching(false);
      })
      .catch((error) => {
        addToast(error.response.data, {
          appearance: "error",
          autoDismiss: true,
        });
        setFetching(false);
      });
  };

  const deleteHandler = (id, index) => {
    axios
      .delete(`/api/referral/delete/${id}`)
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

  const toggleModal = (appointmentInfo) => {
    let info = { ...appointmentInfo };
    let appointmentIdFromReferral = info.appointmentId;
    delete info.appointmentId;

    setModalState((state) => ({
      ...state,
      showModal: !state.showModal,
      info,
      appointmentIdFromReferral,
      patientId: info.patientId,
    }));
  };

  const toggleDeleteModal = (id, index) =>
    setModalState((state) => ({
      ...state,
      showDeleteModal: !state.showDeleteModal,
      deleteAppointmentInfo: {
        id,
        index,
      },
    }));

  const saveAppointment = (appointmentState) => {
    Promise.all([
      axios.post("/api/appointment/create", {
        ...appointmentState,
        patientId: modalState.patientId,
      }),
      axios.post("/api/referrals/create", {
        referralAppointmentId: appointmentState.appointmentId,
        radiologist: appointmentState.physician,
        radiologistId: appointmentState.physicianId,
        appointmentId: modalState.appointmentIdFromReferral,
      }),
    ])
      .then(([appointment, updateReferral]) => {
        if (appointment && updateReferral) {
          console.log({ appointment, updateReferral });
          setModalState((state) => ({ ...state, showModal: false }));
          addToast("Succesfully created referral appointment!", {
            appearance: "success",
            autoDismiss: true,
          });
          getReferralList();
        }
      })
      .catch((error) =>
        addToast("Unable to save patient info", {
          appearance: "error",
          autoDismiss: true,
        })
      );
  };

  const ReferralsList = () => {
    return (
      <div>
        {state.length && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Scan Type</th>
                <th>Scan Area</th>
                {userRole === "receptionist" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {state.map((info, index) => {
                const { scanType, scanArea, appointmentId, id } = info;
                return (
                  <tr key={index}>
                    <td>
                      <a href={`/appointments/${appointmentId}`}>
                        {appointmentId}
                      </a>
                    </td>
                    <td>{scanType}</td>
                    <td>{scanArea}</td>
                    {userRole === "receptionist" && (
                      <td>
                        <a
                          href="#"
                          className="mr-2"
                          onClick={(e) => {
                            toggleModal(info);
                          }}
                        >
                          Create Appointment
                        </a>
                        <a
                          href="#"
                          className="mr-2"
                          onClick={(e) =>
                            toggleDeleteModal(id, index)
                          }
                        >
                          Delete
                        </a>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    );
  };

  if (fetching) return "";
  return (
    <div>
      {!state.length ? (
        <h4 className="text-center mt-5">There are no referrals!</h4>
      ) : (
        <>
          <h4 className="text-center mt-5 mb-5">REFERRALS LIST</h4>
          <ReferralsList />
          {modalState.showModal && (
            <NewAppointment
              showModal={modalState.showModal}
              toggleModal={toggleModal}
              appointmentInfo={modalState.appointmentInfo}
              saveAppointment={saveAppointment}
              physicianRole="RT"
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

export default Referrals;
