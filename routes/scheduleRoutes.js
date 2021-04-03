const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { converTime } = require("../helpers/helpers");

const getCurrentDateTimeMySql = () => {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  var mySqlDT = localISOTime;
  return mySqlDT;
};

router.get("/api/schedule", (req, res) => {
  const today = getCurrentDateTimeMySql().split(" ")[0];
  let query = `
    SELECT appointments.*, patients.firstName, patients.lastName 
    FROM appointments INNER JOIN patients on appointments.patientId=patients.id 
    WHERE appointments.date="${today}"
    `;
  console.log(today);
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve schedule");
    }
    res.status(200).send(results);
  });
});

router.post("/api/appointment/create", (req, res) => {
  const { date, patientId, physician, status, appointmentId, time } = req.body;
  let query = `
    INSERT INTO appointments (date, patientId, physician, status, appointmentId, time) VALUES ("${date}", "${patientId}", "${physician}", "${status}", "${appointmentId}", "${time}");
    `;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve schedule");
    }
    res.status(200).send(results);
  });
});

module.exports = router;
