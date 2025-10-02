from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data.get('expression', '')
    
    try:
        # Basic safety check - only allow numbers and basic operators
        if not all(c in '0123456789+-*/.() ' for c in expression):
            raise ValueError("Invalid characters in expression")
            
        # Use eval with limited globals and locals for security
        result = str(eval(expression, {"__builtins__": None}, {}))
        return jsonify({"result": result, "error": None})
    except Exception as e:
        return jsonify({"result": None, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
