let display = document.getElementById('display');
let resultDisplay = document.getElementById('result');

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Allow numbers, operators, and decimal point
    if (/[0-9+\-*/.()]/.test(key)) {
        appendToDisplay(key);
        event.preventDefault();
    } 
    // Handle Enter key for calculation
    else if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault();
    } 
    // Handle Backspace for deleting last character
    else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
        event.preventDefault();
    }
    // Handle Escape to clear
    else if (key === 'Escape') {
        clearDisplay();
        event.preventDefault();
    }
});

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    resultDisplay.textContent = '';
}

async function calculate() {
    const expression = display.value;
    
    if (!expression) return;
    
    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression })
        });
        
        const data = await response.json();
        
        if (data.error) {
            resultDisplay.textContent = 'Error: ' + data.error;
        } else {
            display.value = data.result;
            resultDisplay.textContent = expression + ' =';
        }
    } catch (error) {
        resultDisplay.textContent = 'Error: ' + error.message;
    }
}

// Add button press animation
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});
