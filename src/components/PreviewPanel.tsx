import React, { useState } from 'react';
import { CompletionAnimation } from './CompletionAnimation';

interface PreviewPanelProps {
  htmlContent: string;
  completedPreviews: string[];
  completedLesson?: { code: string; preview: string } | null;
  onAnimationComplete?: () => void;
  isEditorMode?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlContent,
  completedPreviews,
  completedLesson,
  onAnimationComplete,
  isEditorMode = false
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-3xl border border-pink-medium/20 shadow-panel overflow-hidden">
      {/* Editor Mode Toolbar */}
      {isEditorMode && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium transition-all duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {isCopied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
      )}

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-glow opacity-30 -z-10" />
      
      {/* Completed previews - only show in lesson mode */}
      {!isEditorMode && (
        <div className="p-6 text-muted-foreground overflow-y-auto custom-scrollbar max-h-32 markdown-preview-completed">
          {completedPreviews.map((preview, index) => (
            <div 
              key={index} 
              className="mb-4 opacity-50 markdown-preview" 
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          ))}
        </div>
      )}

      {/* Current preview */}
      <div className="p-6 flex-grow overflow-y-auto custom-scrollbar markdown-preview relative min-h-[400px]">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {/* Completion Animation */}
        {completedLesson && (
          <CompletionAnimation
            text={completedLesson.code}
            htmlContent={completedLesson.preview}
            onComplete={onAnimationComplete || (() => {})}
            isInput={false}
          />
        )}
      </div>
    </div>
  );
};