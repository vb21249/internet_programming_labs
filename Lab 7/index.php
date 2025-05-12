<?php
session_start();
require_once 'logic.php';

// Initialize session variables if not set
if (!isset($_SESSION['problem'])) {
    $_SESSION['problem'] = generateProblem(10, '+');
    $_SESSION['attempts'] = 0;
}

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['reset'])) {

        $_SESSION['problem'] = generateProblem(
            $_SESSION['range'] ?? 10,
            $_SESSION['operation'] ?? '+'
        );
        $_SESSION['attempts'] = 0;

    } elseif (isset($_POST['range'])) {
        // Range was changed
        $_SESSION['range'] = intval($_POST['range']);
        $_SESSION['problem'] = generateProblem(
            $_SESSION['range'],
            $_SESSION['operation'] ?? '+'
        );
        $_SESSION['attempts'] = 0;

    } elseif (isset($_POST['operation'])) {
        // Operation was changed
        $_SESSION['operation'] = $_POST['operation'];
        $_SESSION['problem'] = generateProblem(
            $_SESSION['range'] ?? 10,
            $_SESSION['operation']
        );
        $_SESSION['attempts'] = 0;
    } elseif (isset($_POST['check']) && isset($_POST['answer'])) {
        // Check answer
        $answer = $_POST['answer'];
        $result = checkUserAnswer($answer, $_SESSION['problem']['answer'], $_SESSION['attempts']);

        $_SESSION['attempts'] = $result['attempts'];
        $message = $result['message'];
        $messageType = $result['type'];

        if ($result['status'] === 'correct' || $result['status'] === 'failed') {
            // Generate new problem after correct answer or failed attempts
            $_SESSION['problem'] = generateProblem(
                $_SESSION['range'] ?? 10,
                $_SESSION['operation'] ?? '+'
            );
            $_SESSION['attempts'] = 0;
        }
    } elseif (isset($_POST['help'])) {
        // Help button was clicked
        $message = "The answer is " . $_SESSION['problem']['answer'];
        $messageType = "help";
    }
}

// Get current settings
$currentRange = $_SESSION['range'] ?? 10;
$currentOperation = $_SESSION['operation'] ?? '+';
$problem = $_SESSION['problem'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Math Trainer</title>
</head>
<body>
<h1>Math Trainer</h1>

<form method="post" action="">
    <div class="options">
        <div>Range:</div>
        <button type="submit" name="range" value="10" class="range <?= $currentRange == 10 ? 'active' : '' ?>">0-10</button>
        <button type="submit" name="range" value="20" class="range <?= $currentRange == 20 ? 'active' : '' ?>">0-20</button>
        <button type="submit" name="range" value="23" class="range <?= $currentRange == 23 ? 'active' : '' ?>">0-23</button>
        <button type="submit" name="range" value="100" class="range <?= $currentRange == 100 ? 'active' : '' ?>">0-100</button>
        <button type="submit" name="range" value="150" class="range <?= $currentRange == 150 ? 'active' : '' ?>">0-150</button>
    </div>
</form>

<form method="post" action="">
    <div class="options">
        <div>Operations:</div>
        <button type="submit" name="operation" value="+" class="operation <?= $currentOperation == '+' ? 'active' : '' ?>">+</button>
        <button type="submit" name="operation" value="-" class="operation <?= $currentOperation == '-' ? 'active' : '' ?>">-</button>
        <button type="submit" name="operation" value="*" class="operation <?= $currentOperation == '*' ? 'active' : '' ?>">×</button>
        <button type="submit" name="operation" value="/" class="operation <?= $currentOperation == '/' ? 'active' : '' ?>">÷</button>
    </div>
</form>

<div class="problem">
    <span id="question"><?= displayProblem($problem['num1'], $problem['num2'], $problem['operation']) ?></span>
    <form method="post" action="" id="answerForm">
        <input type="text" id="answer" name="answer" autofocus>
        <button type="submit" name="help">?</button>
        <button type="submit" name="check" id="submit">Check Answer</button>
    </form>
</div>

<div class="numpad">
    <button type="button" class="num" data-val="1">1</button>
    <button type="button" class="num" data-val="2">2</button>
    <button type="button" class="num" data-val="3">3</button>
    <button type="button" class="num" data-val="4">4</button>
    <button type="button" class="num" data-val="5">5</button>
    <button type="button" class="num" data-val="6">6</button>
    <button type="button" class="num" data-val="7">7</button>
    <button type="button" class="num" data-val="8">8</button>
    <button type="button" class="num" data-val="9">9</button>
    <button type="button" class="num" data-val="C">C</button>
    <button type="button" class="num" data-val="0">0</button>
    <button type="button" class="num" data-val="←">←</button>
</div>

<?php if (!empty($message)): ?>
    <div id="message" class="message <?= $messageType ?>"><?= $message ?></div>
<?php endif; ?>

<script>

    document.querySelectorAll('.num').forEach(btn => {
        btn.addEventListener('click', () => {
            const answerEl = document.getElementById('answer');
            const val = btn.getAttribute('data-val');

            if (val === 'C') answerEl.value = '';
            else if (val === '←') answerEl.value = answerEl.value.slice(0, -1);
            else answerEl.value += val;

            answerEl.focus();
        });
    });

    // hide message
    const messageEl = document.getElementById('message');
    if (messageEl) {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
</script>
</body>
</html>