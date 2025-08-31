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
  isEditorMode?: boolean;
  onDownload?: () => void;
  onAddEmojis?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  currentLesson,
  userInput,
  onInputChange,
  completedLessons,
  onLessonComplete,
  isEditorMode = false,
  onDownload,
  onAddEmojis
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
      
      {/* Completed lessons - only show in lesson mode */}
      {!isEditorMode && (
        <div className="p-6 text-muted-foreground overflow-y-auto custom-scrollbar max-h-32">
          {completedLessons.map((lesson, index) => (
            <pre key={index} className="mb-4 whitespace-pre-wrap opacity-50 font-manrope text-base">
              {lesson}
            </pre>
          ))}
        </div>
      )}

      {/* Current lesson and input area */}
      <div className="flex-grow flex flex-col p-6 pt-0 relative min-h-[400px]">
        {/* Editor Mode Toolbar */}
        {isEditorMode && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium transition-all duration-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            <button
              onClick={onAddEmojis}
              className="flex items-center gap-2 px-3 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-lg text-accent font-medium transition-all duration-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              ✨ Add Emojis
            </button>
          </div>
        )}

        {/* Lesson instructions - only show in lesson mode */}
        {!isEditorMode && currentLesson && (
          <>
            <p className="mb-2 text-primary animate-fade-in-slide-up font-manrope font-medium text-base">
              {currentLesson.instruction}
            </p>
            <code className="text-foreground bg-primary/10 px-3 py-1.5 rounded-lg mb-4 inline-block animate-fade-in-slide-up animate-pulse-glow self-start font-manrope text-base">
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
          className="w-full flex-grow bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-xl leading-relaxed tracking-wide font-manrope ghost-text-effect"
          placeholder={isEditorMode 
            ? "Write your markdown here... ✨" 
            : currentLesson?.code.includes('\n') 
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