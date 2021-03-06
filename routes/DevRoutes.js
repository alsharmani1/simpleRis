const express = require("express");
const router = express.Router();
const pool = require("../config/db");

//Change User Role
router.post("/api/admin/role", (req, res) => {
  const query = `UPDATE users SET userRole="${req.body.userRole}", jobRole="${req.body.jobRole}" WHERE username="${req.body.username}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(400)
        .send("Unable to change user role");
    }
    res.status(200).send("Updated user role");
  });
});

//Change Apoointment Date
router.post("/api/admin/appointment/date", (req, res) => {
  const query = `UPDATE appointments SET date="${req.body.date}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(400)
        .send("Unable to change user role");
    }
    res.status(200).send("Updated date successfully");
  });
});

module.exports = router;
