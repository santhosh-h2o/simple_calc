# Simple Calculator App

A clean, responsive calculator web application built with Python (Flask) for the backend and vanilla JavaScript, HTML, and CSS for the frontend.

## Features

- Basic arithmetic operations (+, -, *, /)
- Parentheses for complex expressions
- Keyboard support for easy input
- Responsive design for all device sizes
- Clean, modern UI with smooth animations
- Error handling for invalid expressions

## Screenshots

![Calculator Screenshot](https://via.placeholder.com/500x300?text=Calculator+Screenshot)

## Live Demo

[Try the calculator online](#) (Coming soon)

## Prerequisites

- Python 3.7+
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/santhosh-h2o/simple_calc.git
   cd simple_calc
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

## Error Handling

The calculator includes robust error handling for:
- Invalid expressions
- Division by zero
- Syntax errors
- Security protections against code injection

## Project Structure

```
simple_calc/
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
