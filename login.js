function loginUser() {
  // Get the field values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Initialize Firebase Authentication and get a reference to the service
  const auth = window.app.auth();

  // Sign in the user with email and password
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      window.user = userCredential.user;
      console.log("User logged in successfully:", user);
      window.location.href = "./index.html";
      // Redirect to another page or show a success message
      // window.location.href = "dashboard.html"; // Redirect to a dashboard page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error logging in user:", errorCode, errorMessage);
      // Display error message to the user
      alert(`Error: ${errorMessage}`);
    });
}

// Attach the loginUser function to your login form's submit event
document.getElementById("login-button").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the form from submitting normally
  loginUser(); // Call the login function
});
