// Default variables
let range = 10;
let operation = '+';
let num1, num2, answer;
let attempts = 0;

// Elements
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const messageEl = document.getElementById('message');

function newProblem() {
    attempts = 0;
    messageEl.style.display = 'none';

    num1 = Math.floor(Math.random() * range);
    num2 = Math.floor(Math.random() * range);

    // Handle special cases
    if (operation === '/') {
        if (num2 === 0) num2 = 1;
        const temp = num1 * num2;
        num1 = temp;
    }

    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }

    // Calculate answer
    switch (operation) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
        case '/': answer = num1 / num2; break;
    }

    // Show problem
    let op = operation;
    if (op === '*') op = '×';
    if (op === '/') op = '÷';
    questionEl.textContent = `${num1} ${op} ${num2} =`;
    answerEl.value = '';
}

function checkAnswer() {
    const userAnswer = parseFloat(answerEl.value);

    if (isNaN(userAnswer)) {
        showMessage('Enter a valid number', 'error');
        return;
    }

    attempts++;

    if (userAnswer === answer) {
        showMessage('Correct!', 'success');
        setTimeout(newProblem, 1000);
    } else if (attempts >= 3) {
        showMessage(`Incorrect. Answer: ${answer}`, 'error');
        setTimeout(newProblem, 1500);
    } else {
        showMessage(`Try again (${attempts}/3)`, 'error');
        answerEl.value = '';
    }
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.style.display = 'block';
}

// Events
// Handle active range button
document.querySelectorAll('.range').forEach(btn => {
    btn.addEventListener('click',
        function () {
            document.querySelectorAll('.range').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            range = parseInt(this.dataset.range);
            newProblem();
        });
});


// Handle active operation button
document.querySelectorAll('.operation').forEach(btn => {
    btn.addEventListener('click',
        function () {
            document.querySelectorAll('.operation').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            operation = this.dataset.op;
            newProblem();
        });
});


// Handle num buttons + C, <-
document.querySelectorAll('.num').forEach(btn => {
    btn.addEventListener('click',
        function () {
            const val = this.dataset.val || this.textContent;

            if (val === 'C') {
                answerEl.value = '';
            } else if (val === '←') {
                answerEl.value = answerEl.value.slice(0, -1);
            } else {
                answerEl.value += val;
            }
        });
});

// Get answer
document.getElementById('help').addEventListener('click', function () {
    alert('The answer is ' + answer);
});

// Submit
document.getElementById('submit').addEventListener('click', checkAnswer);

// Enter to submit anwer
answerEl.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkAnswer();
});


newProblem();