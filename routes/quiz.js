var express = require('express');
var router = express.Router();
var seedrandom = require('seedrandom');
const fs = require("fs");

const questionsFileName = "./model/questions.json";
const counterFileName =  "./model/counter.json";
const qCheckFileName = "./model/questionCheck.json";

function readQuestions() {
    let data = fs.readFileSync(questionsFileName, "utf-8");
    return JSON.parse(data);
}

function readCounter() {
    let data = fs.readFileSync(counterFileName, "utf-8");
    return JSON.parse(data);
}

function writeCounter(tracker) {
    let data = JSON.stringify(tracker, null, 2);
    fs.writeFileSync(counterFileName, data, "utf-8");
}

function readQCheck() {
    let data = fs.readFileSync(qCheckFileName, "utf-8");
    return JSON.parse(data);
}

function writeQCheck(check) {
    let data = JSON.stringify(check, null, 2);
    fs.writeFileSync(qCheckFileName, data, "utf-8");
}

function repeatQ(q) {
    let qcheck = readQCheck();
    if (qcheck. length === 0) {
        return false;
    }

    for (const quest of qcheck) {
        if (q.question === quest.question) {
            return true;
        }
    }
    return false;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    let questionsDB = readQuestions();
    let rand = seedrandom();
    let randInt = rand.int32() % questionsDB.length;
    if(randInt < 0) {
        randInt += questionsDB.length;
    }
    var questions = questionsDB[randInt];
    
    while (repeatQ(questions)) {
        let newRand = seedrandom();
        let newRandInt = newRand.int32() % questionsDB.length;
        if(newRandInt < 0) {
            newRandInt += questionsDB.length;
        }
        questions = questionsDB[newRandInt];
    }

    let qcheck = readQCheck();
    qcheck.push(questions);
    writeQCheck(qcheck);

    let count = readCounter();

    res.render('quiz', {
        quiz: questions,
        num: count.counter
    });
});

router.get('/result', function(req, res, next) {
    let tracker = readCounter();
    let currCount = tracker.counter;
    let currScore = tracker.score;

    res.render('result', {
        score: currScore,
        count: currCount
    });


});

router.post("/next", (req, res) => {
    let tracker = readCounter();
    let check = readQCheck();
    let currCount = tracker.counter;
    let currScore = tracker.score;

    if (req.body.choice === check[currCount].answer) {
        currScore = currScore + 1;
    }
    currCount = currCount + 1;

    let newCount = {
        "counter": currCount,
        "score": currScore
    }

    writeCounter(newCount);

    if(currCount < 10) {
        return res.redirect("/quiz");
    } else {
        return res.redirect("/quiz/result");
    }
});

router.get("/reset", (req, res) => {
    let tracker = readCounter();
    tracker.score = 0;
    tracker.counter = 0;
    writeCounter(tracker);

    let clear = readQCheck();
    clear = [

    ];
    writeQCheck(clear);

    res.redirect("/quiz");
});


module.exports = router;