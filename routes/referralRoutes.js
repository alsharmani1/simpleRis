const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// UPDATE APPOINTMENT 
router.post("/api/referrals/update", (req, res) => {
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
  
    if(req.body.createReferral === "Yes") {
      const { appointmentId, details} = req.body
      let referralQuery = `INSERT INTO referrals (appointmentId, appointmentDetails, ) VALUES ("${appointmentId}", "${details}", "${}", "${}")`
      pool.query(query, async (error, results, fields) => {
        if (error) {
          console.log(error);
          res
            .status(400)
            .json({ message: "Unable to save appointment.", status: 400 });
        }
        res.status(200).send("Saved appointment info!");
      });
    }
  });

module.exports = router;
