"use strict";

class Plateau {
    constructor(){
        this.largeur = LARGEUR_PLATEAU;
        this.hauteur = LARGEUR_PLATEAU;
        this.cases = [];
        for (let x = 0; x < this.largeur; x++){
            this.cases[x] = [];
            for (let y = 0; y < this.hauteur; y++){
                this.cases[x][y] = Type_de_case.Foret;
            }
        }
    }

    dessinePlateau(contexte){
        for (let x = 0; x < this.largeur; x++){
            for (let y = 0; y < this.hauteur; y++){
                dessine_case(contexte, this, x, y);
            }
        }
        contexte.drawImage(IMAGE_MONSTRE, monstre.x * LARGEUR_CASE, monstre.y * LARGEUR_CASE, LARGEUR_CASE, LARGEUR_CASE);
        trains.forEach((train) => {
            dessine_train(contexte, train);
        });
    }
}

class Train {
    constructor(x, y, nb_wagons, direction, type){
        this.x = x;
        this.y = y;
        this.nb_wagons = nb_wagons;
        this.direction = direction;
        this.type = type;
        this.positions = [];
        this.directions = [];
        this.arretCompteur = 0;
        for (let i = 0; i <= nb_wagons; i++){
            this.positions.push({ x: this.x - i, y: this.y });
            this.directions.push(direction);
        }
    }

    //Gérer la passage a côté d'une gare
    arreter(){
        this.arretCompteur = 2;
    }

    //Gérer la passage a côté d'une gare de triage
    ajouterWagon(){
        const dernierWagon = this.positions[this.positions.length - 1];
        this.positions.push({ ...dernierWagon });
        this.nb_wagons++;
    }
}