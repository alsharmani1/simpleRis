import axios from "axios";
import React, { useState, useEffect } from "react";

const VisitHistory = (props) => {
  const patient = props.patientInfo;
  const [state, setState] = useState({ fetching: true, patient, visits: [] });
  useEffect(() => {
    axios.get(`/api/appointment/get/${patient.id}`).then((res) => {
      let visits = [];
      res.data.forEach((visit) => {
        if (visit.status === "Complete") {
          visits.push(visit.appointmentId);
        }
      });
      setState((state) => ({ ...state, visits, fetching: false }));
    });
  }, []);

  if (state.fetching) return "";
  return (
    <div className="container mt-5">
      <h4>Past Vists</h4>

      {state.visits.length ? (
        <ul>
          {state.visits.map((id, i) => {
            return (
              <li key={i}>
                <a href={`/patients/${id}`}>{id}</a>
              </li>
            );
          })}
        </ul>
      ) : (
        "There are no past visits for this patient."
      )}
    </div>
  );
};

export default VisitHistory;
