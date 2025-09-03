import React, { useState } from 'react';
import { CompletionAnimation } from './CompletionAnimation';

interface PreviewPanelProps {
  htmlContent: string;
  markdownContent: string;
  completedPreviews: string[];
  completedLesson?: { code: string; preview: string } | null;
  onAnimationComplete?: () => void;
  onDownload?: () => void;
  isEditorMode?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlContent,
  markdownContent,
  completedPreviews,
  completedLesson,
  onAnimationComplete,
  onDownload,
  isEditorMode = false
}) => {
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [isMarkdownCopied, setIsMarkdownCopied] = useState(false);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      setIsHtmlCopied(true);
      setTimeout(() => setIsHtmlCopied(false), 2000);
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent).then(() => {
      setIsMarkdownCopied(true);
      setTimeout(() => setIsMarkdownCopied(false), 2000);
    });
  };

  return (
    <div className="relative bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-3xl border border-pink-medium/20 shadow-panel overflow-hidden">
      {/* Editor Mode Toolbar */}
      {isEditorMode && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium transition-all duration-300 text-sm"
          >
            {isMarkdownCopied ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium transition-all duration-300 text-sm"
          >
            {isHtmlCopied ? 'Copied!' : 'Copy HTML'}
          </button>
           <button
            onClick={onDownload}
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium transition-all duration-300 text-sm"
          >
            Download .md
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
      <div className="p-6 flex-grow overflow-y-auto hide-scrollbar markdown-preview relative min-h-[400px]">
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