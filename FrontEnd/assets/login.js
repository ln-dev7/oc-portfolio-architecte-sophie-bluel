const BASE_URL = "http://localhost:5678/api";

// Récupération des éléments du formulaire de connexion
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const errorDiv = document.querySelector("#error-message");

// Fonction pour envoyer les données de connexion au serveur
async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        errorDiv.textContent = "Utilisateur non trouvé";
      }
      if (response.status === 401) {
        errorDiv.textContent = "Mot de passe incorrect";
      }
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Stockage du token d'authentification
    localStorage.setItem("userId", data.userId); // Stockage de l'id de l'utilisateur

    errorDiv.textContent = ""; //

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 100);

  } catch (error) {
    errorDiv.textContent = error.message; 
  }
}

// Ecouteur d'événement sur le formulaire de connexion
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêcher la soumission par défaut du formulaire
  const email = emailInput.value;
  const password = passwordInput.value;

  login(email, password); // Appel de la fonction d'authentification
});
