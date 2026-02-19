"use strict";

/* Dimensions du plateau */
const LARGEUR_PLATEAU = 60;
const HAUTEUR_PLATEAU = 30;
const LARGEUR_CASE = 35;
const HAUTEUR_CASE = 40;

/* Images */
const IMAGE_EAU = new Image();
const IMAGE_FORET = new Image();
const IMAGE_RAIL_HORIZONTAL = new Image();
const IMAGE_RAIL_VERTICAL = new Image();
const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
const IMAGE_LOCOMOTIVE = new Image();
const IMAGE_WAGON = new Image();
const IMAGE_MONSTRE = new Image();
IMAGE_MONSTRE.src = "images/monstre.png";
const IMAGE_GARE = new Image();
const IMAGE_GARE_TRIAGE = new Image();


const mondesImages = {
    1: { im: "images/monde1", color: "#47ffbb", music: "./music/monde_1.mp3" },
    2: { im: "images/monde2", color: "#90c8f8", music: "./music/monde_2.mp3" },
    3: { im: "images/monde3", color: "red", music: "./music/monde_3.mp3" },
    4: { im: "images/monde4", color: "#6ab7d7", music: "./music/monde_4.mp3" },
};

/* Types des cases */
const Type_de_case = {
    Foret: { nom: "foret", image: IMAGE_FORET, directions: {} },
    Eau: { nom: "eau", image: IMAGE_EAU, directions: {} },
    Rail_horizontal: { nom: "rail horizontal", image: IMAGE_RAIL_HORIZONTAL, directions: { droite: "droite", gauche: "gauche" } },
    Rail_vertical: { nom: "rail vertical", image: IMAGE_RAIL_VERTICAL, directions: { haut: "haut", bas: "bas" } },
    Rail_droite_vers_haut: { nom: "rail droite vers haut", image: IMAGE_RAIL_DROITE_VERS_HAUT, directions: { droite: "haut", bas: "gauche" } },
    Rail_haut_vers_droite: { nom: "rail haut vers droite", image: IMAGE_RAIL_HAUT_VERS_DROITE, directions: { haut: "droite", gauche: "bas" } },
    Rail_droite_vers_bas: { nom: "rail droite vers bas", image: IMAGE_RAIL_DROITE_VERS_BAS, directions: { droite: "bas", haut: "gauche" } },
    Rail_bas_vers_droite: { nom: "rail bas vers droite", image: IMAGE_RAIL_BAS_VERS_DROITE, directions: { bas: "droite", gauche: "haut" } },
    Gare: { nom: "gare", image: IMAGE_GARE, directions: {} },
    GareTriage: { nom: "gare de triage", image: IMAGE_GARE_TRIAGE, directions: {} },
};

/* Types de boutons */
const boutons = {
    bouton_foret: { type_image_monde: Type_de_case.Foret, type_train: null, im: "foret" },
    bouton_eau: { type_image_monde: Type_de_case.Eau, type_train: null, im: "eau" },
    bouton_rail_horizontal: { type_image_monde: Type_de_case.Rail_horizontal, type_train: null, im: "rail-horizontal" },
    bouton_rail_vertical: { type_image_monde: Type_de_case.Rail_vertical, type_train: null, im: "rail-vertical" },
    bouton_rail_droite_vers_haut: { type_image_monde: Type_de_case.Rail_droite_vers_haut, type_train: null, im: "rail-droite-vers-haut" },
    bouton_rail_haut_vers_droite: { type_image_monde: Type_de_case.Rail_haut_vers_droite, type_train: null, im: "rail-haut-vers-droite" },
    bouton_rail_droite_vers_bas: { type_image_monde: Type_de_case.Rail_droite_vers_bas, type_train: null, im: "rail-droite-vers-bas" },
    bouton_rail_bas_vers_droite: { type_image_monde: Type_de_case.Rail_bas_vers_droite, type_train: null, im: "rail-bas-vers-droite" },
    bouton_train_1: { type_train: "Locomotive seule", type_image_monde: null, im: "locomotive_b" },
    bouton_train_2: { type_train: "Locomotive et 1 wagon", type_image_monde: null, im: "loco-1-wagon" },
    bouton_train_4: { type_train: "Locomotive et 3 wagons", type_image_monde: null, im: "loco-3-wagons" },
    bouton_train_6: { type_train: "Locomotive et 5 wagons", type_image_monde: null, im: "loco-5-wagons" },
    bouton_gare: { type_image_monde: Type_de_case.Gare, type_train: null, im: "gare" },
    bouton_gare_triage: { type_image_monde: Type_de_case.GareTriage, type_train: null, im: "gare-triage" },
};

/* Transitions possibles selon les directions */
const transitions = {
    droite: [Type_de_case.Rail_horizontal, Type_de_case.Rail_droite_vers_haut, Type_de_case.Rail_droite_vers_bas],
    gauche: [Type_de_case.Rail_horizontal, Type_de_case.Rail_bas_vers_droite, Type_de_case.Rail_haut_vers_droite],
    haut: [Type_de_case.Rail_vertical, Type_de_case.Rail_haut_vers_droite, Type_de_case.Rail_droite_vers_bas],
    bas: [Type_de_case.Rail_vertical, Type_de_case.Rail_bas_vers_droite, Type_de_case.Rail_droite_vers_haut],
};

/* Directions pour avancer */
const dir = { droite: { x: 1, y: 0 }, gauche: { x: -1, y: 0 }, haut: { x: 0, y: -1 }, bas: { x: 0, y: 1 } };

/* Nombre de wagons selon le bouton */
const nombre_wagons = {
    "Locomotive seule": { get: 0 },
    "Locomotive et 1 wagon": { get: 1 },
    "Locomotive et 3 wagons": { get: 3 },
    "Locomotive et 5 wagons": { get: 5 },
};