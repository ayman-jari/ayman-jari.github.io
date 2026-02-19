"use strict";

/*Différents ajouts pour implémenter un monstre qui peut soit avancer aléatoirement, soit poursuivre le train le plus proche */

const MONSTRE_DEPLACEMENT_RANDOM = "random";
const MONSTRE_DEPLACEMENT_POURSUIVRE = "poursuivre";

class Monstre {
    constructor(x, y, comportement){
        this.x = x;
        this.y = y;
        this.comportement = comportement;
    }

    deplacer(){
        let nouvellePosition;

        if(this.comportement === MONSTRE_DEPLACEMENT_RANDOM){
            nouvellePosition = this.positionAleatoire();
        } else if(this.comportement === MONSTRE_DEPLACEMENT_POURSUIVRE){
            nouvellePosition = this.poursuivreTrainLePlusProche();
        }
        if(this.estValide(nouvellePosition)){
            this.x = nouvellePosition.x;
            this.y = nouvellePosition.y;
        }
    }

    positionAleatoire(){
        const directions = Object.values(dir);
        const directionAleatoire = directions[Math.floor(Math.random() * directions.length)];
        return { x: this.x + directionAleatoire.x, y: this.y + directionAleatoire.y };
    }

    poursuivreTrainLePlusProche(){
        let trainLePlusProche = null;
        let distanceMinimale = Infinity;

        trains.forEach((train) => {
            const distance = Math.abs(train.x - this.x) + Math.abs(train.y - this.y);
            if(distance < distanceMinimale){
                distanceMinimale = distance;
                trainLePlusProche = train;
            }
        });
        if(trainLePlusProche){
            const directionX = trainLePlusProche.x > this.x ? 1 : (trainLePlusProche.x < this.x ? -1 : 0);
            const directionY = trainLePlusProche.y > this.y ? 1 : (trainLePlusProche.y < this.y ? -1 : 0);
            return { x: this.x + directionX, y: this.y + directionY };
        }
        return { x: this.x, y: this.y };
    }

    estValide(position){
        return (position.x >= 0 && position.x < LARGEUR_PLATEAU && position.y >= 0 && position.y < HAUTEUR_PLATEAU && plateau.cases[position.x][position.y] !== Type_de_case.Eau);
    }
}