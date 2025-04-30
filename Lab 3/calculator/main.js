import { displayProblem, showMessage } from './ui.js';
import { checkUserAnswer, generateProblem, getCurrentAnswer } from './logic.js';

// ANSWER element
const answerEl = document.getElementById('answer');

// Active settings
let currentRange = 10;
let currentOperation = '+';

function addSelectRangeEventListener() {
    document.querySelectorAll('.range').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.range').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRange = parseInt(btn.dataset.range);
            console.log("Current range: " + currentRange);
            loadProblem();
        });
    });
}

function addSelectOperationEventListener() {
    document.querySelectorAll('.operation').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.operation').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentOperation = btn.dataset.op;
            loadProblem();
        });
    });
}

function addNumpadEventListener() {
    document.querySelectorAll('.num').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.val || btn.textContent;
            if (val === 'C') answerEl.value = '';
            else if (val === '←') answerEl.value = answerEl.value.slice(0, -1);
            else answerEl.value += val;
        });
    });
}

function addOtherButtonsEventListeners() {
    document.getElementById('submit').addEventListener('click', check);
    document.getElementById('help').addEventListener('click', () => alert("The answer is " + getCurrentAnswer()));
    answerEl.addEventListener('keypress', e => {
        if (e.key === 'Enter') check();
    });
}

export function setupEvents() {
    addSelectRangeEventListener();
    addSelectOperationEventListener();
    addNumpadEventListener();
    addOtherButtonsEventListeners();
}

function loadProblem() {
    // Current range and op setting 
    const problem = generateProblem(currentRange, currentOperation);
    displayProblem(problem.num1, problem.num2, problem.operation);
    answerEl.value = ''; // Clear the answer field
}

function check() {
    const result = checkUserAnswer(answerEl.value);
    switch (result.status) {
        case 'invalid':
            showMessage('Enter a valid number', 'error');
            break;
        case 'correct':
            showMessage('Correct!', 'success');
            setTimeout(loadProblem, 1000);
            break;
        case 'retry':
            showMessage(`Try again (${result.attempts}/3)`, 'error');
            answerEl.value = '';
            break;
        case 'failed':
            showMessage(`Incorrect. Answer: ${result.answer}`, 'error');
            setTimeout(loadProblem, 1500);
            break;
    }
}

export function startApp() {
    loadProblem();
    setupEvents();
}

startApp();