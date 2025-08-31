import React, { useEffect, useState } from 'react';

interface CompletionAnimationProps {
  text: string;
  htmlContent: string;
  onComplete: () => void;
  isInput?: boolean;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  text,
  htmlContent,
  onComplete,
  isInput = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const randomRoll = (Math.random() - 0.5) * 4; // -2 to 2 degrees

  useEffect(() => {
    // Start fade out after a brief moment
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 380); // Match animation duration
    }, 50);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`absolute z-10 bottom-0 left-6 right-6 p-2 rounded-lg transition-all duration-400 ease-out ${
        isInput 
          ? 'bg-black/90 text-muted-foreground' 
          : 'bg-secondary/90 text-muted-foreground'
      } ${isVisible ? 'opacity-100' : 'opacity-0 -translate-y-32'}`}
      style={{
        transform: isVisible 
          ? 'translateY(0) rotate(0)' 
          : `translateY(-120%) rotate(${randomRoll}deg)`,
        transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {isInput ? (
        <pre className="whitespace-pre-wrap text-sm font-manrope">{text}</pre>
      ) : (
        <div 
          className="text-sm markdown-preview" 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      )}
    </div>
  );
};