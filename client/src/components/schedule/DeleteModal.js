import React, { useState } from "react";
import { Form, Button, Modal, Col } from "react-bootstrap";

const DeleteModal = ({
  showModal,
  toggleModal,
  deleteHandler,
  deleteAppointmentInfo,
}) => {
  const { appointmentId, index } = deleteAppointmentInfo;
  return (
    <Modal show={showModal}>
      <Modal.Header>
        <Modal.Title>Create Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you would like to delete this appointment?</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            toggleModal();
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={(e) => deleteHandler(appointmentId, index)}
        >
          Delete Appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
