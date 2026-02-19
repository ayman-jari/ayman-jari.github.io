"use strict";

/* Charger les images et la musique pour un monde spécifique */
function chargerImages(mondeId, callback) {
    const basePath = mondesImages[mondeId].im;
    const musicPath = mondesImages[mondeId].music;
    document.body.style.backgroundColor = mondesImages[mondeId].color;
    let imagesToLoad = 12;

    //Pour verifier que les images sont toutes bien chargées avant de les afficher
    function imageChargee() {
        imagesToLoad--;
        if (imagesToLoad === 0 && callback) {
            callback();
        }
    }

    function chargerImage(image, src) {
        image.src = src;
        image.onload = imageChargee;
    }

    Object.keys(boutons).forEach((id) => {
        document.getElementById(id).src = `${basePath + "/" + boutons[id].im}.png`;
    });

    chargerImage(IMAGE_EAU, `${basePath}/eau.png`);
    chargerImage(IMAGE_FORET, `${basePath}/foret.png`);
    chargerImage(IMAGE_RAIL_HORIZONTAL, `${basePath}/rail-horizontal.png`);
    chargerImage(IMAGE_RAIL_VERTICAL, `${basePath}/rail-vertical.png`);
    chargerImage(IMAGE_RAIL_BAS_VERS_DROITE, `${basePath}/rail-bas-vers-droite.png`);
    chargerImage(IMAGE_RAIL_DROITE_VERS_BAS, `${basePath}/rail-droite-vers-bas.png`);
    chargerImage(IMAGE_RAIL_DROITE_VERS_HAUT, `${basePath}/rail-droite-vers-haut.png`);
    chargerImage(IMAGE_RAIL_HAUT_VERS_DROITE, `${basePath}/rail-haut-vers-droite.png`);
    chargerImage(IMAGE_LOCOMOTIVE, `${basePath}/locomotive.png`);
    chargerImage(IMAGE_WAGON, `${basePath}/wagon.png`);
    chargerImage(IMAGE_GARE, `${basePath}/gare.png`);
    chargerImage(IMAGE_GARE_TRIAGE, `${basePath}/gare-triage.png`);

    // Charger la musique du monde
    const musicElement = document.getElementById('backgroundMusic');
    const musicSource = document.getElementById('musicSource');
    musicSource.src = musicPath;
    musicElement.load();
    musicElement.volume = 0.5;

    // Contrôle du volume
    document.getElementById('volume').addEventListener('input', (e) => {
        musicElement.volume = e.target.value;
    });
}

/* Gérer l'activation/désactivation de la musique */
function toggleSon() {
    const musiqueMenu = document.getElementById('backgroundMusicMenu');
    const musiqueMonde = document.getElementById('backgroundMusic');
    const musiqueToggle = document.getElementById('musique_toggle');

    musiqueToggle.addEventListener('change', () => {
        if (musiqueToggle.checked) {
            if (document.getElementById("menu").style.display === "none") {
                musiqueMonde.play();
            } else {
                musiqueMenu.play();
            }
        } else {
            musiqueMonde.pause();
            musiqueMenu.pause();
        }
    });
}

/* Initialisation du plateau de jeu */
function cree_plateau_initial(plateau) {
    // Initialisation du plateau avec des cases prédéfinies
    // Circuit
    plateau.cases[12][7] = Type_de_case.Rail_horizontal;
    plateau.cases[13][7] = Type_de_case.Rail_horizontal;
    plateau.cases[14][7] = Type_de_case.Rail_horizontal;
    plateau.cases[15][7] = Type_de_case.Rail_horizontal;
    plateau.cases[16][7] = Type_de_case.Rail_horizontal;
    plateau.cases[17][7] = Type_de_case.Rail_horizontal;
    plateau.cases[18][7] = Type_de_case.Rail_horizontal;
    plateau.cases[19][7] = Type_de_case.Rail_droite_vers_haut;
    plateau.cases[19][6] = Type_de_case.Rail_vertical;
    plateau.cases[19][5] = Type_de_case.Rail_droite_vers_bas;
    plateau.cases[12][5] = Type_de_case.Rail_horizontal;
    plateau.cases[13][5] = Type_de_case.Rail_horizontal;
    plateau.cases[14][5] = Type_de_case.Rail_horizontal;
    plateau.cases[15][5] = Type_de_case.Rail_horizontal;
    plateau.cases[16][5] = Type_de_case.Rail_horizontal;
    plateau.cases[17][5] = Type_de_case.Rail_horizontal;
    plateau.cases[18][5] = Type_de_case.Rail_horizontal;
    plateau.cases[11][5] = Type_de_case.Rail_haut_vers_droite;
    plateau.cases[11][6] = Type_de_case.Rail_vertical;
    plateau.cases[11][7] = Type_de_case.Rail_bas_vers_droite;

    // Segment isolé à gauche
    plateau.cases[0][7] = Type_de_case.Rail_horizontal;
    plateau.cases[1][7] = Type_de_case.Rail_horizontal;
    plateau.cases[2][7] = Type_de_case.Rail_horizontal;
    plateau.cases[3][7] = Type_de_case.Rail_horizontal;
    plateau.cases[4][7] = Type_de_case.Rail_horizontal;
    plateau.cases[5][7] = Type_de_case.Eau;
    plateau.cases[6][7] = Type_de_case.Rail_horizontal;
    plateau.cases[7][7] = Type_de_case.Rail_horizontal;

    // Plan d'eau
    for (let x = 22; x <= 27; x++) {
        for (let y = 2; y <= 5; y++) {
            plateau.cases[x][y] = Type_de_case.Eau;
        }
    }

    // Segment isolé à droite
    plateau.cases[22][8] = Type_de_case.Rail_horizontal;
    plateau.cases[23][8] = Type_de_case.Rail_horizontal;
    plateau.cases[24][8] = Type_de_case.Rail_horizontal;
    plateau.cases[25][8] = Type_de_case.Rail_horizontal;
    plateau.cases[26][8] = Type_de_case.Rail_bas_vers_droite;
    plateau.cases[27][8] = Type_de_case.Rail_horizontal;
    plateau.cases[28][8] = Type_de_case.Rail_horizontal;
    plateau.cases[29][8] = Type_de_case.Rail_horizontal;

    // TCHOU
    plateau.cases[3][10] = Type_de_case.Eau;
    plateau.cases[4][10] = Type_de_case.Eau;
    plateau.cases[4][11] = Type_de_case.Eau;
    plateau.cases[4][12] = Type_de_case.Eau;
    plateau.cases[4][13] = Type_de_case.Eau;
    plateau.cases[5][10] = Type_de_case.Eau;

    plateau.cases[7][10] = Type_de_case.Eau;
    plateau.cases[7][11] = Type_de_case.Eau;
    plateau.cases[7][12] = Type_de_case.Eau;
    plateau.cases[7][13] = Type_de_case.Eau;
    plateau.cases[8][10] = Type_de_case.Eau;
    plateau.cases[9][10] = Type_de_case.Eau;
    plateau.cases[8][13] = Type_de_case.Eau;
    plateau.cases[9][13] = Type_de_case.Eau;

    plateau.cases[11][10] = Type_de_case.Eau;
    plateau.cases[11][11] = Type_de_case.Eau;
    plateau.cases[11][12] = Type_de_case.Eau;
    plateau.cases[11][13] = Type_de_case.Eau;
    plateau.cases[12][11] = Type_de_case.Eau;
    plateau.cases[13][10] = Type_de_case.Eau;
    plateau.cases[13][11] = Type_de_case.Eau;
    plateau.cases[13][12] = Type_de_case.Eau;
    plateau.cases[13][13] = Type_de_case.Eau;

    plateau.cases[15][10] = Type_de_case.Eau;
    plateau.cases[15][11] = Type_de_case.Eau;
    plateau.cases[15][12] = Type_de_case.Eau;
    plateau.cases[15][13] = Type_de_case.Eau;
    plateau.cases[16][10] = Type_de_case.Eau;
    plateau.cases[16][13] = Type_de_case.Eau;
    plateau.cases[17][10] = Type_de_case.Eau;
    plateau.cases[17][11] = Type_de_case.Eau;
    plateau.cases[17][12] = Type_de_case.Eau;
    plateau.cases[17][13] = Type_de_case.Eau;

    plateau.cases[19][10] = Type_de_case.Eau;
    plateau.cases[19][11] = Type_de_case.Eau;
    plateau.cases[19][12] = Type_de_case.Eau;
    plateau.cases[19][13] = Type_de_case.Eau;
    plateau.cases[20][13] = Type_de_case.Eau;
    plateau.cases[21][10] = Type_de_case.Eau;
    plateau.cases[21][11] = Type_de_case.Eau;
    plateau.cases[21][12] = Type_de_case.Eau;
    plateau.cases[21][13] = Type_de_case.Eau;
}

/* Dessiner les éléments sur le plateau */
function dessine_case(contexte, plateau, x, y) {
    const la_case = plateau.cases[x][y];
    let image_a_afficher = la_case.image || null;
    if (image_a_afficher) {
        contexte.drawImage(image_a_afficher, x * LARGEUR_CASE, y * LARGEUR_CASE, LARGEUR_CASE, LARGEUR_CASE);
    }
}

function dessine_train(contexte, train) {
    train.positions.forEach((pos, index) => {
        let image = index === 0 ? IMAGE_LOCOMOTIVE : IMAGE_WAGON;
        contexte.save();
        const centerX = pos.x * LARGEUR_CASE + LARGEUR_CASE / 2;
        const centerY = pos.y * LARGEUR_CASE + LARGEUR_CASE / 2;
        contexte.translate(centerX, centerY);
        contexte.drawImage(image, -LARGEUR_CASE / 2, -LARGEUR_CASE / 2, LARGEUR_CASE, LARGEUR_CASE);
        contexte.restore();
    });
}

function dessine_plateau(contexte, plateau) {
    plateau.dessinePlateau(contexte);
}

/* Vérifier si une case est occupée par un train */
function case_occupee(x, y) {
    return trains.some((train) => train.positions.some((pos) => pos.x === x && pos.y === y));
}

/* Vérifier si une case est valide pour poser un train */
function case_valide(plateau, x, y, nb_wagons) {
    for (let i = 0; i <= nb_wagons; i++) {
        if (
            x - i < 0 ||
            x - i >= LARGEUR_PLATEAU ||
            plateau.cases[x - i][y] !== Type_de_case.Rail_horizontal ||
            case_occupee(x - i, y)
        ) {
            return false;
        }
    }
    return true;
}

/* Obtenir le nombre de wagons pour un type de train */
function getNbWagons(type_train) {
    return nombre_wagons[type_train].get;
}

/* Vérifier la présence de gare */
function verifierGares(train) {
    const positionsAutour = [
        { x: train.x + 1, y: train.y },
        { x: train.x - 1, y: train.y },
        { x: train.x, y: train.y + 1 },
        { x: train.x, y: train.y - 1 },
    ];

    positionsAutour.forEach(pos => {
        if (pos.x >= 0 && pos.x < LARGEUR_PLATEAU && pos.y >= 0 && pos.y < HAUTEUR_PLATEAU) {
            const caseAutour = plateau.cases[pos.x][pos.y];
            if (caseAutour.nom === "gare") {
                train.arreter();
            } else if (caseAutour.nom === "gare de triage") {
                train.ajouterWagon();
            }
        }
    });
}

// Fonction de déplacement des trains
function deplacer_trains() {
    //Pour le passage devant une gare
    trains.forEach((train) => {
        if (train.arretCompteur > 0) {
            train.arretCompteur--;
            return;
        }

        const pos_suiv = nouvelle_position(train);
        if (!estValide(pos_suiv, train.direction)) {
            trains.splice(trains.indexOf(train), 1);
            console.log("Position suivante invalide: destruction du train !");
            return;
        }

        for (let i = train.nb_wagons; i > 0; i--) {
            train.positions[i] = { ...train.positions[i - 1] };
            train.directions[i] = train.directions[i - 1];
        }

        train.positions[0] = pos_suiv;
        train.x = pos_suiv.x;
        train.y = pos_suiv.y;

        verifierGares(train); // Vérifier les cases autour du train
        verifierCollisionsEntreTrains();

        const pos_actuelle = plateau.cases[train.x][train.y];
        const nv_direction = nouvelle_direction(train.direction, pos_actuelle);
        if (nv_direction) {
            train.direction = nv_direction;
            train.directions[0] = nv_direction;
        }
    });
}

/* Obtenir la nouvelle position du train */
function nouvelle_position(train) {
    return { x: train.x + dir[train.direction].x, y: train.y + dir[train.direction].y };
}

/* Vérifier si une position est valide */
function estValide(position, direction) {
    if (position.x < 0 || position.x >= LARGEUR_PLATEAU || position.y < 0 || position.y >= HAUTEUR_PLATEAU) {
        return false;
    }

    const case_actuelle = plateau.cases[position.x][position.y];
    return case_actuelle && transitions[direction].includes(case_actuelle);
}

/* Obtenir la nouvelle direction du train */
function nouvelle_direction(current_direction, type_case) {
    return type_case.directions[current_direction] || current_direction;
}

function verifierCollisionsEntreTrains() {
    for (let i = 0; i < trains.length; i++) {
        for (let j = i + 1; j < trains.length; j++) {
            const train1 = trains[i];
            const train2 = trains[j];
            train1.positions.forEach(pos1 => {
                train2.positions.forEach(pos2 => {
                    if (pos1.x === pos2.x && pos1.y === pos2.y) {
                        console.log("Collision entre les trains, destruction des trains !");
                        trains.splice(j, 1);
                        trains.splice(i, 1);
                    }
                });
            });
        }
    }
}

function verifierCollisionMonstre(){
    trains.forEach((train, index) => {
        if(train.positions.some(pos => pos.x === monstre.x && pos.y === monstre.y)){
            // Explosion du train
            trains.splice(index, 1);
            console.log("Collision avec le monstre : destruction du train !");
        }
    });
}