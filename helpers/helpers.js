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

module.exports = {
  hash,
  compare
};
