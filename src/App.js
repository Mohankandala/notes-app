import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Icons with a more playful, tech-inspired look
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
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '20px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid rgba(255,255,255,0.2)'
      }}>
        {Object.entries(ICONS).map(([category, icon]) => (
          <div 
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              fontSize: '30px',
              margin: '10px 0',
              cursor: 'pointer',
              opacity: activeCategory === category ? 1 : 0.6,
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
          fontWeight: '700',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
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
            className="stripe-input"
            style={{
              flex: 1,
              fontSize: '16px'
            }}
          />
          <button 
            onClick={handleAddItem}
            className="stripe-button"
            style={{
              padding: '12px 24px',
              fontSize: '14px'
            }}
          >
            Add Item
          </button>
        </div>

        {/* List Area */}
        <div className="stripe-card" style={{
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
                  className="stripe-list-item"
                  style={{
                    margin: '10px 0',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ 
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}>
                    {item}
                  </span>
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
              color: 'rgba(255,255,255,0.7)',
              padding: '20px',
              fontStyle: 'italic'
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