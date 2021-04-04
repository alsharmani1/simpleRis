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

router.get("/api/physicians", (req, res) => {
  let query = `SELECT * FROM physicians`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve list of physicians");
    }
    res.status(200).send(results);
  });
});

router.get("/api/schedule", (req, res) => {
  const today = getCurrentDateTimeMySql().split(" ")[0];
  let query = `
    SELECT appointments.*, patients.firstName, patients.lastName 
    FROM appointments INNER JOIN patients on appointments.patientId=patients.id 
    WHERE appointments.date="${today}"
    `;

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

  query = `${query} ${formatQuery.join(" ")} WHERE appointmentId="${req.body.appointmentId}"`;

  console.log(query);
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to save appointment.", status: 400 });
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
module.exports = router;
