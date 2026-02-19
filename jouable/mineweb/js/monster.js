/*
	Vie et mort d'un monstre  VERSION Améliorer- Code JavaScript
	@author       : RAMZI Réda & JARI Ayman
	Created       : 2023
	Last modified : ...
*/

/* Partie de Base, un peu similaire que la V1 */
let name;
let life;
let hunger;
let money;
let score;
let awake = true;

setInterval(incrementer_score, 5000);
setInterval(decrementer_faim, 15000);
setInterval(regenerer_vie, 4000);
setInterval(decrementer_vie, 4000);


function incrementer_score(){
    if(life > 0){
        score = score + 1;;
        updateStatus();
    }
}

function decrementer_faim(){
    if(hunger - 1 >= 0){
        hunger = hunger - 1;
    } else {
        hunger = 0;
    }
    updateStatus();
}

function regenerer_vie(){
    if(hunger === 10 && life < 10){
        if(life + 1 <= 10){
            life = life + 1;
        } else {
            life = 10;
        }
        updateStatus();
    }
}

function decrementer_vie(){
    if(hunger === 0 && life > 0){
        if(life - 1 >= 1){
            life = life - 1;
        } else {
            life = 1;
        }
        updateStatus();
    }
}

let images_pv = new Array(11);
let images_faim = new Array(11);
initImages(images_pv, images_faim);
let life_bar = document.getElementById("life_bar");
let hunger_bar = document.getElementById("hunger_bar");
let previous_pv = images_pv[10];
let previous_faim = images_faim[10];
life_bar.appendChild(previous_pv);
hunger_bar.appendChild(previous_faim);

function initImages(images_pv, images_faim){
    images_pv[10] = document.createElement("img");
    images_pv[10].src = "js/images/10PV.png";
    images_pv[9] = document.createElement("img");
    images_pv[9].src = "js/images/9PV.png";
    images_pv[8] = document.createElement("img");
    images_pv[8].src = "js/images/8PV.png";
    images_pv[7] = document.createElement("img");
    images_pv[7].src = "js/images/7PV.png";
    images_pv[6] = document.createElement("img");
    images_pv[6].src = "js/images/6PV.png";
    images_pv[5] = document.createElement("img");
    images_pv[5].src = "js/images/5PV.png";
    images_pv[4] = document.createElement("img");
    images_pv[4].src = "js/images/4PV.png";
    images_pv[3] = document.createElement("img");
    images_pv[3].src = "js/images/3PV.png";
    images_pv[2] = document.createElement("img");
    images_pv[2].src = "js/images/2PV.png";
    images_pv[1] = document.createElement("img");
    images_pv[1].src = "js/images/1PV.png";
    images_pv[0] = document.createElement("img");
    images_pv[0].src = "js/images/0PV.png";
    images_faim[10] = document.createElement("img");
    images_faim[10].src = "js/images/10HG.png";
    images_faim[9] = document.createElement("img");
    images_faim[9].src = "js/images/9HG.png";
    images_faim[8] = document.createElement("img");
    images_faim[8].src = "js/images/8HG.png";
    images_faim[7] = document.createElement("img");
    images_faim[7].src = "js/images/7HG.png";
    images_faim[6] = document.createElement("img");
    images_faim[6].src = "js/images/6HG.png";
    images_faim[5] = document.createElement("img");
    images_faim[5].src = "js/images/5HG.png";
    images_faim[4] = document.createElement("img");
    images_faim[4].src = "js/images/4HG.png";
    images_faim[3] = document.createElement("img");
    images_faim[3].src = "js/images/3HG.png";
    images_faim[2] = document.createElement("img");
    images_faim[2].src = "js/images/2HG.png";
    images_faim[1] = document.createElement("img");
    images_faim[1].src = "js/images/1HG.png";
    images_faim[0] = document.createElement("img");
    images_faim[0].src = "js/images/0HG.png";
}

function initMonstre(nom, vie, argent, faim){
    name = nom;
    life = vie;
    money = argent;
    score = 0;
    hunger = faim;
}

function afficheMonstre(){
    console.log("Nom : " + name + ", Score : " + score + ", PV : " +  life + ", HG : " + hunger + ", Argent : " + money + ", Réveiller : " + awake);
    logBoite("Nom : " + name + ", Score : " + score + ", PV : " +  life + ", HG : " + hunger + ", Argent : " + money + ", Réveiller : " + awake);
}


let run = document.getElementById("run");
let fight = document.getElementById("fight");
let work = document.getElementById("work");
let sleep = document.getElementById("sleep");
let eat = document.getElementById("eat");
let show = document.getElementById("show");
let nouveau = document.getElementById("new");
let kill = document.getElementById("kill");
let monster = document.getElementById("monster");
/*New*/let chorba = document.getElementById("chorba");
/*New*/let nether = document.getElementById("nether");
/*New*/let son = document.getElementById("son");

function go() {
    initMonstre("Slime", 10, 10, 10);
    updateStatus();
    show.addEventListener("click", function() {
        afficheMonstre(); 
    });
}
window.addEventListener("load", go);


function logBoite(message){
    let actionbox = document.getElementById("actionbox");
    let txt = document.createElement("p");
    txt.textContent = message;
    actionbox.insertBefore(txt, actionbox.firstChild);
}

function updateStatus(){
    let statut = document.getElementById("statut");
    let list = statut.querySelectorAll("li");

    for (let i = 0; i < list.length; i++){
        statut.removeChild(list[i]);
    }
    let score_li = document.createElement("li");
    score_li.textContent = "Score : " + score;
    statut.appendChild(score_li);

    let argent = document.createElement("li");
    argent.textContent = "Argent : " + money + "€";
    statut.appendChild(argent);

    if(life <= 10){
        life_bar.removeChild(previous_pv);
        life_bar.appendChild(images_pv[life]);
        previous_pv = images_pv[life];
    }

    if(hunger <= 10){
        hunger_bar.removeChild(previous_faim);
        hunger_bar.appendChild(images_faim[hunger]);
        previous_faim = images_faim[hunger];
    }
}

function courir(){
    if(awake){
        if(life > 1){
            run.disabled = true;
            fight.disabled = true;
            work.disabled = true;
            eat.disabled = true;
            chorba.disabled = true;
            sleep.disabled = true;
            nether.disabled = true;
            life = life - 1;
            logBoite("Le monstre court ! (-1 PV)");
            Musique('js/music/courir.mp3');
            updateStatus();
            setTimeout(function(){
                if(life > 0){
                    run.disabled = false;
                    fight.disabled = false;
                    work.disabled = false;
                    eat.disabled = false;
                    chorba.disabled = false;
                    sleep.disabled = false;
                    nether.disabled = false;
                }
            }, 1900);
        } else {
            logBoite("Le monstre va mourir s'il court : STOP !");
        }
    } else {
        logBoite("Le monstre dort, il ne peut pas courir.");
    }
}
run.addEventListener("click", courir);

function sebattre(){
    if(awake){
        if(life > 3){
            life = life - 3;
            run.disabled = true;
            fight.disabled = true;
            work.disabled = true;
            eat.disabled = true;
            chorba.disabled = true;
            sleep.disabled = true;
            nether.disabled = true;
            logBoite("Le monstre se bat ! (-3 PV)");
            Musique('js/music/fight.mp3');
            updateStatus();
            setTimeout(function(){
                if(life > 0){
                    run.disabled = false;
                    fight.disabled = false;
                    work.disabled = false;
                    eat.disabled = false;
                    chorba.disabled = false;
                    sleep.disabled = false;
                    nether.disabled = false;
                }
            }, 5500);
        } else {
            logBoite("Le monstre va mourir s'il se bat : STOP !");
        }
    } else {
        logBoite("Le monstre dort, il ne peut pas se battre.");
    }
}
fight.addEventListener("click", sebattre);

function travailler(){
    if(awake){
        if(life > 1){
            life = life - 1;
            money = money + 2;
            run.disabled = true;
            fight.disabled = true;
            work.disabled = true;
            eat.disabled = true;
            chorba.disabled = true;
            sleep.disabled = true;
            nether.disabled = true;
            logBoite("Le monstre travaille ! (-1 PV, + 2€)");
            Musique('js/music/travail.mp3');
            updateStatus();
            setTimeout(function(){
                if(life > 0){
                    run.disabled = false;
                    fight.disabled = false;
                    work.disabled = false;
                    eat.disabled = false;
                    chorba.disabled = false;
                    sleep.disabled = false;
                    nether.disabled = false;
                }
            }, 1300);
        } else {
            logBoite("Le monstre va mourir s'il travaille : STOP !");
        }
    } else {
        logBoite("Le monstre dort, il ne peut pas travailler.");
    }
}
work.addEventListener("click", travailler);

function manger(){
    if(awake){
        if(hunger < 10){
            if(money > 2){
                if(hunger + 2 > 10){
                    hunger = 10;
                } else {
                    hunger = hunger + 2;
                }
                money = money - 3;
                run.disabled = true;
                fight.disabled = true;
                work.disabled = true;
                eat.disabled = true;
                chorba.disabled = true;
                sleep.disabled = true;
                nether.disabled = true;
                logBoite("Le monstre mange ! (+2 HG, - 3€)");
                Musique('js/music/manger.mp3');
                updateStatus();
                setTimeout(function(){
                    if(life > 0){
                        run.disabled = false;
                        fight.disabled = false;
                        work.disabled = false;
                        eat.disabled = false;
                        chorba.disabled = false;
                        sleep.disabled = false;
                        nether.disabled = false;
                    }
                }, 1900);
            } else {
                logBoite("Le monstre n'a pas assez d'argent pour manger : STOP !");
            }
        } else {
            logBoite("La barre de faim du monstre est déjà pleine !");
        }
    } 
}
eat.addEventListener("click", manger);

function dormir(){
    if(awake && life > 0){
        run.disabled = true;
        fight.disabled = true;
        work.disabled = true;
        eat.disabled = true;
        chorba.disabled = true;
        nether.disabled = true;
        awake = false;
        logBoite("Le monstre s'endort.");
        Musique('js/music/dodo.mp3');
        changecouleur();
        updateStatus();
        setTimeout(function(){
            if(life > 0){
                awake = true;
                run.disabled = false;
                fight.disabled = false;
                work.disabled = false;
                eat.disabled = false;
                chorba.disabled = false;
                nether.disabled = false;
                life = life + 1;
                logBoite("Le monstre se réveille");
                updateStatus();
            }
        }, 7000)
    } else if(life < 1){
        nouveau.disabled = false;
        logBoite("Le monstre est mort, il ne peut pas dormir !");
    }
    else if(awake === false){
        logBoite("Le monstre dort déjà.")
    }
}
sleep.addEventListener("click", dormir);

/*New*/function potion(){
    if(awake){
        if(money > 1){
            life = life + 5;
            money = money - 1;
            run.disabled = true;
            fight.disabled = true;
            work.disabled = true;
            eat.disabled = true;
            chorba.disabled = true;
            sleep.disabled = true;
            nether.disabled = true;
            logBoite("POTION MAGIQUE !! Puissance pendant 7 sec !!");
            Musique('js/music/potion.mp3');
            changemonstre();
            updateStatus();
            setTimeout(function(){
                if(life > 0){
                    run.disabled = false;
                    fight.disabled = false;
                    work.disabled = false;
                    eat.disabled = false;
                    chorba.disabled = false;
                    sleep.disabled = false;
                    nether.disabled = false;
                }
            }, 3000);
        } else if(money < 2){
            logBoite("Si tu bois cette potion tu finiras pauvre !!");
        }
    } 
}
chorba.addEventListener("click", potion);

/*New*/function Musique(nom) {
    let musique = new Audio(nom);
    musique.play();
}

function Kill(){
    if(life > 0){
        run.disabled = true;
        fight.disabled = true;
        work.disabled = true;
        sleep.disabled = true;
        eat.disabled = true;
        chorba.disabled = true;
        kill.disabled = true;
        nether.disabled = true;
        nouveau.disabled = false;
        life = 0;
        money = 0;
        hunger = 0;
        Musique('js/music/mort.mp3');
        updateStatus();
    }
}
kill.addEventListener("click", Kill);

function NewLife(){
    if(life < 1){
        setTimeout(function(){
            run.disabled = false;
            fight.disabled = false;
            work.disabled = false;
            sleep.disabled = false;
            eat.disabled = false;
            chorba.disabled = false;
            kill.disabled = false;
            nether.disabled = false;
        }, 8000);
        awake = true;
        nouveau.disabled = true;
        initMonstre("Slime", 10, 10, 10);
        Musique('js/music/new_life.mp3');
        updateStatus();
    }
}
nouveau.addEventListener("click", NewLife);

nouveau.disabled = true; /*Bouton desactiver de base dès le lancement de la page, car sans ça, le 
bouton New life est accesible alors que le monstre est déjà en vie (Contradiction)*/

/*New*/function netherFun() {
    if(life>0){
        let chance = Math.floor(Math.random() * 3); 
        if (chance === 0) {
            run.disabled = true;
            fight.disabled = true;
            work.disabled = true;
            sleep.disabled = true;
            eat.disabled = true;
            chorba.disabled = true;
            kill.disabled = true;
            nether.disabled = true;
            nouveau.disabled = false;
            life = 0;
            money = 0;
            hunger = 0;
            Musique('js/music/mort.mp3');
            updateStatus();
            logBoite("Le monstre à péri dans les flamme du nether ;(");
        } else {
            logBoite("Le monstre a survécue au Nether !!");
        }
    }else{
        logBoite("Le monstre est mort ;(");
    }
}
nether.addEventListener("click", netherFun);

/*NEW*/function changecouleur() {
    let coulori = document.body.style.backgroundColor;
    document.body.style.transition = "background-color 1s";
    document.body.style.backgroundColor = "rgb(0, 37, 87)";
    setTimeout(function() {
     document.body.style.backgroundColor = coulori;
    }, 8000);
}

/*NEW*/function changemonstre() {
    let imageori =  monster.style.backgroundImage;
    monster.style.transition = "background-image 1s";
    monster.style.backgroundImage = "url(css/images/puiss.png)";
    setTimeout(function() {
        monster.style.backgroundImage = imageori;
    }, 7000);
}

let audio = new Audio('js/music/minecraft.mp3');
audio.loop = true;
let actifson = false;
function toggleSon() {
  if (actifson) {
    audio.pause();
    actifson = false;
  } else {
    audio.play();
    actifson = true;
  }
}
son.addEventListener('click', toggleSon);


son.addEventListener('click', () => {
  son.classList.toggle('active');
});

