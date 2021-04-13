require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const searchRoutes = require('./routes/searchRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const patientRoutes = require('./routes/patientRoutes')
const referralRoutes = require('./routes/referralRoutes')
const worklistRoutes = require('./routes/worklistRoutes')
const DevRoutes = require('./routes/DevRoutes')
const path = require('path')

//Request Parsing/Parse incoming JSON

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRoutes)
app.use(searchRoutes)
app.use(scheduleRoutes)
app.use(patientRoutes)
app.use(referralRoutes)
app.use(worklistRoutes)
app.use(DevRoutes)

app.listen(5000, () => {
    console.log("Running on port 5000")
    console.log(process.env.NODE_ENV);
})