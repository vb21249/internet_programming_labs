let currentAnswer;
let attempts = 0;

export function getCurrentAnswer() {
    return currentAnswer;
}

export function generateProblem(range = 10, operation = '+') {
    attempts = 0;
    let num1 = Math.floor(Math.random() * range);
    let num2 = Math.floor(Math.random() * range);

    if (operation === '/') {
        if (num2 === 0) num2 = 1;
        if (num2 > num1) {
            [num1, num2] = [num2, num1];
        }
    }

    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }

    switch (operation) {
        case '+': currentAnswer = num1 + num2; break;
        case '-': currentAnswer = num1 - num2; break;
        case '*': currentAnswer = num1 * num2; break;
        case '/': currentAnswer = Math.floor(num1 / num2); break;
    }

    return { num1, num2, operation, answer: currentAnswer };
}

export function checkUserAnswer(input) {
    const userAnswer = parseFloat(input);
    if (isNaN(userAnswer)) return { status: 'invalid' };

    attempts++;

    if (userAnswer === currentAnswer) {
        return { status: 'correct' };
    } else if (attempts >= 3) {
        return { status: 'failed', answer: currentAnswer };
    } else {
        return { status: 'retry', attempts };
    }
}