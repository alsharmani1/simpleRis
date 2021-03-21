const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/api/schedule", (req, res) => {
  let today = new Date().toISOString().slice(0, 10);
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

module.exports = router;
