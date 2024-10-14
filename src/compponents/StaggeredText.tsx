import React, { useState, useEffect } from 'react';
import './StaggeredText.css';

interface ScrambleTextProps {
  text: string;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [scrambling, setScrambling] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string[]>(text.split(''));
  const originalText = text.split('');
  const [scrambledOnce, setScrambledOnce] = useState<boolean>(false); // Track if scrambled

  // Function to start scrambling characters
  const startScrambling = () => {
    if (scrambling || scrambledOnce) return; // Prevent starting again if already scrambling or scrambled once

    setScrambling(true);
    setScrambledOnce(true); // Mark as scrambled once

    const scrambleInterval = setInterval(() => {
      setDisplayText((prevText) =>
        prevText.map((char) =>
          Math.random() > 0.5 ? String.fromCharCode(Math.random() * 26 + 65) : char
        )
      );
    }, 100);

    // Stop scrambling after a certain duration and reset the display text
    setTimeout(() => {
      clearInterval(scrambleInterval);
      setDisplayText(originalText); // Reset to the original text
      setScrambling(false); // Reset scrambling state after done
    }, 3000); // Example: stop scrambling after 3 seconds

    return () => clearInterval(scrambleInterval); // Clear the interval
  };

  useEffect(() => {
    if (hovered) {
      startScrambling();
    } else {
      setScrambling(false);
      setDisplayText(originalText);
    }
  }, [hovered, originalText]);

  const handleMouseMove = () => {
    // If mouse moves, stop the scrambling
    if (scrambling) {
      setScrambling(false);
      setDisplayText(originalText); // Reset to the original text
    }
  };

  return (
    <div
      className={`scramble-container ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setDisplayText(originalText); // Reset to the original text when hover ends
      }}
      onMouseMove={handleMouseMove} // Add mouse move listener
    >
      {displayText.map((char, index) => (
        <span className={`text-item ${scrambling ? 'scrambling' : ''}`} key={index}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default ScrambleText;