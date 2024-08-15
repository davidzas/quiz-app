// Function to handle the registration process
function registerUser() {
  // Get the field values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Initialize Firebase Authentication and get a reference to the service
  const auth = window.app.auth();

  // Create a new user with email and password
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("User registered successfully:", user);

      // You can also save the user's name or other info in the database here
      // For example, update the user's profile
      user
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          console.log("User profile updated with name:", name);
          alert("User registered successfully!");
          window.location.href = "./login.html";
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });

      // Redirect to another page or show a success message
      // window.location.href = "welcome.html"; // Redirect to welcome page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error registering user:", errorCode, errorMessage);
      // Display error message to the user
      alert(`Error: ${errorMessage}`);
    });
}

// Attach the registerUser function to your registration form's submit event
document.getElementById("register-button")?.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the form from submitting normally
  registerUser(); // Call the register function
});
