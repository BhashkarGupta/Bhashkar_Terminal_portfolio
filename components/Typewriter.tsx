
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
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let charIndex = 0;

    const startTyping = () => {
      setHasStarted(true);
      intervalId = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(prev => prev + text.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(intervalId);
          if (onComplete) onComplete();
        }
      }, speed);
    };

    if (startDelay > 0) {
      timeoutId = setTimeout(startTyping, startDelay);
    } else {
      startTyping();
    }

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay, onComplete]);

  // Reset if text changes significantly
  useEffect(() => {
      setDisplayedText('');
      setHasStarted(false);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && <span className="animate-cursor-blink ml-1 inline-block w-2 h-4 bg-current align-middle"></span>}
    </span>
  );
};
