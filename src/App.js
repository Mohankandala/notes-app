import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Icons (using Unicode for simplicity)
const ICONS = {
  home: '🏠',
  work: '💼',
  shopping: '🛒',
  personal: '❤️',
  travel: '✈️',
  recipes: '🍳'
};

// Keyboard Layout
const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

function App() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [lists, setLists] = useState({
    home: [],
    work: [],
    shopping: [],
    personal: [],
    travel: [],
    recipes: []
  });
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const inputRef = useRef(null);

  // Voice Recognition Setup
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prevValue => prevValue + ' ' + transcript);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleStartRecording = () => {
    if (recognition && !isRecording) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
        alert('Voice input not supported or permission denied');
      }
    }
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setLists(prevLists => ({
        ...prevLists,
        [activeCategory]: [...prevLists[activeCategory], inputValue.trim()]
      }));
      setInputValue('');
      setShowKeyboard(false);
    }
  };

  const handleRemoveItem = (index) => {
    const newList = [...lists[activeCategory]];
    newList.splice(index, 1);
    setLists(prevLists => ({
      ...prevLists,
      [activeCategory]: newList
    }));
  };

  const handleKeyboardInput = (key) => {
    if (key === 'backspace') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (key === 'space') {
      setInputValue(prev => prev + ' ');
    } else {
      const charToAdd = isUppercase ? key.toUpperCase() : key;
      setInputValue(prev => prev + charToAdd);
    }
    inputRef.current.focus();
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: 'rgba(144, 238, 144, 0.1)',
        padding: '20px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {Object.entries(ICONS).map(([category, icon]) => (
          <div 
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              fontSize: '30px',
              margin: '10px 0',
              cursor: 'pointer',
              opacity: activeCategory === category ? 1 : 0.5,
              transform: activeCategory === category ? 'scale(1.2)' : 'scale(1)'
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '40px 30px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h1 style={{
          fontSize: '28px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {ICONS[activeCategory]} {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} List
        </h1>

        {/* Input Area */}
        <div style={{
          display: 'flex',
          marginBottom: '20px'
        }}>
          <input 
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowKeyboard(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder={`Add new ${activeCategory} item`}
            style={{
              flex: 1,
              borderRadius: '100px',
              padding: '10px 20px',
              border: '1px solid #ccc',
              backgroundColor: '#111',
              color: '#fff',
              marginRight: '10px'
            }}
          />
          <button 
            onClick={handleStartRecording}
            style={{
              backgroundColor: isRecording ? 'red' : 'lightgreen',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            🎤
          </button>
          <button 
            onClick={handleAddItem}
            style={{
              backgroundColor: 'lightgreen',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 20px',
              color: '#111',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>

        {/* On-Screen Keyboard */}
        {showKeyboard && (
          <div style={{
            backgroundColor: 'rgba(144, 238, 144, 0.1)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}
              >
                {rowIndex === 2 && (
                  <button 
                    onClick={() => setIsUppercase(!isUppercase)}
                    style={{
                      margin: '0 5px',
                      padding: '10px',
                      backgroundColor: isUppercase ? 'lightgreen' : 'rgba(144, 238, 144, 0.3)',
                      border: 'none',
                      borderRadius: '5px'
                    }}
                  >
                    ⇧
                  </button>
                )}
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeyboardInput(key)}
                    style={{
                      margin: '0 5px',
                      padding: '10px',
                      backgroundColor: 'rgba(144, 238, 144, 0.3)',
                      border: 'none',
                      borderRadius: '5px',
                      color: '#fff'
                    }}
                  >
                    {isUppercase ? key.toUpperCase() : key}
                  </button>
                ))}
                {rowIndex === 2 && (
                  <button 
                    onClick={() => handleKeyboardInput('backspace')}
                    style={{
                      margin: '0 5px',
                      padding: '10px',
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      border: 'none',
                      borderRadius: '5px'
                    }}
                  >
                    ⌫
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => handleKeyboardInput('space')}
              style={{
                width: '50%',
                padding: '10px',
                backgroundColor: 'rgba(144, 238, 144, 0.3)',
                border: 'none',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            >
              Space
            </button>
          </div>
        )}

        {/* List Area */}
        {lists[activeCategory].length > 0 ? (
          <div style={{
            backgroundColor: 'rgba(144, 238, 144, 0.2)',
            borderRadius: '10px',
            padding: '15px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0
            }}>
              {lists[activeCategory].map((item, index) => (
                <li 
                  key={index} 
                  style={{
                    backgroundColor: 'rgba(144, 238, 144, 0.3)',
                    margin: '5px 0',
                    padding: '10px',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {item}
                  <button 
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      backgroundColor: 'rgba(255,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            padding: '20px'
          }}>
            No items in {activeCategory} list
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 