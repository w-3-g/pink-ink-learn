import React, { useState } from 'react';
import { ParticleBackground } from './ParticleBackground';
import { InputPanel } from './InputPanel';
import { PreviewPanel } from './PreviewPanel';
import { useMarkdownLessons } from '../hooks/useMarkdownLessons';

export const MarkdownPlayground: React.FC = () => {
  const {
    currentLesson,
    userInput,
    currentPreview,
    completedLessons,
    completedPreviews,
    isEditorMode,
    isAddingEmojis,
    handleInputChange,
    toggleEditorMode,
    downloadMarkdown,
    addEmojis,
    clearUserInput
  } = useMarkdownLessons();

  const [completingLesson, setCompletingLesson] = useState<{ code: string; preview: string } | null>(null);

  const handleLessonComplete = (lesson: { instruction: string; code: string }) => {
    // Show completion animation on preview panel
    setCompletingLesson({
      code: lesson.code,
      preview: currentPreview
    });
  };

  const handlePreviewAnimationComplete = () => {
    setCompletingLesson(null);
  };

  return (
    <div className="min-h-screen font-manrope bg-gradient-bg overflow-hidden">
      <ParticleBackground />
      
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen relative z-10">
        {/* Header with Mode Toggle */}
        <header className="text-center mb-6 relative w-full max-w-7xl">
          <h1 
            className="font-bold text-foreground tracking-wider bg-gradient-primary bg-clip-text text-transparent"
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              textShadow: '0 0 20px hsl(var(--pink-light) / 0.3)'
            }}
          >
            Markdown Playground
          </h1>
          
          {/* Mode Toggle Button */}
          <button
            onClick={toggleEditorMode}
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-pink-medium/20 rounded-2xl text-foreground font-medium hover:bg-card hover:border-pink-medium/40 transition-all duration-300 shadow-elegant"
          >
            {isEditorMode ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Lessons
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editor
              </>
            )}
          </button>
        </header>

        {/* Main Content */}
        <main className="w-full h-[75vh] max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6">
          {/* Left Panel: Input */}
          <InputPanel
            currentLesson={currentLesson}
            userInput={userInput}
            onInputChange={handleInputChange}
            completedLessons={completedLessons}
            onLessonComplete={handleLessonComplete}
            isEditorMode={isEditorMode}
            onDownload={downloadMarkdown}
            onAddEmojis={addEmojis}
            isAddingEmojis={isAddingEmojis}
            onClear={clearUserInput}
          />

          {/* Right Panel: Preview */}
          <PreviewPanel
            htmlContent={currentPreview}
            completedPreviews={completedPreviews}
            completedLesson={completingLesson}
            onAnimationComplete={handlePreviewAnimationComplete}
            isEditorMode={isEditorMode}
          />
        </main>
      </div>
    </div>
  );
};