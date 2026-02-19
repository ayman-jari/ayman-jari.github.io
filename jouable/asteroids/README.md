# Asteroids

C'est un petit jeu style Asteroids. Il faut contrôler un vaisseau pour éviter des astéroïdes qui tombent. Le score augmente avec le temps, mais ça devient plus dur au fur et à mesure. Les astéroïdes viennent de plus en plus vite et sont de plus en plus gros.

## Fichiers

- `index.html` : page principale, avec le menu et la zone de jeu
- `style.css` : fond étoilé, boutons, etc...
- `app.js` : mouvement vaisseau, astéroïdes, collisions
- `session_best.php` : sauvegarde le meilleur score de la session
- dossier `img/` : les images du vaisseau, des astéroïdes et de l'espace

## Lancer le jeu

- Ouvrir `index.html` directement
ou
- Utiliser un serveur PHP afin que le score de session fonctionne

## Détails techniques

- Fait en HTML, CSS, JavaScript, et un peu de PHP.
- Les astéroïdes spawn toutes les 300ms (réglable via constante) au début
- Le vaisseau bouge à 700px/s, avec hitbox pour les collisions.
- Le fond étoilé défile avec une animation CSS.

## Améliorations possibles

- Des sons (explosions, musique).
- Des tirs pour détruire les astéroïdes.
- Un leaderboard en ligne.