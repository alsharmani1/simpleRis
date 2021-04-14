const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../config/db");
const axios = require("axios");
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// UPLOAD WORKLIST IMAGES
router.post(
  "/api/worklist/upload/:referralAppointmentId",
  upload.array("images"),
  async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    try {
      const appointmentInfo = await axios.get(
        `http://localhost:5000/api/referrals/referral/${req.params.referralAppointmentId}`
      );
      let imagePath = [];

      req.files.forEach(({ filename }) => {
        console.log(filename);
        imagePath.push(`./uploads/${filename}`);
      });

      // console.log(appointmentInfo)
      const {
        patientId,
        scanArea,
        scanType,
        appointmentId,
        radiologist,
        radiologistId,
        physicianId: referringPhysicianId,
        referralAppointmentId,
      } = appointmentInfo.data;
      let query = `
    INSERT INTO worklist (patientId, scanArea, scanType, appointmentId, referralAppointmentId, radiologist, radiologistId, referringPhysicianId, imagePath) 
    VALUES ("${patientId}", "${scanArea}", "${scanType}", "${appointmentId}", "${referralAppointmentId}", "${radiologist}", "${radiologistId}", "${referringPhysicianId}", "${imagePath.join(
        "|"
      )}")`;
      pool.query(query, async (error, results, fields) => {
        if (error) {
          console.log(error);

          res.status(400).send("Unable to upload images.");
        }
        res.status(200).send("Uploaded images successfully!");
      });
    } catch (error) {
      res.status(400).send("Error while uploading images.");
    }
  }
);

//GET WORKLIST BY referralAppointmentId
router.get("/api/worklist/:referralAppointmentId", (req, res) => {
  let query = `SELECT * FROM worklist WHERE referralAppointmentId="${req.params.referralAppointmentId}" OR appointmentId="${req.params.referralAppointmentId}"`;
  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to upload images.");
    }
    console.log(results)

    const imagePathsArray = results[0].imagePath.replace(/\.\//g, "http://localhost:5000/").split("|")
    const finalResult = {...results[0], finalImagePaths: imagePathsArray}
    res.status(200).json(finalResult);
  });
});
 
module.exports = router;