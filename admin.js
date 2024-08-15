// Initialize Firestore
const db = firebase.firestore();
const QUIZZES_COLLECTION = "quizes";

// Function to add or modify questions for a specific quiz
function addOrModifyQuestion(event) {
  event.preventDefault();

  // Get the selected quiz ID or name
  // const quizId = document.getElementById("quiz-id").value;

  // If the textarea for multiple questions is filled, handle that case
  if (document.getElementById("questions-input").value.trim() !== "") {
    return addMultipleQuestions(event);
  }

  const question = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const option4 = document.getElementById("option4").value;
  const correctAnswer = document.getElementById("correct-answer").value;

  // Create a question object
  const questionData = {
    question: question,
    options: [option1, option2, option3, option4],
    correct: correctAnswer,
  };

  // Add or modify the question in the specified quiz
  db.collection(QUIZZES_COLLECTION)
    .doc(quizId)
    .update({
      questions: firebase.firestore.FieldValue.arrayUnion(questionData),
    })
    .then(() => {
      console.log("Question added/modified in quiz:", quizId);
      loadQuestions(quizId); // Refresh the question list
    })
    .catch((error) => {
      console.error("Error adding/modifying question:", error);
    });
}

// Function to load and display existing questions for a specific quiz
function loadQuestions(quizId) {
  const questionsUl = document.getElementById("quizzes-container");
  questionsUl.innerHTML = "";

  db.collection(QUIZZES_COLLECTION)

    .get()
    .then((quizzes) => {
      quizzes.forEach((doc) => {
        if (doc.exists) {
          const quizData = doc.data();
          appendQuizData({ ...quizData, id: doc.id });
        } else {
          console.log("No such quiz found!");
        }
      });
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
    });
}

function appendQuizData(quizData) {
  const containerDiv = document.createElement("div");

  // Create an h3 element for the title
  const title = document.createElement("h3");

  title.textContent = "Existing Questions for quiz: " + quizData.id;
  // Create a radio button for quiz selection
  const quizRadioButton = document.createElement("input");
  quizRadioButton.type = "radio";
  quizRadioButton.name = "quiz-id-selected";
  quizRadioButton.value = quizData.id;

  // Create a div element
  const innerDiv = document.createElement("div");

  // Create a ul element
  const ulElement = document.createElement("ul");

  // Append the h3, inner div, and ul to the container div
  containerDiv.appendChild(title);
  containerDiv.appendChild(quizRadioButton);
  containerDiv.appendChild(innerDiv);
  containerDiv.appendChild(ulElement);
  quizData.questions?.forEach((questionData) => {
    const li = document.createElement("li");
    li.textContent = questionData.question;
    ulElement.appendChild(li);
  });
  document.getElementById("quizzes-container").appendChild(containerDiv);
}

// Function to add multiple questions to a specific quiz
function addMultipleQuestions(event) {
  event.preventDefault();

  const questionsInput = document.getElementById("questions-input").value.trim();
  const selectedQuizId = document.querySelector('input[name="quiz-id-selected"]:checked').value;
  try {
    // Parse the JSON input
    const formattedInput = questionsInput.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "");
    const questionsArray = JSON.parse(formattedInput);

    // Validate if it's an array
    if (!Array.isArray(questionsArray)) {
      throw new Error("Input is not a valid array");
    }

    // Process the questions and add them to the specified quiz
    db.collection(QUIZZES_COLLECTION)
      .doc(selectedQuizId)
      .update({
        questions: questionsArray,
      })
      .then(() => {
        console.log("Questions added/modified in quiz:", selectedQuizId);
        // Clear the text area and reload the questions
        document.getElementById("questions-input").value = "";
        loadQuestions();
      })
      .catch((error) => {
        console.error("Error adding questions:", error);
      });
  } catch (error) {
    console.error("Invalid JSON format:", error);
    alert("Invalid JSON format. Please check your input.");
  }
}

// Attach event listener to the form
document.getElementById("quiz-form").addEventListener("submit", addOrModifyQuestion);

// Example: Load questions for a specific quiz on page load
const exampleQuizId = "example-quiz-id"; // Replace with the actual quiz ID
loadQuestions(exampleQuizId);
