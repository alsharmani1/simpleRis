require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const routes = require('./routes/routes')
const path = require('path')
const pool = require('./config/db')

//config env variables

//Request Parsing/Parse incoming JSON

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render("common/home", { layout: false, userName: "Sharmani" });
})

app.get('/api/getUserInfo', (req, res) => {
  console.log(req)
  res.json({username: "Sharmani", age: 24})
})

app.use(routes)

pool.on('connection', function (connection) {
  console.log("connection, ", connection)
});

app.listen(5000, () => {
    console.log("Running on port 5000")
    console.log(process.env.NODE_ENV);
})