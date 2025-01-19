var express = require('express');
var router = express.Router();
const fs = require("fs");
const userDBFileName = "./model/userDB.json";

function readUserDB() {
    let data = fs.readFileSync(userDBFileName, "utf-8");
    return JSON.parse(data);
}

function writeUserDB(users){
    let data = JSON.stringify(users, null, 2);
    fs.writeFileSync(userDBFileName, data, "utf-8");
}

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post("/login/submit", (req, res) => {
    let userDB = readUserDB();
    //TODO
    let acc; 
    for (const user of userDB) {
        if (req.body.username === user.username && req.body.password === user.password) {
            acc = user;
        }
    }

    if (acc == null) {
        console.log("error");
    } else {
        res.redirect("/quiz");
    }
});

router.post("/signup/submit", (req, res) => {
    let userDB = readUserDB();
    //TODO
    userDB.push(req.body);
    writeUserDB(userDB);
});

module.exports = router;