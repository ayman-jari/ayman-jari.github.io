"use strict";

window.addEventListener("load", () => {
    const contexte = document.getElementById("simulateur").getContext("2d");
    const monstreToggle = document.getElementById('monstre');

    Object.keys(boutons).forEach((id) => {
        document.getElementById(id).addEventListener("click", (e) => {
            Object.keys(boutons).forEach((id) => {
                document.getElementById(id).disabled = false;
            });
            document.getElementById(id).disabled = id === e.target.id;
            type_image_monde = boutons[id].type_image_monde;
            type_train = boutons[id].type_train;
            document.getElementById("simulateur").addEventListener("click", gerer_clics_plateau);
        });
    });

    document.getElementById("bouton_pause").addEventListener("click", gererPause);

    plateau = new Plateau();
    cree_plateau_initial(plateau);
    let comportement = monstreToggle.checked ? MONSTRE_DEPLACEMENT_POURSUIVRE : MONSTRE_DEPLACEMENT_RANDOM;
    monstre = new Monstre(10, 10, comportement);
    dessine_plateau(contexte, plateau);

    // Ajouter un écouteur pour le changement d'état du bouton "monstre"
    monstreToggle.addEventListener('change', () => {
        monstre.comportement = monstreToggle.checked ? MONSTRE_DEPLACEMENT_POURSUIVRE : MONSTRE_DEPLACEMENT_RANDOM;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const plateauElement = document.getElementById("plateau");
    const musiqueMenu = document.getElementById('backgroundMusicMenu');
    const musiqueMonde = document.getElementById('backgroundMusic');
    const musiqueToggle = document.getElementById('musique_toggle');

    // Initialiser le volume
    musiqueMenu.volume = 0.5;
    musiqueMonde.volume = 0.5;

    toggleSon();

    const lancerMonde = (mondeId) => {
        musiqueMenu.pause();
        chargerImages(mondeId, () => {
            if(musiqueToggle.checked){
                musiqueMonde.play();
            }
            document.body.style.backgroundImage = "none";
            plateauElement.style.display = "block";
            menu.style.display = "none";
            plateau = new Plateau();
            cree_plateau_initial(plateau);
            const contexte = document.getElementById("simulateur").getContext("2d");
            dessine_plateau(contexte, plateau);
        });
    };

    document.getElementById("monde_1").addEventListener("click", () => lancerMonde(1));
    document.getElementById("monde_2").addEventListener("click", () => lancerMonde(2));
    document.getElementById("monde_3").addEventListener("click", () => lancerMonde(3));
    document.getElementById("monde_4").addEventListener("click", () => lancerMonde(4));

    document.getElementById("volume_menu").addEventListener("input", (e) => {
        const volume = e.target.value;
        musiqueMenu.volume = volume;
        musiqueMonde.volume = volume;
    });

    document.getElementById("volume").addEventListener("input", (e) => {
        const volume = e.target.value;
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++){
            audioElements[i].volume = volume;
        }
    });

    document.getElementById("retour").addEventListener("click", () => {
        document.body.style.backgroundImage = 'url("images/fond.png")';
        musiqueMonde.pause();
        if(musiqueToggle.checked){
            musiqueMenu.play();
        } else {
            musiqueMenu.pause();
        }
        Object.keys(boutons).forEach((id) => {
            document.getElementById(id).disabled = false;
        });
        plateau = new Plateau();
        trains = [];
        const contexte = document.getElementById("simulateur").getContext("2d");
        dessine_plateau(contexte, plateau);
        plateauElement.style.display = "none";
        menu.style.display = "flex";
    });
});

function gerer_clics_plateau(event){
    const rect = event.target.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / LARGEUR_CASE);
    const y = Math.floor((event.clientY - rect.top) / LARGEUR_CASE);
    const contexte = document.getElementById("simulateur").getContext("2d");

    if(type_image_monde !== null){
        if(!case_occupee(x, y)){
            plateau.cases[x][y] = type_image_monde;
        } else {
            console.log("Il y a un train sur la case, on ne peut pas la changer.");
        }
    } else if(type_train !== null){
        let nb = getNbWagons(type_train);
        if(case_valide(plateau, x, y, nb)){
            let train = new Train(x, y, nb, "droite", type_train);
            trains.push(train);
            for (let i = 0; i <= nb; i++){
                plateau.cases[x - i][y] = Type_de_case.Rail_horizontal;
            }
        } else {
            console.log("La case n'est pas valide pour poser un train.");
        }
    }
    dessine_plateau(contexte, plateau);
}

function gererPause(){
    const iconePause = document.getElementById("icone_pause");
    if(isPaused){
        new Audio("./music/kinto.mp3").play();
        if(!intervalId){
            intervalId = setInterval(() => {
                deplacer_trains();
                monstre.deplacer();
                verifierCollisionMonstre();
                const contexte = document.getElementById("simulateur").getContext("2d");
                dessine_plateau(contexte, plateau);
            }, 500);
        }
        iconePause.src = "images/pause.png";
    } else {
        clearInterval(intervalId);
        intervalId = null;
        iconePause.src = "images/play.png";
    }
    isPaused = !isPaused;
}
