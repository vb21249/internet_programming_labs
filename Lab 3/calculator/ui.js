export const questionEl = document.getElementById('question');
export const answerEl = document.getElementById('answer');
const messageEl = document.getElementById('message');

export function displayProblem(num1, num2, op) {
    let symbol = op === '*' ? '×' : op === '/' ? '÷' : op;
    questionEl.textContent = `${num1} ${symbol} ${num2} =`;
    answerEl.value = '';
    messageEl.style.display = 'none';
}

export function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.style.display = 'block';
}