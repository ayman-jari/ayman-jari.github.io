<?php
// Chemin du fichier JSON à modifier
    $file = __DIR__ . '/../json/chat.json';

    $pseudo = $_POST['pseudo'] ?? 'Anonyme';
    $message = $_POST['message'] ?? '';

    if ($message !== '') {
        $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        $data[] = [
            'time' => date('H:i'),
            'pseudo' => htmlspecialchars($pseudo),
            'message' => htmlspecialchars($message)
        ];

// Enregistre les nouvelles données dans le fichier JSON
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    }
?>