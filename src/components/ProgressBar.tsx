import React from 'react';

export const ProgressBar: React.FC = () => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20" aria-label="Loading progress">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-4 h-2 bg-green-400/80 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse-glow"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
};