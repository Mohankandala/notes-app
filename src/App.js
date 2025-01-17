import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Icons (using SF Symbols style)
const ICONS = {
  home: '🏠',
  work: '💼',
  shopping: '🛒',
  personal: '❤️',
  travel: '✈️',
  recipes: '🍳'
};

function App() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('notesAppLists');
    return savedLists ? JSON.parse(savedLists) : {
      home: [],
      work: [],
      shopping: [],
      personal: [],
      travel: [],
      recipes: []
    };
  });
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  // Save lists to local storage
  useEffect(() => {
    localStorage.setItem('notesAppLists', JSON.stringify(lists));
  }, [lists]);

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setLists(prevLists => ({
        ...prevLists,
        [activeCategory]: [...prevLists[activeCategory], inputValue.trim()]
      }));
      setInputValue('');
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

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      color: '#f5f5f7',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        padding: '20px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid rgba(255,255,255,0.1)'
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
              transform: activeCategory === category ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.3s ease'
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
          fontSize: '36px',
          fontWeight: '600',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} List
        </h1>

        {/* Input Area */}
        <div style={{
          display: 'flex',
          marginBottom: '30px',
          gap: '15px'
        }}>
          <input 
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder={`Add new ${activeCategory} item`}
            className="apple-input"
            style={{
              flex: 1,
              fontSize: '16px'
            }}
          />
          <button 
            onClick={handleAddItem}
            className="apple-button"
            style={{
              padding: '12px 20px',
              fontSize: '16px'
            }}
          >
            Add
          </button>
        </div>

        {/* List Area */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '15px',
          padding: '20px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {lists[activeCategory].length > 0 ? (
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0
            }}>
              {lists[activeCategory].map((item, index) => (
                <li 
                  key={index} 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    margin: '10px 0',
                    padding: '15px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span>{item}</span>
                  <button 
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      background: 'rgba(255,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
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
    </div>
  );
}

export default App; 