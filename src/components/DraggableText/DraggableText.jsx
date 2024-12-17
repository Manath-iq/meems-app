import { useState, useRef, useEffect } from 'react';
import './DraggableText.css';

export function DraggableText({ text, color, position, isSelected, onClick, onPositionChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startAngleRef = useRef(0);
  const startScaleRef = useRef(1);

  const calculateAngle = (center, point) => {
    return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
  };

  const handleTouchStart = (e, type) => {
    e.stopPropagation();
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    startScaleRef.current = scale;

    if (type === 'move') {
      setIsDragging(true);
    } else if (type === 'resize') {
      setIsResizing(true);
      const rect = containerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      startAngleRef.current = calculateAngle(center, { x: touch.clientX, y: touch.clientY });
    }
  };

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDragging && !isResizing) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      
      if (isDragging) {
        const newX = position.x + (touch.clientX - startPosRef.current.x);
        const newY = position.y + (touch.clientY - startPosRef.current.y);
        onPositionChange({ x: newX, y: newY });
        startPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
      
      if (isResizing) {
        const rect = containerRef.current.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        
        const currentAngle = calculateAngle(center, { x: touch.clientX, y: touch.clientY });
        const angleDiff = currentAngle - startAngleRef.current;
        setRotation(prev => prev + angleDiff);
        startAngleRef.current = currentAngle;

        const distance = Math.hypot(
          touch.clientX - center.x,
          touch.clientY - center.y
        );
        const initialDistance = Math.hypot(
          startPosRef.current.x - center.x,
          startPosRef.current.y - center.y
        );
        const scaleFactor = distance / initialDistance;
        const newScale = Math.max(0.5, Math.min(3, startScaleRef.current * scaleFactor));
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isResizing, position, onPositionChange]);

  return (
    <div
      ref={containerRef}
      className={`draggable-text-container ${isSelected ? 'selected' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div 
        className="text-box-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center'
        }}
      >
        <div 
          className="text-box" 
          onTouchStart={(e) => handleTouchStart(e, 'move')}
        >
          <div 
            ref={textRef}
            className="text-content"
            style={{ color }}
          >
            {text}
          </div>
        </div>
        {isSelected && (
          <>
            <div 
              className="resize-handle left"
              onTouchStart={(e) => handleTouchStart(e, 'resize')}
            />
            <div 
              className="resize-handle right"
              onTouchStart={(e) => handleTouchStart(e, 'resize')}
            />
          </>
        )}
      </div>
    </div>
  );
}