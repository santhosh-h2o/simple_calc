import React, { useState, useEffect } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [prevKey, setPrevKey] = useState('');

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      
      // Allow numbers, operators, and decimal point
      if (/[0-9+\-*/.()]/.test(key)) {
        handleButtonClick(key);
        e.preventDefault();
      } 
      // Handle Enter key for calculation
      else if (key === 'Enter' || key === '=') {
        calculate();
        e.preventDefault();
      } 
      // Handle Backspace for deleting last character
      else if (key === 'Backspace') {
        setDisplay(prev => prev.slice(0, -1));
        e.preventDefault();
      }
      // Handle Escape to clear
      else if (key === 'Escape') {
        clearDisplay();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleButtonClick = (value) => {
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/'].includes(value) && ['+', '-', '*', '/'].includes(prevKey)) {
      setDisplay(prev => prev.slice(0, -1) + value);
    } else {
      setDisplay(prev => prev + value);
    }
    setPrevKey(value);
  };

  const clearDisplay = () => {
    setDisplay('');
    setResult('');
    setPrevKey('');
  };

  const calculate = () => {
    if (!display) return;
    
    try {
      // Use Function constructor instead of eval for safer evaluation
      const calculatedResult = new Function('return ' + display)();
      setResult(`${display} =`);
      setDisplay(String(calculatedResult));
      setPrevKey('=');
    } catch (error) {
      setResult('Error');
      setPrevKey('error');
    }
  };

  const buttonClasses = "flex items-center justify-center h-14 rounded-xl bg-white/20 backdrop-blur-md text-white text-2xl font-semibold shadow-md hover:bg-white/30 active:scale-95 transition-all duration-150";
  const operatorClasses = "flex items-center justify-center h-14 rounded-xl bg-purple-500/50 backdrop-blur-md text-white text-2xl font-semibold shadow-md hover:bg-purple-500/70 active:scale-95 transition-all duration-150";
  const equalsClasses = "flex items-center justify-center h-14 rounded-xl bg-gradient-to-r from-blue-500/70 to-purple-600/70 backdrop-blur-md text-white text-2xl font-semibold shadow-md hover:from-blue-500/90 hover:to-purple-600/90 active:scale-95 transition-all duration-150";
  const clearClasses = "flex items-center justify-center h-14 rounded-xl bg-red-500/50 backdrop-blur-md text-white text-2xl font-semibold shadow-md hover:bg-red-500/70 active:scale-95 transition-all duration-150";

  return (
    <div className="w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass">
      <div className="mb-5">
        <div className="text-right text-white/60 text-sm h-6 overflow-hidden">
          {result}
        </div>
        <input
          type="text"
          value={display}
          readOnly
          className="w-full bg-transparent text-white text-right text-3xl font-bold focus:outline-none"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <button onClick={clearDisplay} className={clearClasses}>C</button>
        <button onClick={() => handleButtonClick('(')} className={operatorClasses}>(</button>
        <button onClick={() => handleButtonClick(')')} className={operatorClasses}>)</button>
        <button onClick={() => handleButtonClick('/')} className={operatorClasses}>÷</button>
        
        <button onClick={() => handleButtonClick('7')} className={buttonClasses}>7</button>
        <button onClick={() => handleButtonClick('8')} className={buttonClasses}>8</button>
        <button onClick={() => handleButtonClick('9')} className={buttonClasses}>9</button>
        <button onClick={() => handleButtonClick('*')} className={operatorClasses}>×</button>
        
        <button onClick={() => handleButtonClick('4')} className={buttonClasses}>4</button>
        <button onClick={() => handleButtonClick('5')} className={buttonClasses}>5</button>
        <button onClick={() => handleButtonClick('6')} className={buttonClasses}>6</button>
        <button onClick={() => handleButtonClick('-')} className={operatorClasses}>-</button>
        
        <button onClick={() => handleButtonClick('1')} className={buttonClasses}>1</button>
        <button onClick={() => handleButtonClick('2')} className={buttonClasses}>2</button>
        <button onClick={() => handleButtonClick('3')} className={buttonClasses}>3</button>
        <button onClick={() => handleButtonClick('+')} className={operatorClasses}>+</button>
        
        <button onClick={() => handleButtonClick('0')} className="col-span-2 flex items-center justify-center h-14 rounded-xl bg-white/20 backdrop-blur-md text-white text-2xl font-semibold shadow-md hover:bg-white/30 active:scale-95 transition-all duration-150">0</button>
        <button onClick={() => handleButtonClick('.')} className={buttonClasses}>.</button>
        <button onClick={calculate} className={equalsClasses}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
