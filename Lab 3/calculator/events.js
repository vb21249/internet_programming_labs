import { answerEl, displayProblem, showMessage } from './ui.js';
import { checkUserAnswer, generateProblem, operation, range, getCurrentAnswer } from './logic.js';

function addSelectRangeEventListener() {
    document.querySelectorAll('.range').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.range').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            range = parseInt(btn.dataset.range);
            loadProblem();
        });
    });
}

function addSelectOperationEventListener() {
    document.querySelectorAll('.operation').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.operation').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            operation = btn.dataset.op;
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
    const { num1, num2, operation } = generateProblem();
    displayProblem(num1, num2, operation);
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