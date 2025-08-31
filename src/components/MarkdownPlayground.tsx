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
    handleInputChange
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
        {/* Header */}
        <header className="text-center mb-6">
          <h1 
            className="font-bold text-foreground tracking-wider bg-gradient-primary bg-clip-text text-transparent"
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              textShadow: '0 0 20px hsl(var(--pink-light) / 0.3)'
            }}
          >
            Markdown Playground
          </h1>
        </header>

        {/* Main Content */}
        <main className="w-full h-[75vh] max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Input */}
          <InputPanel
            currentLesson={currentLesson}
            userInput={userInput}
            onInputChange={handleInputChange}
            completedLessons={completedLessons}
            onLessonComplete={handleLessonComplete}
          />

          {/* Right Panel: Preview */}
          <PreviewPanel
            htmlContent={currentPreview}
            completedPreviews={completedPreviews}
            completedLesson={completingLesson}
            onAnimationComplete={handlePreviewAnimationComplete}
          />
        </main>
      </div>
    </div>
  );
};