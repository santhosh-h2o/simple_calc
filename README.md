# Simple Calculator App

A clean, responsive calculator web application built with Python (Flask) for the backend and vanilla JavaScript, HTML, and CSS for the frontend.

## Features
- Basic arithmetic operations (+, -, *, /)
- Parentheses for complex expressions
- Keyboard support
- Responsive design
- Clean, modern UI with smooth animations

## Prerequisites
- Python 3.7+
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd github_agent
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the Flask development server:
   ```bash
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

## Usage
- Click the buttons or use your keyboard to input numbers and operators
- Press `=` or `Enter` to calculate the result
- Press `C` or `Escape` to clear the display
- Use `Backspace` to delete the last character

## Project Structure
```
github_agent/
├── app.py                # Flask application
├── requirements.txt      # Python dependencies
├── static/               # Static files (CSS, JS, images)
│   ├── css/
│   │   └── style.css    # Stylesheet
│   └── js/
│       └── script.js    # Client-side JavaScript
├── templates/
│   └── index.html       # Main HTML template
└── README.md            # This file
```

## License
This project is open source and available under the MIT License.
