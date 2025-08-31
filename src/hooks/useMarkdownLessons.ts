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

  const handleInputChange = useCallback((value: string) => {
    setUserInput(value);
    
    // Check if lesson is completed
    if (currentLesson && value.trim() === currentLesson.code.trim()) {
      completeLesson();
    }
  }, [currentLesson, completeLesson]);

  // Initialize with first lesson
  useEffect(() => {
    if (!currentLesson) {
      loadNextRandomLesson();
    }
  }, [currentLesson, loadNextRandomLesson]);

  const currentPreview = parseMarkdown(userInput);

  return {
    currentLesson,
    userInput,
    currentPreview,
    completedLessons,
    completedPreviews,
    handleInputChange,
    loadNextRandomLesson
  };
};