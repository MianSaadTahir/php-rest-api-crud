<?php
// helpers.php

function send_json($data, $code = 200)
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function get_input_json()
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }
    return $data;
}

// Basic input sanitization helpers
function sanitize_string($s)
{
    return trim(filter_var($s, FILTER_SANITIZE_STRING));
}

function sanitize_float($v)
{
    return is_numeric($v) ? (float)$v : null;
}

function sanitize_int($v)
{
    return is_numeric($v) ? (int)$v : null;
}
