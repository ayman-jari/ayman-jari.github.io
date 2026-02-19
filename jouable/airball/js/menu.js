const playBtn = document.getElementById("playBtn");
const nameInput = document.getElementById("playerName");
const colorOptions = document.querySelectorAll(".colorOption");
const corps = document.querySelector(".joueur-apercu");

function setSelectedColor(color) {
    corps.style.backgroundColor = color;
    localStorage.setItem("playerColor", color);

    colorOptions.forEach(option => {
        option.classList.remove("selected");
        if (option.dataset.color === color) {
            option.classList.add("selected");
        }
    });
}

function checkPlayButton() {
    playBtn.disabled = nameInput.value.trim() === "";
}

function initMenu() {
    const savedColor = localStorage.getItem("playerColor") || "#ffffff";
    setSelectedColor(savedColor);
    checkPlayButton();
}

// Clic sur couleur
colorOptions.forEach(option => {
    option.addEventListener("click", () => {
        const selectedColor = option.dataset.color;
        setSelectedColor(selectedColor);
    });
});

// Clic sur jouer
playBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const color = localStorage.getItem("playerColor") || "#ffffff";
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerColor", color);
    window.location.href = "jeu.html";
});

// Écoute la saisie du pseudo
nameInput.addEventListener("input", checkPlayButton);

// Init au chargement ET au retour depuis historique
window.addEventListener("DOMContentLoaded", initMenu);
window.addEventListener("pageshow", initMenu);