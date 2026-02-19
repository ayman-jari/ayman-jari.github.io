<?php
// Chemin du fichier JSON à modifier
    $file = __DIR__ . '/../json/scores.json';

// Récupère l'action envoyée (join, leave, score)
    $action = $_POST['action'] ?? '';
    $pseudo = $_POST['pseudo'] ?? '';
    $score = (int) ($_POST['score'] ?? 0);

    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Si l'action est "join", on ajoute le joueur s'il n'existe pas déjà
    if ($action === 'join') {
        $found = false;
        foreach ($data as $player) {
            if ($player['pseudo'] === $pseudo) {
                $found = true;
                break;
            }
        }
        if (!$found) {
            $data[] = ['pseudo' => $pseudo, 'score' => 0];
        }
    }

// Si l'action est "leave", on retire le joueur de la liste
    if ($action === 'leave') {
        $data = array_filter($data, fn($p) => $p['pseudo'] !== $pseudo);
    }

// Si l'action est "score", on met à jour le score du joueur
    if ($action === 'score') {
        foreach ($data as &$player) {
            if ($player['pseudo'] === $pseudo) {
                $player['score'] = $score;
                break;
            }
        }
    }

// Enregistre les nouvelles données dans le fichier JSON
    file_put_contents($file, json_encode(array_values($data), JSON_PRETTY_PRINT));
?>