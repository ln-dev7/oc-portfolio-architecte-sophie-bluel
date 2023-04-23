const BASE_URL = "http://localhost:5678/api";

// --- Récupération des travaux depuis le back-end

const gallery = document.querySelector(".gallery");
const loadingIndicator = document.querySelector(".loading-indicator");
const errorIndicator = document.querySelector(".error-indicator");

const modalContent = document.querySelector(".modal-content");

// Affiche l'indicateur de chargement
loadingIndicator.style.display = "block";

fetch(`${BASE_URL}/works`)
  .then((response) => response.json())
  .then((works) => {
    // Supprime l'indicateur de chargement
    loadingIndicator.style.display = "none";

    // Ajoute les projets à la galerie
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      gallery.appendChild(figure);
    });
  })
  .catch((error) => {
    // Affiche l'indicateur d'erreur
    errorIndicator.style.display = "block";

    // Supprime l'indicateur de chargement
    loadingIndicator.style.display = "none";

    console.error("Erreur lors de la récupération des projets : ", error);
  });

// --- Réalisation du filtre des travaux
const categoryButtons = document.querySelector(".category-buttons");

// Récupère les catégories depuis l'API
fetch(`${BASE_URL}/categories`)
  .then((response) => response.json())
  .then((categories) => {
    const categorySet = new Set();

    // Ajoute chaque catégorie à un Set pour éviter les doublons
    categories.forEach((category) => {
      categorySet.add(category.name);
    });

    // Ajoute les catégories à des boutons dans la page
    categorySet.forEach((categoryName) => {
      const button = document.createElement("button");
      button.textContent = categoryName;
      categoryButtons.appendChild(button);
    });

    const filterButtons = [...categoryButtons.querySelectorAll("button")];

    // Ajoute un écouteur d'événement sur chaque bouton pour filtrer les projets
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Supprime la classe active de tous les boutons de filtrage
        filterButtons.forEach((btn) => {
          btn.classList.remove("active");
        });

        // Ajoute la classe active au bouton sélectionné
        button.classList.add("active");

        const category = button.textContent;
        filterProjectsByCategory(category);
      });
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des catégories : ", error);
  });

// Filtre les projets en fonction de la catégorie sélectionnée
function filterProjectsByCategory(category) {
  fetch(`${BASE_URL}/works`)
    .then((response) => response.json())
    .then((works) => {
      if (category === "Tous") {
        updateGallery(works);
        return;
      }
      const filteredWorks = works.filter(
        (work) => work.category.name === category
      );
      updateGallery(filteredWorks);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets : ", error);
    });
}

// Met à jour la galerie avec les projets filtrés
function updateGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

// --- Gerer la boite modal

const portfolioEdit = document.querySelector(".portfolio-edit");
const closeModalButton = document.querySelector(".modal-close");
const modalContainer = document.querySelector(".modal-container");
const modal = document.querySelector(".modal");

portfolioEdit.addEventListener("click", () => {
  openModal();
});

closeModalButton.addEventListener("click", () => {
  closeModal();
});

modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    closeModal();
  }
});

function openModal() {
  modalContainer.classList.add("show");
  setTimeout(() => {
    modal.classList.add("show");
  }, 300);
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => {
    modalContainer.classList.remove("show");
  }, 300);
}

// --- Gerer les elements a afficher si l'utilisateur est connecte ou non
const token = localStorage.getItem("token");
const loginBtn = document.querySelector("#login-btn");
const logoutBtn = document.querySelector("#logout-btn");
const modeBar = document.querySelector(".mode");

if (token) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
  modeBar.style.display = "flex";
  portfolioEdit.style.display = "flex";

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  });
} else {
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
  modeBar.style.display = "none";
  portfolioEdit.style.display = "none";
}
