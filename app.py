from flask import Flask, render_template, request, jsonify, session
import math
import re

app = Flask(__name__)
app.secret_key = 'calculator_secret_key'  # Required for session

@app.route('/')
def index():
    # Initialize calculation history in session if it doesn't exist
    if 'history' not in session:
        session['history'] = []
    return render_template('index.html', history=session['history'])

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data.get('expression', '')
    
    try:
        # Basic safety check - only allow numbers, basic operators, and scientific functions
        if not is_valid_expression(expression):
            raise ValueError("Invalid characters in expression")
            
        # Process the expression to handle scientific functions
        processed_expression = process_scientific_functions(expression)
        
        # Use eval with limited globals and locals for security
        # Add math functions to the allowed globals
        allowed_globals = {
            "math": math,
            "__builtins__": None
        }
        
        result = str(eval(processed_expression, allowed_globals, {}))
        
        # Save to history
        if 'history' not in session:
            session['history'] = []
        
        # Add to history (limit to 10 entries)
        history_entry = {"expression": expression, "result": result}
        session['history'] = [history_entry] + session['history']
        if len(session['history']) > 10:
            session['history'] = session['history'][:10]
        
        return jsonify({
            "result": result, 
            "error": None,
            "history": session['history']
        })
    except Exception as e:
        return jsonify({"result": None, "error": str(e)}), 400

@app.route('/clear_history', methods=['POST'])
def clear_history():
    session['history'] = []
    return jsonify({"status": "success"})

@app.route('/unit_convert', methods=['POST'])
def unit_convert():
    data = request.get_json()
    value = float(data.get('value', 0))
    from_unit = data.get('from_unit', '')
    to_unit = data.get('to_unit', '')
    
    # Conversion factors (relative to base unit)
    conversion_factors = {
        # Length (base: meter)
        'mm': 0.001,
        'cm': 0.01,
        'm': 1,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34,
        
        # Weight (base: kilogram)
        'mg': 0.000001,
        'g': 0.001,
        'kg': 1,
        'oz': 0.0283495,
        'lb': 0.453592,
        't': 1000,
        
        # Volume (base: liter)
        'ml': 0.001,
        'l': 1,
        'gal': 3.78541,
        'pt': 0.473176,
        'qt': 0.946353,
        
        # Temperature requires special handling
    }
    
    # Special case for temperature
    if from_unit in ['c', 'f', 'k'] and to_unit in ['c', 'f', 'k']:
        if from_unit == 'c' and to_unit == 'f':
            result = (value * 9/5) + 32
        elif from_unit == 'c' and to_unit == 'k':
            result = value + 273.15
        elif from_unit == 'f' and to_unit == 'c':
            result = (value - 32) * 5/9
        elif from_unit == 'f' and to_unit == 'k':
            result = ((value - 32) * 5/9) + 273.15
        elif from_unit == 'k' and to_unit == 'c':
            result = value - 273.15
        elif from_unit == 'k' and to_unit == 'f':
            result = ((value - 273.15) * 9/5) + 32
        else:  # Same unit
            result = value
    else:
        # Standard conversion
        if from_unit in conversion_factors and to_unit in conversion_factors:
            # Convert to base unit, then to target unit
            base_value = value * conversion_factors[from_unit]
            result = base_value / conversion_factors[to_unit]
        else:
            return jsonify({"result": None, "error": "Unsupported unit conversion"}), 400
    
    return jsonify({"result": result, "error": None})

def is_valid_expression(expression):
    # Allow numbers, operators, parentheses, scientific functions, and constants
    allowed_pattern = r'^[0-9+\-*/().\s\t\n\r%\^sincotaglpexqrtPIE]+$'
    return bool(re.match(allowed_pattern, expression, re.IGNORECASE))

def process_scientific_functions(expression):
    # Replace scientific function names with their math module equivalents
    replacements = {
        'sin': 'math.sin',
        'cos': 'math.cos',
        'tan': 'math.tan',
        'log': 'math.log10',
        'ln': 'math.log',
        'sqrt': 'math.sqrt',
        'abs': 'abs',
        'PI': 'math.pi',
        'E': 'math.e',
        '^': '**',  # Replace caret with Python's power operator
    }
    
    processed = expression
    for func, replacement in replacements.items():
        # Case-insensitive replacement
        pattern = re.compile(re.escape(func), re.IGNORECASE)
        processed = pattern.sub(replacement, processed)
    
    return processed

if __name__ == '__main__':
    app.run(debug=True)
