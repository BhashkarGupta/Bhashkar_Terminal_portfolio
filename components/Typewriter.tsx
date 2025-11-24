
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 30, 
  startDelay = 0, 
  showCursor = true,
  onComplete,
  className = "" 
}) => {
  const [currentLength, setCurrentLength] = useState(0);

  useEffect(() => {
    // Reset state when text changes
    setCurrentLength(0);

    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const run = () => {
      intervalId = setInterval(() => {
        setCurrentLength(prev => {
          if (prev < text.length) {
            return prev + 1;
          }
          clearInterval(intervalId);
          return prev;
        });
      }, speed);
    };

    if (startDelay > 0) {
      timeoutId = setTimeout(run, startDelay);
    } else {
      run();
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  // Handle completion side-effect separately to keep render logic pure
  useEffect(() => {
    if (currentLength === text.length && text.length > 0 && onComplete) {
       onComplete();
    }
  }, [currentLength, text.length, onComplete]);

  return (
    <span className={className}>
      {text.slice(0, currentLength)}
      {showCursor && <span className="animate-cursor-blink ml-1 inline-block w-2 h-4 bg-current align-middle"></span>}
    </span>
  );
};
