import React, { useRef, useState } from 'react';
import { CompletionAnimation } from './CompletionAnimation';

interface Lesson {
  instruction: string;
  code: string;
}

interface InputPanelProps {
  currentLesson: Lesson | null;
  userInput: string;
  onInputChange: (value: string) => void;
  completedLessons: string[];
  onLessonComplete?: (lesson: Lesson) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  currentLesson,
  userInput,
  onInputChange,
  completedLessons,
  onLessonComplete
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showCompletion, setShowCompletion] = useState<Lesson | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onInputChange(value);
    
    // Check for lesson completion
    if (currentLesson && value.trim() === currentLesson.code.trim()) {
      setShowCompletion(currentLesson);
      onLessonComplete?.(currentLesson);
    }
  };

  const handleAnimationComplete = () => {
    setShowCompletion(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const ghostX = (x / rect.width) * 2;
    const ghostY = (y / rect.height) * 2;
    
    e.currentTarget.style.setProperty('--ghost-x', `${ghostX}px`);
    e.currentTarget.style.setProperty('--ghost-y', `${ghostY}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.setProperty('--ghost-x', '0px');
    e.currentTarget.style.setProperty('--ghost-y', '0px');
  };

  return (
    <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-pink-medium/20 shadow-panel overflow-hidden">
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-glow opacity-30 -z-10" />
      
      {/* Completed lessons */}
      <div className="p-6 text-muted-foreground overflow-y-auto custom-scrollbar max-h-32">
        {completedLessons.map((lesson, index) => (
          <pre key={index} className="mb-4 whitespace-pre-wrap opacity-50 font-manrope text-sm">
            {lesson}
          </pre>
        ))}
      </div>

      {/* Current lesson and input area */}
      <div className="flex-grow flex flex-col p-6 pt-0 relative min-h-[400px]">
        {currentLesson && (
          <>
            <p className="mb-2 text-primary animate-fade-in-slide-up font-manrope font-medium">
              {currentLesson.instruction}
            </p>
            <code className="text-foreground bg-primary/10 px-3 py-1.5 rounded-lg mb-4 inline-block animate-fade-in-slide-up animate-pulse-glow self-start font-manrope text-sm">
              {currentLesson.code}
            </code>
          </>
        )}

        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={handleInputChange}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full flex-grow bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-lg leading-relaxed tracking-wide font-manrope ghost-text-effect"
          placeholder={currentLesson?.code.includes('\n') 
            ? "Type the text above. Use Shift+Enter for new lines." 
            : "Start typing here..."}
          style={{
            textShadow: 'var(--ghost-x, 0) var(--ghost-y, 0) 5px hsl(var(--pink-light) / 0.2), calc(var(--ghost-x, 0) * -1) calc(var(--ghost-y, 0) * -1) 10px hsl(var(--foreground) / 0.1)',
            transition: 'text-shadow 0.2s ease-out'
          }}
        />

        {/* Completion Animation */}
        {showCompletion && (
          <CompletionAnimation
            text={showCompletion.code}
            htmlContent=""
            onComplete={handleAnimationComplete}
            isInput={true}
          />
        )}
      </div>
    </div>
  );
};