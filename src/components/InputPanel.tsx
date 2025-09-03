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
  isAddingEmojis?: boolean;
  onClear?: () => void;
  onSkip?: () => void;
  onShowSolution?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  currentLesson,
  userInput,
  onInputChange,
  completedLessons,
  onLessonComplete,
  isEditorMode = false,
  onDownload,
  onAddEmojis,
  isAddingEmojis = false,
  onClear,
  onSkip,
  onShowSolution
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
    <div className="relative flex flex-col bg-card/80 backdrop-blur-sm rounded-3xl border border-pink-medium/20 shadow-panel overflow-hidden">
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-glow opacity-30 -z-10" />
      
      {/* Completed lessons - only show in lesson mode */}
      {!isEditorMode && (
        <div className="flex-shrink-0 p-6 text-muted-foreground overflow-y-auto custom-scrollbar max-h-40">
          {completedLessons.map((lesson, index) => (
            <pre key={index} className="mb-4 whitespace-pre-wrap opacity-50 font-manrope text-base">
              {lesson}
            </pre>
          ))}
        </div>
      )}

      {/* Current lesson and input area */}
      <div className="flex-grow flex flex-col p-6 pt-0 relative min-h-0">
        {/* Editor Mode Toolbar */}
        {isEditorMode && (
          <div className="flex gap-2 mb-4 mt-6">
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
              disabled={isAddingEmojis}
              className="flex items-center gap-2 px-3 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-lg text-accent font-medium transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingEmojis ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  ✨ Add Emojis
                </>
              )}
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 rounded-lg text-destructive font-medium transition-all duration-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        )}

        {/* Lesson instructions - only show in lesson mode */}
        {!isEditorMode && currentLesson && (
          <div className="mb-4">
            <p className="mb-2 text-primary animate-fade-in-slide-up font-manrope font-medium text-base">
              {currentLesson.instruction}
            </p>
            <div className="flex items-center gap-4">
              <code className="text-foreground bg-primary/10 px-3 py-1.5 rounded-lg inline-block animate-fade-in-slide-up animate-pulse-glow self-start font-manrope text-base">
                {currentLesson.code}
              </code>
              <div className="flex gap-2">
                <button onClick={onShowSolution} className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors">Show Solution</button>
                <button onClick={onSkip} className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors">Skip</button>
              </div>
            </div>
          </div>
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