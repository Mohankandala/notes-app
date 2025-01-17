import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Icons with expanded functionality
const ICONS = {
  home: '🏠',
  work: '💼',
  shopping: '🛒',
  personal: '❤️',
  travel: '✈️',
  todos: '✅',
  voice: '🎙️',
  images: '🖼️'
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
      todos: [],
      voice: [],
      images: []
    };
  });
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

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
        if (activeCategory === 'voice') {
          setLists(prevLists => ({
            ...prevLists,
            voice: [...prevLists.voice, { text: transcript, timestamp: new Date().toLocaleString() }]
          }));
        } else {
          setInputValue(transcript);
        }
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [activeCategory]);

  // Save lists to local storage
  useEffect(() => {
    localStorage.setItem('notesAppLists', JSON.stringify(lists));
  }, [lists]);

  const handleAddItem = () => {
    if (inputValue.trim() || imageFile) {
      const newItem = activeCategory === 'images' 
        ? { 
            url: URL.createObjectURL(imageFile), 
            name: imageFile.name,
            timestamp: new Date().toLocaleString() 
          }
        : { 
            text: inputValue.trim(), 
            timestamp: new Date().toLocaleString(),
            category: activeCategory === 'todos' ? 'pending' : null
          };

      setLists(prevLists => ({
        ...prevLists,
        [activeCategory]: [...prevLists[activeCategory], newItem]
      }));

      setInputValue('');
      if (imageFile) {
        setImageFile(null);
        fileInputRef.current.value = '';
      }
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

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

  const toggleTodoStatus = (index) => {
    if (activeCategory === 'todos') {
      const newList = [...lists.todos];
      newList[index].category = 
        newList[index].category === 'pending' ? 'completed' : 'pending';
      
      setLists(prevLists => ({
        ...prevLists,
        todos: newList
      }));
    }
  };

  const renderListItem = (item, index) => {
    switch (activeCategory) {
      case 'voice':
        return (
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
            <div>
              <span style={{ fontWeight: '500' }}>{item.text}</span>
              <div style={{ 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.6)',
                marginTop: '5px'
              }}>
                {item.timestamp}
              </div>
            </div>
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
        );
      
      case 'images':
        return (
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={item.url} 
                alt={item.name} 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  objectFit: 'cover', 
                  marginRight: '15px',
                  borderRadius: '8px'
                }} 
              />
              <div>
                <span style={{ fontWeight: '500' }}>{item.name}</span>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '5px'
                }}>
                  {item.timestamp}
                </div>
              </div>
            </div>
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
        );
      
      case 'todos':
        return (
          <li 
            key={index} 
            className="stripe-list-item"
            style={{
              margin: '10px 0',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: item.category === 'completed' 
                ? 'rgba(0,255,0,0.2)' 
                : 'rgba(255,255,255,0.1)'
            }}
          >
            <div onClick={() => toggleTodoStatus(index)} style={{ cursor: 'pointer' }}>
              <span style={{ 
                fontWeight: '500',
                textDecoration: item.category === 'completed' ? 'line-through' : 'none'
              }}>
                {item.text}
              </span>
              <div style={{ 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.6)',
                marginTop: '5px'
              }}>
                {item.timestamp}
              </div>
            </div>
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
        );
      
      default:
        return (
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
              {item.text || item}
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
        );
    }
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
          {activeCategory === 'images' ? (
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="stripe-input"
              style={{
                flex: 1,
                fontSize: '16px',
                padding: '10px'
              }}
            />
          ) : (
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
          )}
          
          {activeCategory === 'voice' && (
            <button 
              onClick={handleStartRecording}
              className="stripe-button"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                backgroundColor: isRecording ? 'red' : undefined
              }}
            >
              {isRecording ? 'Recording...' : 'Record'}
            </button>
          )}
          
          <button 
            onClick={handleAddItem}
            className="stripe-button"
            style={{
              padding: '12px 24px',
              fontSize: '14px'
            }}
          >
            {activeCategory === 'images' ? 'Upload' : 'Add Item'}
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
              {lists[activeCategory].map(renderListItem)}
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

        {/* Calendar */}
        <div style={{
          marginTop: '20px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 