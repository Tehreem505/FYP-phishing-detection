const questions = [
    {
        text: "Your bank asks you to click a link and login urgently.",
        correct: "phishing",
        explanation: "Banks never ask for login details via email."
    },
    {
        text: "Email from your university official domain.",
        correct: "legit",
        explanation: "Trusted domain is usually safe."
    },
    {
        text: "You won a lottery you never entered.",
        correct: "phishing",
        explanation: "This is a common scam trick."
    },
    {
        text: "Secure HTTPS website of known company.",
        correct: "legit",
        explanation: "HTTPS and known domain indicates safety."
    },
    {
        text: "Message asking for OTP immediately.",
        correct: "phishing",
        explanation: "Never share OTP with anyone."
    }
];

let index = 0;
let score = 0;

function loadQuestion() {
    document.getElementById("question").innerText = questions[index].text;
    document.getElementById("feedback").innerText = "";
}

function answer(user) {
    if (user === questions[index].correct) {
        score++;
        document.getElementById("feedback").innerText =
            "Correct! " + questions[index].explanation;
    } else {
        document.getElementById("feedback").innerText =
            "Wrong! " + questions[index].explanation;
    }

    index++;

    if (index < questions.length) {
        setTimeout(loadQuestion, 1500);
    } else {
        setTimeout(() => {
            document.getElementById("question").innerText =
                "Quiz Finished! Score: " + score + "/" + questions.length;
            document.getElementById("feedback").innerText = "";
        }, 1500);
    }
}

loadQuestion();