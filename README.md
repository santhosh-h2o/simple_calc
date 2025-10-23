# Simple Calculator App

A clean, responsive calculator web application built with Python (Flask) for the backend and vanilla JavaScript, HTML, and CSS for the frontend.

![Calculator Screenshot](https://via.placeholder.com/600x400?text=Simple+Calculator+App)

## ✨ Features

- **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- **Support for Complex Expressions**: Includes parentheses for mathematical order of operations
- **Keyboard Support**: Use your keyboard for quick calculations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface with smooth animations and visual feedback
- **Error Handling**: Graceful handling of invalid expressions

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.com) (Coming soon)

## 🛠️ Technologies Used

- **Backend**: Python with Flask framework
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with responsive design
- **Testing**: Pytest for backend testing

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/santhosh-h2o/simple_calc.git
   cd simple_calc
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Running the Application

1. **Start the Flask development server**:
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

## 🖥️ Usage

- Click the buttons or use your keyboard to input numbers and operators
- Press `=` or `Enter` to calculate the result
- Press `C` or `Escape` to clear the display
- Use `Backspace` to delete the last character

## 📁 Project Structure

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

## 🧪 Testing

Run tests using pytest:

```bash
pytest
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
