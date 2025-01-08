import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Input } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { DraggableText } from '@/components/DraggableText/DraggableText.jsx';
import { ImageDownloader } from '@/components/ImageDownloader.jsx';
import html2canvas from 'html2canvas';
import './UploadPage.css';

export function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMeme = location.state?.selectedMeme;
  const colors = ['#FF0000', '#000000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
  const imageContainerRef = useRef(null);
  
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [isNewText, setIsNewText] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      Telegram.WebApp.ready();
    }
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrentText(newText);

    if (selectedTextId) {
      setTexts(texts.map(text => 
        text.id === selectedTextId 
          ? { ...text, content: newText, color: selectedColor }
          : text
      ));
    } else if (newText.trim() && isNewText) {
      const newTextObj = {
        id: Date.now(),
        content: newText,
        color: selectedColor,
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0
      };
      setTexts([...texts, newTextObj]);
      setSelectedTextId(newTextObj.id);
      setIsNewText(false);
    }
  };

  const handleTextClick = (id) => {
    if (id === selectedTextId) {
      setSelectedTextId(null);
      setCurrentText('');
      setIsNewText(true);
    } else {
      setSelectedTextId(id);
      const text = texts.find(t => t.id === id);
      if (text) {
        setCurrentText(text.content);
        setSelectedColor(text.color);
        setIsNewText(false);
      }
    }
  };

  const handleImageContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedTextId(null);
      setCurrentText('');
      setIsNewText(true);
    }
  };

  const handleUploadClick = () => {
    if (!selectedMeme) {
      navigate('/gallery');
    }
  };

  const updateTextPosition = (id, newPosition) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, position: newPosition } : text
    ));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (selectedTextId) {
      setTexts(texts.map(text => 
        text.id === selectedTextId 
          ? { ...text, color }
          : text
      ));
    }
  };

  return (
    <Page back={selectedMeme ? true : false}>
      <div className="upload-page">
        <div className="upload-container">
          <div 
            className={`upload-area ${selectedMeme ? 'upload-area--selected' : ''}`}
            onClick={handleUploadClick}
          >
            {selectedMeme ? (
              <div 
                ref={imageContainerRef}
                className="image-container" 
                onClick={handleImageContainerClick}
              >
                <img 
                  src={selectedMeme.image} 
                  alt={selectedMeme.name} 
                  className="selected-image"
                  onClick={handleImageContainerClick}
                />
                {texts.map(text => (
                  <DraggableText
                    key={text.id}
                    text={text.content}
                    color={text.color}
                    position={text.position}
                    isSelected={!isSaving && text.id === selectedTextId}
                    onClick={() => handleTextClick(text.id)}
                    onPositionChange={(pos) => updateTextPosition(text.id, pos)}
                  />
                ))}
              </div>
            ) : (
              <button className="upload-button" onClick={handleUploadClick}>
                <span className="upload-icon">+</span>
                Выбрать мем
              </button>
            )}
          </div>
          
          <div className="text-controls">
            <Input
              className="text-input"
              placeholder="Введите текст..."
              value={currentText}
              onChange={handleTextChange}
            />
            
            <div className="color-picker">
              {colors.map((color, index) => (
                <button 
                  key={index}
                  className="color-button"
                  style={{ 
                    backgroundColor: color,
                    border: color === selectedColor ? '2px solid white' : 'none'
                  }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div className="action-buttons">
          <ImageDownloader
              containerRef={imageContainerRef}
              fileName="custom-meme.png"
              onComplete={() => console.log("Изображение сохранено!")}
              onError={(error) => console.error(error)}
            />
            <Button 
              size="l" 
              className="action-button"
              disabled={!selectedMeme}
            >
              Поделиться
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}