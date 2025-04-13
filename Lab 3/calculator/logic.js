export let range = 10;
export let operation = '+';
let num1, num2, answer;
let attempts = 0;


export function getCurrentAnswer() {
    return answer;
}

export function generateProblem() {
    attempts = 0;

    num1 = Math.floor(Math.random() * range);
    num2 = Math.floor(Math.random() * range);

    if (operation === '/') {
        if (num2 === 0) num2 = 1;
        num1 = num1 * num2;
    }

    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }

    switch (operation) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
        case '/': answer = num1 / num2; break;
    }

    return { num1, num2, operation, answer };
}

export function checkUserAnswer(input) {
    const userAnswer = parseFloat(input);
    if (isNaN(userAnswer)) return { status: 'invalid' };

    attempts++;

    if (userAnswer === answer) {
        return { status: 'correct' };
    } else if (attempts >= 3) {
        return { status: 'failed', answer };
    } else {
        return { status: 'retry', attempts };
    }
}

