const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { hash, compare } = require("../helpers/helpers");

router.get("/api/logout", (req, res) => {
  res.clearCookie("auth").send();
});

router.post("/api/login", (req, res) => {
  const { username, password: reqPassword, userRole } = req.body;
  const userExistsQuery = `
  SELECT * FROM users WHERE username="${username}"
`;

  pool.query(userExistsQuery, async (error, results, fields) => {
    if (error) console.log(error);
    const { password, firstName, userRole } = results[0];

    try {
      const hashedPassword = await compare(reqPassword, results[0].password);
      if (hashedPassword) {
        res
          .cookie("auth", "User authorized", { maxAge: 60 * 60 * 8 })
          .status(200)
          .json({ name: firstName, userRole });
      } else {
        res
          .status(401)
          .json({ message: "Username or password is wrong", status: 401 });
      }
    } catch (error) {
      console.log(error);
      res
        .status(409)
        .json({ message: "There was an error on the server", status: 409 });
    }
  });
});

//admin users only
router.post("/api/users/create", hash, (req, res) => {
  const {
    firstName,
    lastName,
    username,
    password,
    userRole,
    jobRole,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    const userExistsQuery = `
    SELECT * FROM users WHERE username="${username}"
  `;

    const createUserQuery = `
    INSERT INTO users (firstName, lastName, username, password, userRole, jobRole)
    VALUES ("${firstName}", "${lastName}", "${username}", "${password}", "${userRole}", "${jobRole}");
  `;

    connection.query(userExistsQuery, (error, results, fields) => {
      if (error) console.log(error);

      if (results.length < 1) {
        connection.query(createUserQuery, (error, results, fields) => {
          if (error) console.log(error);
          if (results.insertId) {
            res.status(200).send("User created!");
            console.log("Created new user");
          }
          connection.release();
        });
        res.status(200);
      } else {
        console.log("User already exists");
        res.status(409).json({ message: "User already exists", status: 409 });
      }
    });
  });
});

module.exports = router;
