<?php

function generateProblem($range = 10, $operation = '+') {
    $num1 = rand(0, $range - 1);
    $num2 = rand(0, $range - 1);

    if ($operation === '/') {
        if ($num2 === 0) $num2 = 1;
        if ($num2 > $num1) {
            $temp = $num1;
            $num1 = $num2;
            $num2 = $temp;
        }
    }

    if ($operation === '-' && $num2 > $num1) {
        $temp = $num1;
        $num1 = $num2;
        $num2 = $temp;
    }

    switch ($operation) {
        case '+': $answer = $num1 + $num2; break;
        case '-': $answer = $num1 - $num2; break;
        case '*': $answer = $num1 * $num2; break;
        case '/': $answer = intval($num1 / $num2); break;
        default: $answer = 0;
    }

    return [
        'num1' => $num1,
        'num2' => $num2,
        'operation' => $operation,
        'answer' => $answer
    ];
}

function displayProblem($num1, $num2, $operation) {
    $opSymbol = $operation;

    switch ($operation) {
        case '+': $opSymbol = '+'; break;
        case '-': $opSymbol = '-'; break;
        case '*': $opSymbol = '×'; break;
        case '/': $opSymbol = '÷'; break;
    }

    return "$num1 $opSymbol $num2 =";
}

function checkUserAnswer($input, $correctAnswer, $currentAttempts) {
    $attempts = $currentAttempts + 1;
    $userAnswer = trim($input);

    if ($userAnswer === '' || !is_numeric($userAnswer)) {
        return [
            'status' => 'invalid',
            'attempts' => $attempts,
            'message' => 'Enter a valid number',
            'type' => 'error'
        ];
    }

    $userAnswer = floatval($userAnswer);

    if ($userAnswer === floatval($correctAnswer)) {
        return [
            'status' => 'correct',
            'attempts' => 0,
            'message' => 'Correct!',
            'type' => 'success'
        ];
    } elseif ($attempts >= 3) {
        return [
            'status' => 'failed',
            'attempts' => 0,
            'message' => "Incorrect. Answer: $correctAnswer",
            'type' => 'error'
        ];
    } else {
        return [
            'status' => 'retry',
            'attempts' => $attempts,
            'message' => "Try again ($attempts/3)",
            'type' => 'error'
        ];
    }
}