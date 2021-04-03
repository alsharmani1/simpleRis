const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/api/patient/create", (req, res) => {
  const {
    firstName,
    middleInitial,
    lastName,
    phone,
    dob,
    insuranceNum,
  } = req.body;

  const createPatientQuery = `
  INSERT INTO patients (firstName, middleInitial, lastName, phone, dob, insuranceNum)
  VALUES ("${firstName}", "${middleInitial}", "${lastName}", "${phone}", "${dob}", "${insuranceNum}");
`;

  pool.query(createPatientQuery, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).json({ message: "Unable to create new patient", status: 400 });
    }
    res.status(200).send(results);
  });
});


router.get("/api/patients/:id", (req, res) => {
  const createPatientQuery = `
  SELECT * FROM patients where id="${req.params.id}";
`;

  pool.query(createPatientQuery, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).json({ message: "Unable to get patient info", status: 400 });
    }
    res.status(200).send(results);
  });
});
module.exports = router;
