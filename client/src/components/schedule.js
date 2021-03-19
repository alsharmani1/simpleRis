import React, {useState, useEffect} from 'react';
import "../assests/css/schedule.css";

function Schedule  () {
  const [state, setState] = useState({})
    useEffect(() => {
        
    }, [])
 
  const appointmentData = [
    {
      id: "PA-58726",
      firstName: "John",
      lastName: "Smith",
      date: "01/01/20XX 10:00 a.m.",
      physician: "Sheldon Williams"
    },
    
    {
      id: "PA-15973",
      firstName: "Jane",
      lastName: "Stevens",
      date: "01/01/20XX 1:00 p.m.",
      physician: "Jack Hilton"
    },
    {
      id: "PA-58726",
      firstName: "Dan",
      lastName: "Johnson",
      date: "01/01/20XX 3:00 p.m.",
      physician: "Robert Stilton"
    }
  ]
  const appointmentList = appointmentData.map(appointment => (
    <ul>
      <a href= "/patients/:id">{appointment.firstName} {appointment.lastName}</a> {appointment.date} {appointment.physician} 
      <a href = "appointments/:id">edit</a> <a href = "/api/appointment/checkin/:id">Check-In</a> 
    </ul>))
  return (
    <div>
      <div className = "schedule">
        {appointmentList}
      </div>
    </div>
  );
};

export default Schedule;
