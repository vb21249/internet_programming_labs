export const answerEl = document.getElementById('answer');

export function displayProblem(num1, num2, operation) {
    let opSymbol;
    switch (operation) {
        case '+': opSymbol = '+'; break;
        case '-': opSymbol = '-'; break;
        case '*': opSymbol = '×'; break;
        case '/': opSymbol = '÷'; break;
        default: opSymbol = operation;
    }

    document.getElementById('question').textContent = `${num1} ${opSymbol} ${num2} =`;
}

export function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    // Hide the message after a delay
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}