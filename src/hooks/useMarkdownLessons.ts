import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Lesson {
  instruction: string;
  code: string;
}

const lessonPool: Lesson[] = [
  { instruction: "Let's start with a level 1 heading:", code: "# Hello Markdown!" },
  { instruction: "Now, a level 2 heading:", code: "## This is a subheading" },
  { instruction: "Emphasize text with **bold**:", code: "**This is bold text!**" },
  { instruction: "Or with *italics*:", code: "*This text is italicized.*" },
  { instruction: "You can also ***combine them***:", code: "***This is important!***" },
  { instruction: "Create a blockquote for citations:", code: "> To be, or not to be..." },
  { instruction: "Time for an unordered list:", code: "- First item\n- Second item" },
  { instruction: "And an ordered list:", code: "1. Wake up\n2. Write Markdown" },
  { instruction: "Create a link to your favorite site:", code: "[Visit Awesome Site](https://example.com)" },
  { instruction: "Use inline `code` for commands:", code: "To install, run `npm install`." },
  { instruction: "Show off with a code block:", code: "```javascript\nconsole.log('Hello, World!');\n```" },
  { instruction: "Create a task list:", code: "- [x] Master Markdown\n- [ ] Conquer the world" },
  { instruction: "Add emphasis with strikethrough:", code: "~~This is crossed out~~" },
  { instruction: "Create a horizontal rule:", code: "---" },
  { instruction: "Make a fancy table:", code: "| Name | Age |\n|------|-----|\n| Alex | 25 |" },
  { instruction: "Quote someone famous:", code: "> \"The only way to do great work is to love what you do.\" - Steve Jobs" },
  { instruction: "Show some inline code:", code: "Use the `git commit` command to save changes." },
  { instruction: "Create nested lists:", code: "1. First level\n   - Second level\n   - Another second level" }
];

export const useMarkdownLessons = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [userInput, setUserInput] = useState('');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedPreviews, setCompletedPreviews] = useState<string[]>([]);
  const [isEditorMode, setIsEditorMode] = useState(false);

  const parseMarkdown = useCallback((markdown: string): string => {
    try {
      const rawHtml = marked(markdown, { 
        gfm: true, 
        breaks: true
      }) as string;
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '';
    }
  }, []);

  const loadNextRandomLesson = useCallback(() => {
    let nextLesson: Lesson;
    do {
      nextLesson = lessonPool[Math.floor(Math.random() * lessonPool.length)];
    } while (lessonPool.length > 1 && nextLesson === currentLesson);
    
    setCurrentLesson(nextLesson);
    setUserInput('');
  }, [currentLesson]);

  const completeLesson = useCallback(() => {
    if (!currentLesson) return;

    const completedCode = currentLesson.code;
    const completedPreview = parseMarkdown(completedCode);

    // Add completed lesson to the lists (prepend for reverse chronological order)
    setCompletedLessons(prev => [completedCode, ...prev]);
    setCompletedPreviews(prev => [completedPreview, ...prev]);

    // Load next lesson after a brief delay for animation
    setTimeout(() => {
      loadNextRandomLesson();
    }, 400);
  }, [currentLesson, parseMarkdown, loadNextRandomLesson]);

  // Normalize text for comparison (handles multiline content)
  const normalizeText = useCallback((text: string) => {
    return text
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove trailing spaces from each line
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      // Remove leading/trailing whitespace
      .trim();
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setUserInput(value);
    
    // Check if lesson is completed (only in lesson mode)
    if (!isEditorMode && currentLesson && normalizeText(value) === normalizeText(currentLesson.code)) {
      completeLesson();
    }
  }, [currentLesson, completeLesson, isEditorMode, normalizeText]);

  // Initialize with first lesson
  useEffect(() => {
    if (!currentLesson) {
      loadNextRandomLesson();
    }
  }, [currentLesson, loadNextRandomLesson]);

  const currentPreview = parseMarkdown(userInput);

  const toggleEditorMode = useCallback(() => {
    setIsEditorMode(prev => !prev);
    if (!isEditorMode) {
      // Switching to editor mode - clear lesson state
      setCurrentLesson(null);
      setUserInput('');
    } else {
      // Switching back to lesson mode - load a lesson
      loadNextRandomLesson();
    }
  }, [isEditorMode, loadNextRandomLesson]);

  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([userInput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userInput]);

  const addEmojis = useCallback(() => {
    // Simple AI-like emoji insertion logic
    const emojiMap: Record<string, string> = {
      'hello': '👋',
      'world': '🌍',
      'code': '💻',
      'javascript': '⚡',
      'markdown': '📝',
      'table': '📊',
      'list': '📋',
      'important': '⭐',
      'link': '🔗',
      'quote': '💬',
      'task': '✅',
      'work': '💼',
      'great': '🎉',
      'awesome': '🚀',
      'creative': '🎨',
      'fun': '🎯',
      'modern': '✨',
      'exciting': '🔥'
    };

    let enhancedText = userInput;
    Object.entries(emojiMap).forEach(([word, emoji]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      enhancedText = enhancedText.replace(regex, `$& ${emoji}`);
    });

    setUserInput(enhancedText);
  }, [userInput]);

  return {
    currentLesson,
    userInput,
    currentPreview,
    completedLessons,
    completedPreviews,
    isEditorMode,
    handleInputChange,
    loadNextRandomLesson,
    toggleEditorMode,
    downloadMarkdown,
    addEmojis
  };
};