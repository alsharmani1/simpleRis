const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { hash, compare } = require("../helpers/helpers");

router.get("/api/logout", (req, res) => {
  res.clearCookie("auth").send();
});

router.post("/api/login", (req, res) => {
  const { id, username, password: reqPassword, userRole } = req.body;
  const userExistsQuery = `
  SELECT * FROM users WHERE username="${username}"
`;

  pool.query(userExistsQuery, async (error, results, fields) => {
    if (error) console.log(error);
    const { password, username, firstName, userRole, id } = results[0];

    try {
      const hashedPassword = await compare(reqPassword, results[0].password);
      if (hashedPassword) {
        res
          .cookie("auth", username, { maxAge: 60 * 60 * 8 })
          .status(200)
          .json({ name: firstName, userRole, userId: id, username });
      } else {
        res.status(401).send("Username or password is wrong");
      }
    } catch (error) {
      console.log(error);
      res.status(409).send("There was an error on the server");
    }
  });
});

// AUTH USER
router.get("/api/auth/users/:username", (req, res) => {
  let query = `SELECT * FROM users WHERE username="${req.params.username}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve specified users");
    }

    const { firstName, id, userRole, username } = results[0];
    res.status(200).json({ name: firstName, userId: id, userRole, username });
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
        res.status(409).send("User already exists");
      }
    });
  });
});

//GET SPECIFIC USER BY USER ROLE
router.get("/api/users/:userRole", (req, res) => {
  let query = `SELECT * FROM users WHERE userRole="${req.params.userRole}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve specified users");
    }
    res.status(200).send(results);
  });
});

// GET SPECIFIC USER BY ID
router.get("/api/user/:userId", (req, res) => {
  let query = `SELECT * FROM users WHERE userRole="${req.params.userId}"`;

  pool.query(query, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).send("Unable to retrieve specified user");
    }
    res.status(200).send(results);
  });
});
module.exports = router;
