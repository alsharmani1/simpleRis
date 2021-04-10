const express = require("express");
const router = express.Router();
const pool = require("../config/db");

//Change User Role
router.post("/api/admin/role", (req, res) => {
  const query = `UPDATE users SET userRole="${req.body.userRole}" WHERE username="${req.body.username}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(400)
        .json({ message: "Unable to change user role", status: 400 });
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
        .json({ message: "Unable to change user role", status: 400 });
    }
    res.status(200).send("Updated date successfully");
  });
});

module.exports = router;
