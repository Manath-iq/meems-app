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

  const handleMouseStart = (e, type) => {
    e.stopPropagation();
    startPosRef.current = { x: e.clientX, y: e.clientY };
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
      startAngleRef.current = calculateAngle(center, { x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging && !isResizing) return;
      e.preventDefault();
      
      if (isDragging) {
        const newX = position.x + (e.clientX - startPosRef.current.x);
        const newY = position.y + (e.clientY - startPosRef.current.y);
        onPositionChange({ x: newX, y: newY });
        startPosRef.current = { x: e.clientX, y: e.clientY };
      }
      
      if (isResizing) {
        const rect = containerRef.current.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        
        const currentAngle = calculateAngle(center, { x: e.clientX, y: e.clientY });
        const angleDiff = currentAngle - startAngleRef.current;
        setRotation(prev => prev + angleDiff);
        startAngleRef.current = currentAngle;

        const distance = Math.hypot(
          e.clientX - center.x,
          e.clientY - center.y
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

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
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
          onTouchStart={(e) => handleMouseStart(e, 'move')}
          onMouseDown={(e) => handleMouseStart(e, 'move')}
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
              onTouchStart={(e) => handleMouseStart(e, 'resize')}
              onMouseDown={(e) => handleMouseStart(e, 'resize')}
            />
            <div 
              className="resize-handle right"
              onTouchStart={(e) => handleMouseStart(e, 'resize')}
              onMouseDown={(e) => handleMouseStart(e, 'resize')}
            />
          </>
        )}
      </div>
    </div>
  );
}