const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// UPLOAD WORKLIST IMAGES
router.post("/api/worklist/upload/:appointmentId", async (req, res) => {
    console.log(req.body)
//   let query = `DELETE FROM referrals WHERE id="${req.params.id}"`;
//   pool.query(query, async (error, results, fields) => {
//     if (error) {
//       console.log(error);
//       res.status(400).send("Unable to delete referral.");
//     }
//     res.status(200).send("Deleted referral successfully!");
//   });
res.status(200).send("Deleted referral successfully!");

});

module.exports = router;