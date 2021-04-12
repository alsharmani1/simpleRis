const express = require("express");
const router = express.Router();
const pool = require("../config/db");

//CREATE PATIENT
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
      res
        .status(400)
        .send("Unable to create new patient");
    }
    res.status(200).send(results);
  });
});

//GET PATIENT INFO
router.get("/api/patients/:id", (req, res) => {
  const createPatientQuery = `
  SELECT * FROM patients where id="${req.params.id}";
`;

  pool.query(createPatientQuery, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(400)
        .send("Unable to get patient info");
    }
    res.status(200).send(results[0]);
  });
});

// UPDATE PATIENT INFO
router.post("/api/patients/update", (req, res) => {
  let query = "UPDATE patients SET";
  const dataKeys = Object.keys(req.body);
  const formatQuery = dataKeys.map((key, index) => {
    if (index !== 0 && index !== dataKeys.length - 1)
      return `${key}="${req.body[key]}",`;
    if (index === dataKeys.length - 1) return `${key}="${req.body[key]}"`;
  });

  query = `${query} ${formatQuery.join(" ")} WHERE id="${req.body.id}"`;

  console.log(query);
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(400)
        .send("Unable to save patient info");
    }
    res.status(200).send("Saved patient info!");
  });
});
module.exports = router;
