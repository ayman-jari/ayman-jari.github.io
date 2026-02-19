<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
// pour le score
$donnees_brut = file_get_contents('php://input');
$score_envoye = null;
if($donnees_brut != ''){
$json = json_decode($donnees_brut, true);
if(is_array($json) && isset($json['score'])){
$score_envoye = (int)$json['score'];
}
}
if(!isset($_SESSION['asteroids_session_best'])){
$_SESSION['asteroids_session_best'] = 0;
}
if($score_envoye != null && $score_envoye > $_SESSION['asteroids_session_best']){
$_SESSION['asteroids_session_best'] = $score_envoye;
}
echo json_encode(array('session_best' => (int)$_SESSION['asteroids_session_best']));
?>