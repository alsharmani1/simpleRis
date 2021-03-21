const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/api/patient/search", (req, res) => {
  const keys = Object.keys(req.body);
  let formattedQuery = ["SELECT * FROM patients"];

  keys
    .filter((item) => req.body[item].trim() && item)
    .forEach((item, index) => {
      if (index === 0) {
          formattedQuery.push(`WHERE ${item}="${req.body[item]}"`);
      } else {
          formattedQuery.push(`AND ${item}="${req.body[item]}"`);
      }
    });

  pool.query(formattedQuery.join(" "), async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve search results");
    }
    res.status(200).send(results);
  });
});

module.exports = router;
