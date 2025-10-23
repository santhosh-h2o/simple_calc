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
        // Show loading indicator
        resultDisplay.textContent = 'Calculating...';
        
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
        } else if (data.job_id) {
            // If we got a job ID, poll for results
            pollJobResult(data.job_id, expression);
        } else {
            display.value = data.result;
            resultDisplay.textContent = expression + ' =';
            
            // Show cached indicator if result was from cache
            if (data.cached) {
                const cachedIndicator = document.createElement('span');
                cachedIndicator.textContent = ' (cached)';
                cachedIndicator.style.fontSize = '0.8em';
                cachedIndicator.style.opacity = '0.7';
                resultDisplay.appendChild(cachedIndicator);
                
                // Fade out the cached indicator after 2 seconds
                setTimeout(() => {
                    cachedIndicator.style.transition = 'opacity 1s';
                    cachedIndicator.style.opacity = '0';
                }, 2000);
            }
        }
    } catch (error) {
        resultDisplay.textContent = 'Error: ' + error.message;
    }
}

async function pollJobResult(jobId, expression, attempts = 0) {
    if (attempts > 20) { // Limit polling attempts
        resultDisplay.textContent = 'Calculation taking too long. Please try again.';
        return;
    }
    
    try {
        const response = await fetch(`/job/${jobId}`);
        const data = await response.json();
        
        if (data.error) {
            resultDisplay.textContent = 'Error: ' + data.error;
        } else if (data.status === 'completed') {
            display.value = data.result;
            resultDisplay.textContent = expression + ' =';
        } else {
            // Update loading indicator to show progress
            resultDisplay.textContent = `Calculating${'.'.repeat((attempts % 3) + 1)}`;
            
            // Poll again after a delay
            setTimeout(() => pollJobResult(jobId, expression, attempts + 1), 500);
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
