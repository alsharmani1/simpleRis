require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const path = require('path')

//config env variables

//Request Parsing/Parse incoming JSON

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRoutes)

app.listen(5000, () => {
    console.log("Running on port 5000")
    console.log(process.env.NODE_ENV);
})