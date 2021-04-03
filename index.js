require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const searchRoutes = require('./routes/searchRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const patientRoutes = require('./routes/patientRoutes')
const path = require('path')
const pool = require('./config/db')

//config env variables

//Request Parsing/Parse incoming JSON

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRoutes)
app.use(searchRoutes)
app.use(scheduleRoutes)
app.use(patientRoutes)

app.listen(5000, () => {
    console.log("Running on port 5000")
    console.log(process.env.NODE_ENV);
})