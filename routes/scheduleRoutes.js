const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const getCurrentDateTimeMySql = () => {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  var mySqlDT = localISOTime;
  return mySqlDT;
};

//GET ALL APPOINTMENTS
router.post("/api/appointments", (req, res) => {
  const { jobRole, userId } = req.body;
  const today = getCurrentDateTimeMySql().split(" ")[0];
  let query = `
    SELECT appointments.*, patients.firstName, patients.lastName 
    FROM appointments INNER JOIN patients on appointments.patientId=patients.id 
    WHERE appointments.date="${today}" AND appointments.status="Not Started" OR appointments.status="Pending"
    `;

  query =
    jobRole === "MD" || jobRole === "radiologist"
      ? query +
        ` AND appointments.status="Pending" AND appointments.physicianId="${userId}"`
      : jobRole === "technician"
      ? query + ` AND appointments.appointmentId LIKE '%RT-%'`
      : query;

      console.log(query)

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve schedule");
    }
    res.status(200).send(results);
  });
});

//GET ONE APPOINTMENTS
router.get("/api/appointment/:appointmentId", (req, res) => {
  let query = `
    SELECT * FROM appointments WHERE appointmentId="${req.params.appointmentId}"
    `;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve appointment");
    }
    res.status(200).send(results[0]);
  });
});


//GET ALL APPOINTMENTS FOR USER
router.get("/api/appointment/get/:patientId", (req, res) => {
  let query = `
    SELECT * FROM appointments WHERE patientId="${req.params.patientId}"
    `;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve appointment");
    }
    console.log({id: req.params.patientId, results})
    res.status(200).send(results);
  });
});

//CREATE APPOINTMENT
router.post("/api/appointment/create", (req, res) => {
  const {
    date,
    patientId,
    physician,
    status,
    appointmentId,
    time,
    physicianId,
  } = req.body;
  let query = `
    INSERT INTO appointments (date, patientId, physician, status, appointmentId, time, physicianId) VALUES ("${date}", "${patientId}", "${physician}", "${status}", "${appointmentId}", "${time}", "${physicianId}");
    `;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      res.status(400).send("Unable to retrieve schedule");
    }
    res.status(200).send("Appointment created successfully!");
  });
});

// UPDATE APPOINTMENT
router.post("/api/appointment/update", (req, res) => {
  let query = "UPDATE appointments SET";
  const dataKeys = Object.keys(req.body);
  const formatQuery = dataKeys.map((key, index) => {
    if (index !== 0 && index !== dataKeys.length - 1)
      return `${key}="${req.body[key]}",`;
    if (index === dataKeys.length - 1) return `${key}="${req.body[key]}"`;
  });

  query = `${query} ${formatQuery.join(" ")} WHERE appointmentId="${
    req.body.appointmentId
  }"`;

  console.log(query);
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to save appointment.");
    }
    res.status(200).send("Saved appointment info!");
  });
});

router.post("/api/appointment/status/:id", (req, res) => {
  const status = req.body.status === "Check-in" ? "Pending" : "Complete";
  let query = `UPDATE appointments SET status="${status}" WHERE appointmentId="${req.params.id}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to save appointment status");
    }
    res.status(200).send("Saved status successfully!");
  });
});

router.delete("/api/appointment/delete/:id", (req, res) => {
  let query = `DELETE FROM appointments WHERE appointmentId="${req.params.id}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to delete appointment");
    }
    res.status(200).send("Appointment deleted successfully!");
  });
});

router.post("/api/appointment/diagnosis/:appointmentId", (req, res) => {
  let query = `UPDATE appointments SET details="${req.body.details}", createReferral="${req.body.createReferral}" WHERE appointmentId="${req.params.appointmentId}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to appointment details");
    }
    res.status(200).send("Appointment details saved successfully!");
  });
});

module.exports = router;
