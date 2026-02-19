'use strict';

const zone_jeu = document.getElementById('arena');
const score_aff = document.getElementById('score');
const viesAff = document.getElementById('lives');
const temps_aff = document.getElementById('time');
const meilleur_aff=document.getElementById('best');
const popup_fin = document.getElementById('gameOverModal');
const score_final = document.getElementById('finalScore');
const meilleur_session = document.getElementById('bestSession');
const msg_sauvegarde=document.getElementById('savedMsg');
const btn_fermer = document.getElementById('closeModal');

// params du jeu
const DIFF_BASE=3; 
const AUGMENT_SECS = 45;
const TAILLE_MIN =28;
const TAILLE_MAX= 60;
const TAILLE_LIMITE=96;

// menu
let nom_joueur = '';
const menu = document.getElementById('menu');
const champ_nom=document.getElementById('menuName');
const btn_start = document.getElementById('menuStart');

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('menu-open');
  try {
    let profil = JSON.parse(localStorage.getItem('asteroids_profile') || '{}');
    if(profil.nom) champ_nom.value=profil.nom;
  } catch {}

  function verif_menu() {
    nom_joueur=champ_nom.value.trim();
    btn_start.disabled = nom_joueur.length==0;
  }

  champ_nom.addEventListener('input',verif_menu);
  verif_menu();

  btn_start.addEventListener('click', () => {
    localStorage.setItem('asteroids_profile', JSON.stringify({nom:nom_joueur}));
    document.body.classList.remove('menu-open');
    demarrer_jeu();
  });

  btn_fermer.addEventListener('click',() => {
    popup_fin.close();
    document.body.classList.add('menu-open');
  });

  window.addEventListener('resize',() => {
    if(vaisseau.element){
      vaisseau.y=zone_jeu.clientHeight*0.85;
      maj_vaisseau();
    }
  });

  fetch('session_best.php')
    .then(res => res.ok ? res.json():Promise.reject())
    .then(data => {if(meilleur_session) meilleur_session.textContent=data.session_best ?? '0';})
    .catch(() => {});
});

const CLE_MEILLEUR='asteroids_best';
const VITESSE_VAISSEAU=700;
const INVULN_TEMPS=1.0;
const VITESSE_AST=180;
const SPAWN_TEMPS=300;
const MIN_SPAWN=50;
const HITBOX_L=60;
const HITBOX_H=62;

let en_cours=false;
let score=0;
let vies=3;
let temps_debut=0;
let dernier_spawn=0;
let invuln_jusqua=0;
let anim_frame=0;

const vaisseau={element:null,x:0,y:0};
const touches={gauche:false,droite:false};
const touches_ecran={gauche:false,droite:false};
const asteroides=[];

// meilleur score
meilleur_aff.textContent=localStorage.getItem(CLE_MEILLEUR) ?? 0;

function limiter(valeur,min,max){
  return Math.max(min,Math.min(max,valeur));
}
function aleatoire(min,max){
  return Math.random()*(max-min)+min;
}
function temps_sec(){
  return performance.now()/1000;
}
function temps_ecoule(){
  return (performance.now()-temps_debut)/1000;
}

// astéroïdes
function spawn_extra(t){
  return Math.min(t/50,0.5);
}
function difficulte(t){
  return DIFF_BASE+(t/AUGMENT_SECS);
}
function vitesse_astero(t){
  return VITESSE_AST*difficulte(t)*aleatoire(0.95,1.35);
}
function tailles(t){
  let diff=difficulte(t);
  let min=Math.min(TAILLE_LIMITE*0.6,TAILLE_MIN*(1+0.25*(diff-1)));
  let max=Math.min(TAILLE_LIMITE,TAILLE_MAX*(1+0.7*(diff-1)));
  return[min,Math.max(min+6,max)];
}
function intervalle_spawn(t){
  let diff=difficulte(t);
  let interv=SPAWN_TEMPS/(1+(diff-1)*0.9);
  return Math.max(MIN_SPAWN,interv);
}

function creer_vaisseau(){
  const elem=document.createElement('img');
  elem.src="img/vaisseau.png";
  elem.className='ship';
  elem.style.width="60px";
  elem.style.height="auto";
  zone_jeu.appendChild(elem);
  vaisseau.element=elem;
  vaisseau.x=zone_jeu.clientWidth/2;
  vaisseau.y=zone_jeu.clientHeight*0.85;
  maj_vaisseau();
}
function maj_vaisseau(){
  vaisseau.element.style.left=vaisseau.x+'px';
  vaisseau.element.style.top=vaisseau.y+'px';
}

function ajouter_astero(maintenant){
  let t=temps_ecoule();
  let[min,max]=tailles(t);
  let taille=aleatoire(min,max);
  let rayon=taille/2;

  let x=aleatoire(rayon,zone_jeu.clientWidth-rayon);
  let y=-rayon-8;
  let vy=vitesse_astero(t)*aleatoire(0.9,1.4);
  let vx=aleatoire(-60,60)*Math.min(1.2,difficulte(t)/1.5);
  let images=["img/ast1.png","img/ast2.png","img/ast3.png"];
  let src=images[Math.floor(Math.random()*images.length)];
  let elem=document.createElement('img');

  elem.src=src;
  elem.className='asteroid';
  elem.style.width=taille+'px';
  elem.style.height=taille+'px';
  elem.style.left=x+'px';
  elem.style.top=y+'px';
  zone_jeu.appendChild(elem);

  asteroides.push({element:elem,x:x,y:y,vx:vx,vy:vy,rayon:rayon,rotation:aleatoire(0,360),vitesse_rot:aleatoire(-120,120)});
  dernier_spawn=maintenant;
}

function collision_cercle_rect(cx,cy,cr,rx,ry,rw,rh){
  let closestX=limiter(cx,rx,rx+rw);
  let closestY=limiter(cy,ry,ry+rh);
  let dx=cx-closestX;
  let dy=cy-closestY;
  return(dx*dx+dy*dy)<=(cr*cr);
}

function demarrer_jeu(){
  reset_jeu();
  cancelAnimationFrame(anim_frame);
  anim_frame=requestAnimationFrame(boucle);
}

function reset_jeu(){
  en_cours=true;
  score=0;score_aff.textContent='0';
  vies=3;viesAff.textContent='3';
  temps_aff.textContent='0';
  temps_debut=performance.now();
  dernier_spawn=temps_debut;
  invuln_jusqua=0;
  asteroides.forEach(a=>a.element.remove());
  asteroides.length=0;
  if(!vaisseau.element)creer_vaisseau();
  vaisseau.x=zone_jeu.clientWidth/2;
  vaisseau.y=zone_jeu.clientHeight*0.85;
  maj_vaisseau();
  zone_jeu.focus();
}

function fin_jeu(){
  en_cours=false;
  cancelAnimationFrame(anim_frame);
  let meilleur=parseInt(localStorage.getItem(CLE_MEILLEUR)??'0',10);
  if(score>meilleur)localStorage.setItem(CLE_MEILLEUR,String(score));
  meilleur_aff.textContent=localStorage.getItem(CLE_MEILLEUR)??0;
  score_final.textContent=score;

  msg_sauvegarde.textContent='Sauvegarde ok';
  popup_fin.showModal();

  fetch('session_best.php',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({score:score})
  })
  .then(res=>res.ok?res.json():Promise.reject())
  .then(data=>{if(meilleur_session)meilleur_session.textContent=data.session_best??'0';})
  .catch(()=>{});
}

function perdre_vie(){
  if(!en_cours)return;
  vies-=1;
  viesAff.textContent=String(vies);
  invuln_jusqua=temps_sec()+INVULN_TEMPS;
  vaisseau.element.classList.remove('flash');
  vaisseau.element.offsetWidth;
  vaisseau.element.classList.add('flash');
  if(vies<=0)fin_jeu();
}

// contrôles
document.addEventListener('keydown',e=>{
    if(e.code==='ArrowLeft'||e.code==='KeyA')touches.gauche=true;
    if(e.code==='ArrowRight'||e.code==='KeyD')touches.droite=true;
  });
  
  document.addEventListener('keyup',e=>{
  if(e.code==='ArrowLeft')touches.gauche=false;
  if(e.code==='ArrowRight')touches.droite=false;
});

function boucle(maintenant) {
  if (!en_cours) return;
  let dt = 1/60;
  let t = temps_ecoule();
  temps_aff.textContent = Math.floor(t);
  score += Math.floor(1 * difficulte(t));
  score_aff.textContent = String(score);

  let veut_gauche = touches.gauche || touches_ecran.gauche;
  let veut_droite = touches.droite || touches_ecran.droite;

  if (veut_gauche && !veut_droite) vaisseau.x -= VITESSE_VAISSEAU * dt;
  if (veut_droite && !veut_gauche) vaisseau.x += VITESSE_VAISSEAU * dt;
  vaisseau.x = limiter(vaisseau.x, HITBOX_L / 2 + 6, zone_jeu.clientWidth - HITBOX_L / 2 - 6);
  maj_vaisseau();
  let interv = intervalle_spawn(t);
  if (maintenant - dernier_spawn >= interv) {
    ajouter_astero(maintenant);
    if (Math.random() < spawn_extra(t)) ajouter_astero(maintenant);
  }
  for (let i = asteroides.length - 1; i >= 0; i--) { // màj astéroïdes
    let ast = asteroides[i];
    ast.x += ast.vx * dt;
    ast.y += ast.vy * dt;
    ast.rotation += ast.vitesse_rot * dt;

    if (ast.y - ast.rayon > zone_jeu.clientHeight + 40 || ast.x + ast.rayon < -40 || ast.x - ast.rayon > zone_jeu.clientWidth + 40) {
      ast.element.remove();
      asteroides.splice(i, 1);
      continue;
    }

    ast.element.style.left = ast.x + 'px';
    ast.element.style.top = ast.y + 'px';
    ast.element.style.transform = `translate(-50%,-50%) rotate(${ast.rotation}deg)`;

    if (temps_sec() >= invuln_jusqua) {
      let rx = vaisseau.x - HITBOX_L / 2;
      let ry = vaisseau.y - HITBOX_H / 2;
      let rw = HITBOX_L;
      let rh = HITBOX_H;
      if (collision_cercle_rect(ast.x, ast.y, ast.rayon * 0.9, rx, ry, rw, rh)) {
        ast.element.remove();
        asteroides.splice(i, 1);
        perdre_vie();
        if (!en_cours) return;
      }
    }
  }
  anim_frame = requestAnimationFrame(boucle);
}