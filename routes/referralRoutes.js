const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// CREATE REFERRAL
router.post("/api/referrals/create", (req, res) => {
  const {
    details,
    appointmentId,
    physicianId,
    patientId,
    scanType,
    scanArea,
  } = req.body;
  const referralExistsQuery = `SELECT * FROM referrals WHERE appointmentId="${appointmentId}"`;

  let createReferralQuery = `INSERT INTO referrals (details, appointmentId, physicianId, patientId, scanType, scanArea) VALUES ("${details}", "${appointmentId}", "${physicianId}", "${patientId}", "${scanType}", "${scanArea}");`;
  let updateReferralQuery = "UPDATE referrals SET";

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(referralExistsQuery, (error, results, fields) => {
      if (error) console.log(error);

      if (req.body.createReferral === "Yes" && results.length === 0) {
        connection.query(createReferralQuery, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(400).send("Unable to save appointment information.");
          } else {
            res.status(200).send("Saved appointment information!");
          }
        });
      } else {
        const dataKeys = Object.keys(req.body);
        const formatQuery =
          results[0] &&
          dataKeys.map((key, index) => {
            if (key !== "createReferral" && key !== "appointmentId") {
              if (index !== dataKeys.length - 1)
                return `${key}="${req.body[key]}",`;
              if (index === dataKeys.length - 1)
                return `${key}="${req.body[key]}"`;
            }
          });

        updateReferralQuery = `${updateReferralQuery} ${formatQuery.join("")} WHERE appointmentId="${req.body.appointmentId}"`;
        results[0] &&
          connection.query(updateReferralQuery, (error, results, fields) => {
            if (error) {
              console.log(error);
              res.status(400).send("Unable to save appointment information.");
            } else {
              res.status(200).send("Saved appointment information!");
            }
          });
      }
    });
  });
});

// GET REFERRAL
router.get("/api/referrals/:appointmentId", async (req, res) => {
  let query = `SELECT * FROM referrals WHERE appointmentId="${req.params.appointmentId}"`;
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve referral information.");
    }
    res.status(200).json(results[0]);
  });
});

// GET ALL REFERRAL
router.get("/api/referrals", async (req, res) => {
  let query = `SELECT * FROM referrals`;
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve referrals.");
    }
    res.status(200).json(results);
  });
});
module.exports = router;
