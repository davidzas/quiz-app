var quizData = [];
let currentQuiz = null;
let currentQuestion = 0;
let score = 0;
let currentQuizData = null;
const db = firebase.firestore();
function loadQuestion() {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  questionEl.innerText = quizData[currentQuestion].question;
  optionsEl.innerHTML = "";

  quizData[currentQuestion].options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () => validateAnswer(option));
    optionsEl.appendChild(button);
  });
}

function validateAnswer(selectedOption) {
  const resultEl = document.getElementById("result");
  if (!currentQuizData) {
    currentQuizData = [];
  }
  currentQuizData.push({
    question: quizData[currentQuestion].question,
    selectedOption: selectedOption,
    correctOption: quizData[currentQuestion].correct,
  });
  if (selectedOption === quizData[currentQuestion].correct) {
    score++;
    resultEl.innerText = "Correct!";
  } else {
    resultEl.innerText = "Wrong!";
  }

  currentQuestion++;
  if (currentQuestion < quizData.length) {
    setTimeout(() => {
      resultEl.innerText = "";
      loadQuestion();
    }, 1000);
  } else {
    showScore();
  }
}

function showScore() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = `<h2>Your Score: ${score}/${quizData.length}</h2>`;
  const currentUser = firebase.auth().currentUser;
  const quizAttemptsRef = db.collection(`users/${currentUser.uid}/quizAttempts`);
  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.classList.add("close-btn");
  closeButton.addEventListener("click", () => {
    window.location.reload();
  });
  quizContainer.appendChild(closeButton);
  const quizAttemptData = {
    quizId: currentQuiz.id,
    quizName: currentQuiz.name,
    questionsAnswered: currentQuestion,
    score: score,
    answers: currentQuizData,
  };
  currentQuizData = [];
  quizAttemptsRef
    .add(quizAttemptData)
    .then(() => {
      console.log("Quiz attempt recorded successfully!");
    })
    .catch((error) => {
      console.error("Error recording quiz attempt:", error);
    });
}

document.getElementById("next-btn")?.addEventListener("click", () => {
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showScore();
  }
});

function checkCurrentUser() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, you can access user info here
      window.user = user;
      loadQuizAttempts();
      // loadQuestion();
      loadQuizzes();
    } else {
      // No user is signed in, redirect to login page
      window.location.href = "login.html";
    }
  });
}
const QUIZZES_COLLECTION = "quizes";
function loadQuizzes() {
  db.collection(QUIZZES_COLLECTION)

    .get()
    .then((quizzes) => {
      quizzes.forEach((doc) => {
        if (doc.exists) {
          const quizData = doc.data();

          appendQuiz({ ...quizData, id: doc.id });
        } else {
          console.log("No such quiz found!");
        }
      });
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
    });
}

function appendQuiz(quizDataImported) {
  const quizContainer = document.getElementById("quizzes-list");

  const startButton = document.createElement("button");
  const buttonContainer = document.createElement("div");
  startButton.innerText = "Start Quiz: " + (quizDataImported.name || quizDataImported.id);
  startButton.classList.add("start-btn");
  startButton.addEventListener("click", () => {
    document.getElementById("quizzes-list").style.display = "none";
    quizData = quizDataImported.questions;

    currentQuiz = quizDataImported;
    document.getElementById("quiz-container").style.display = "block";
    loadQuestion();
  });
  buttonContainer.appendChild(startButton);
  quizContainer.appendChild(buttonContainer);
}

function loadQuizAttempts() {
  const currentUser = firebase.auth().currentUser;
  const quizAttemptsRef = db.collection(`users/${currentUser.uid}/quizAttempts`);

  quizAttemptsRef
    .get()
    .then((querySnapshot) => {
      const tableBody = document.getElementById("quiz-attempts-table-body");
      tableBody.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const quizAttemptData = doc.data();
        const row = document.createElement("tr");

        const quizIdCell = document.createElement("td");
        quizIdCell.innerText = quizAttemptData.quizName;
        row.appendChild(quizIdCell);

        const scoreCell = document.createElement("td");
        scoreCell.innerText = quizAttemptData.score;
        row.appendChild(scoreCell);

        const viewButtonCell = document.createElement("td");
        const viewButton = document.createElement("button");
        viewButton.innerText = "View Feedback";
        viewButton.classList.add("view-feedback-btn");
        viewButton.addEventListener("click", () => showFeedback(quizAttemptData.answers));
        viewButtonCell.appendChild(viewButton);
        row.appendChild(viewButtonCell);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading quiz attempts:", error);
    });
}

function showFeedback(answers) {
  const feedbackContainer = document.getElementById("feedback-container");
  feedbackContainer.innerHTML = "";

  answers.forEach((answer) => {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");

    const questionEl = document.createElement("p");
    questionEl.innerText = answer.question;
    questionContainer.appendChild(questionEl);

    const selectedOptionEl = document.createElement("p");
    selectedOptionEl.innerText = "Selected Option: " + answer.selectedOption;
    questionContainer.appendChild(selectedOptionEl);

    const correctOptionEl = document.createElement("p");
    correctOptionEl.innerText = "Correct Option: " + answer.correctOption;
    questionContainer.appendChild(correctOptionEl);

    feedbackContainer.appendChild(questionContainer);
  });

  feedbackContainer.style.display = "block";
}

// Call the function to load quiz attempts

// Call the function to check user status
checkCurrentUser();
