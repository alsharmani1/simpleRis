const bcrypt = require("bcrypt");

const hash = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(409).json({
        message: "Unable to create user due to configuration error.",
        status: 409,
      });
    });
};

const compare = (password, hasedPassword) =>
  bcrypt.compare(password, hasedPassword);

const converTime = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};

module.exports = {
  hash,
  compare,
  converTime
};
