const express = require("express")
const router = express.Router()

router.get('/login', (req, res) => {
    res.render("common/login", { layout: false, userName: "Sharmani" });
})

router.post('/login', (req, res) => {
    // const {username, password} = req.body
    console.log(req.body) 

    res.send("Success")
    // res.redirect("/") 
})

module.exports = router