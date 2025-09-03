import React from 'react';

interface TextStatsProps {
  text: string;
}

export const TextStats: React.FC<TextStatsProps> = ({ text }) => {
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text === '' ? 0 : text.split('\n').length;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm py-2 px-4 rounded-full text-sm font-medium text-muted-foreground shadow-elegant z-20">
      <div className="flex items-center gap-x-4">
        <span>Characters: {charCount}</span>
        <span className="text-muted-foreground/50">|</span>
        <span>Words: {wordCount}</span>
        <span className="text-muted-foreground/50">|</span>
        <span>Lines: {lineCount}</span>
      </div>
    </div>
  );
};
