// variable for start time
let secondsLeft = 76;

// displays the time
let timer = document.getElementById("timer");

// high scores div
let scoresDiv = document.getElementById("scores-div");
let buttonsDiv = document.getElementById("buttons");
let viewScoresBtn = document.getElementById("view-scores");

// start button div
let startButton = document.getElementById("start-button");
startButton.addEventListener("click", setTime);
// variable for questions 
var questionDiv = document.getElementById("question-div");
// variable for the results
let results = document.getElementById("results");
// variable for the choices
var choices = document.getElementById("choices");
// empty array to store the high scores
let emptyArray = [];
// array of high score sfrom local storage
let storedArray = JSON.parse(window.localStorage.getItem("highScores"));
// keeping track of which question we are on
var questionCount = 0;
// keeps score
let score = 0;
// timer starts when the user clicks the startButton
function setTime() {
    displayQuestions();
    let timerInterval = setInterval(function() {
        secondsLeft--;
        timer.textContent = "Time: " + secondsLeft;
        if (secondsLeft <= 0 || questionCount === questions.length) {
            clearInterval(timerInterval);
            captureUserScore();
        }
    }, 1000);
}
// function to load the questions on the page
function displayQuestions() {
    removeEls(startButton);
  
    if (questionCount < questions.length) {
      questionDiv.innerHTML = questions[questionCount].title;
      choices.textContent = "";
  
      for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
        let el = document.createElement("button");
        el.innerText = questions[questionCount].multiChoice[i];
        el.setAttribute("data-id", i);
        el.addEventListener("click", function (event) {
          event.stopPropagation();
  
          if (el.innerText === questions[questionCount].answer) {
            score += secondsLeft;
          } else {
            score -= 10;
            secondsLeft = secondsLeft - 15;
          }
          
          questionDiv.innerHTML = "";
  
          if (questionCount === questions.length) {
            return;
          } else {
            questionCount++;
            displayQuestions();
          }
        });
        choices.append(el);
      }
    }
}
// function for displaying and tracking scores    
function captureUserScore() {
    timer.remove();
    choices.textContent = "";

    let initialsInput = document.createElement("input");
    let postScoreBtn = document.createElement("input");

    results.innerHTML = `You scored ${score} points! Enter initials: `;
    initialsInput.setAttribute("type", "text");
    postScoreBtn.setAttribute("type", "button");
    postScoreBtn.setAttribute("value", "Post My Score!");
    postScoreBtn.addEventListener("click", function (event) {
        event.preventDefault();
        let scoresArray = defineScoresArray(storedArray, emptyArray);

        let initials = initialsInput.value;
        let userAndScore = {
        initials: initials,
        score: score,
        };

        scoresArray.push(userAndScore);
        saveScores(scoresArray);
        displayAllScores();
        clearScoresBtn();
        goBackBtn();
        viewScoresBtn.remove();
    });
    results.append(initialsInput);
    results.append(postScoreBtn);
}

const saveScores = (array) => {
    window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
    if(arr1 !== null) {
        return arr1
    } else {
        return arr2
    }
}

const removeEls = (...els) => {
    for (let el of els) el.remove();
}

function displayAllScores() {
    removeEls(timer, startButton, results);
    let scoresArray = defineScoresArray(storedArray, emptyArray);

    scoresArray.forEach(obj => {
        let initials = obj.initials;
        let storedScore = obj.score;
        let resultsP = document.createElement("p");
        resultsP.innerText = `${initials}: ${storedScore}`;
        scoresDiv.append(resultsP);
    });
}
// function for viewing the high scores
function viewScores() {
    viewScoresBtn.addEventListener("click", function(event) {
        event.preventDefault();
        removeEls(timer, startButton);
        displayAllScores();
        removeEls(viewScoresBtn);
        clearScoresBtn();
        goBackBtn();
    });
}
// function for clearing the saved highscores
function clearScoresBtn() {    
    let clearBtn = document.createElement("input");
    clearBtn.setAttribute("type", "button");
    clearBtn.setAttribute("value", "Clear Scores");
    clearBtn.addEventListener("click", function(event){
        event.preventDefault();
        removeEls(scoresDiv);
        window.localStorage.removeItem("highScores");
    })
    scoresDiv.append(clearBtn)
}
// function for using the go back button
function goBackBtn() {
    let backBtn = document.createElement("input");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("value", "Go Back");
    backBtn.addEventListener("click", function(event){
        event.preventDefault();
        window.location.reload();
    })
    buttonsDiv.append(backBtn)
}


viewScores();