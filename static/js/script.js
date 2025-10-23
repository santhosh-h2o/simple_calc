let display = document.getElementById('display');
let resultDisplay = document.getElementById('result');
let currentMode = 'standard';
let bracketPairs = [];

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    // Set up mode toggle buttons
    document.getElementById('standard-mode').addEventListener('click', function() {
        setMode('standard');
    });
    
    document.getElementById('scientific-mode').addEventListener('click', function() {
        setMode('scientific');
    });
    
    document.getElementById('unit-mode').addEventListener('click', function() {
        setMode('unit');
    });
    
    // Initialize bracket highlighting
    display.addEventListener('input', highlightBrackets);
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
    // Only process keyboard events when in calculator modes (not unit conversion)
    if (currentMode === 'unit') return;
    
    const key = event.key;
    
    // Allow numbers, operators, and decimal point
    if (/[0-9+\-*/.()%^]/.test(key)) {
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
        highlightBrackets();
        event.preventDefault();
    }
    // Handle Escape to clear
    else if (key === 'Escape') {
        clearDisplay();
        event.preventDefault();
    }
});

function setMode(mode) {
    currentMode = mode;
    
    // Reset active state on all mode buttons
    document.querySelectorAll('.mode-toggle button').forEach(btn => {
        btn.classList.remove('mode-active');
    });
    
    // Set active state on selected mode button
    document.getElementById(mode + '-mode').classList.add('mode-active');
    
    // Hide all mode-specific elements
    document.getElementById('standard-buttons').style.display = 'none';
    document.getElementById('scientific-buttons').style.display = 'none';
    document.getElementById('unit-converter').style.display = 'none';
    
    // Show the selected mode's elements
    if (mode === 'standard') {
        document.getElementById('standard-buttons').style.display = 'grid';
        display.readOnly = true;
    } 
    else if (mode === 'scientific') {
        document.getElementById('scientific-buttons').style.display = 'grid';
        display.readOnly = true;
    } 
    else if (mode === 'unit') {
        document.getElementById('unit-converter').style.display = 'block';
    }
    
    // Clear the display when switching modes
    clearDisplay();
}

function appendToDisplay(value) {
    display.value += value;
    highlightBrackets();
}

function clearDisplay() {
    display.value = '';
    resultDisplay.textContent = '';
    document.getElementById('conversion-result').textContent = '';
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
            
            // Update history display if available
            updateHistoryDisplay(data.history);
        }
    } catch (error) {
        resultDisplay.textContent = 'Error: ' + error.message;
    }
}

async function convertUnit() {
    const value = document.getElementById('unit-value').value;
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    const resultElement = document.getElementById('conversion-result');
    
    if (!value || isNaN(value)) {
        resultElement.textContent = 'Please enter a valid number';
        return;
    }
    
    try {
        const response = await fetch('/unit_convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                value: value,
                from_unit: fromUnit,
                to_unit: toUnit
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            resultElement.textContent = 'Error: ' + data.error;
        } else {
            // Format the result based on the magnitude
            let formattedResult;
            if (Math.abs(data.result) < 0.001 || Math.abs(data.result) >= 10000) {
                formattedResult = data.result.toExponential(4);
            } else {
                formattedResult = parseFloat(data.result.toFixed(4));
            }
            
            resultElement.textContent = `${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
        }
    } catch (error) {
        resultElement.textContent = 'Error: ' + error.message;
    }
}

function highlightBrackets() {
    // Remove any existing highlights
    const text = display.value;
    bracketPairs = [];
    
    // Find matching brackets
    const stack = [];
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') {
            stack.push(i);
        } else if (text[i] === ')') {
            if (stack.length > 0) {
                const openPos = stack.pop();
                bracketPairs.push([openPos, i]);
            }
        }
    }
}

function loadFromHistory(expression, result) {
    display.value = result;
    resultDisplay.textContent = expression + ' =';
}

async function clearHistory() {
    try {
        const response = await fetch('/clear_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear the history display
            document.getElementById('history-list').innerHTML = '';
        }
    } catch (error) {
        console.error('Error clearing history:', error);
    }
}

function updateHistoryDisplay(history) {
    if (!history) return;
    
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    history.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = function() {
            loadFromHistory(entry.expression, entry.result);
        };
        
        const expressionDiv = document.createElement('div');
        expressionDiv.className = 'history-expression';
        expressionDiv.textContent = entry.expression;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'history-result';
        resultDiv.textContent = '= ' + entry.result;
        
        historyItem.appendChild(expressionDiv);
        historyItem.appendChild(resultDiv);
        historyList.appendChild(historyItem);
    });
}

function changeTheme() {
    const theme = document.getElementById('theme-select').value;
    
    // Remove all theme classes
    document.body.classList.remove('dark-theme', 'light-theme', 'colorful-theme');
    
    // Add the selected theme class
    if (theme !== 'default') {
        document.body.classList.add(theme + '-theme');
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
