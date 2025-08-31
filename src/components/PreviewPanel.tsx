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
  return (
    <div className="relative bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-3xl border border-pink-medium/20 shadow-panel overflow-hidden">
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