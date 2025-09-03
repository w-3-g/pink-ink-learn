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
  const [isAddingEmojis, setIsAddingEmojis] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(0);

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

  const loadLesson = useCallback((index: number) => {
    if (index < lessonPool.length) {
      setCurrentLesson(lessonPool[index]);
    } else {
      // All lessons are completed
      setCurrentLesson({
        instruction: "You've completed all lessons! Feel free to use the editor.",
        code: "🎉"
      });
    }
    setUserInput('');
  }, []);

  const completeLesson = useCallback(() => {
    if (!currentLesson) return;

    const completedCode = currentLesson.code;
    const completedPreview = parseMarkdown(completedCode);

    setCompletedLessons(prev => [completedCode, ...prev]);
    setCompletedPreviews(prev => [completedPreview, ...prev]);

    setTimeout(() => {
      setLessonIndex(prev => prev + 1);
    }, 400);
  }, [currentLesson, parseMarkdown]);

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

  // Load lesson when lessonIndex changes
  useEffect(() => {
    if (!isEditorMode) {
      loadLesson(lessonIndex);
    }
  }, [lessonIndex, isEditorMode, loadLesson]);

  const currentPreview = parseMarkdown(userInput);

  const toggleEditorMode = useCallback(() => {
    const newIsEditorMode = !isEditorMode;
    setIsEditorMode(newIsEditorMode);

    if (newIsEditorMode) {
      // Switching to editor mode
      setUserInput('');
    } else {
      // Switching back to lesson mode
      setLessonIndex(0); // Reset to the first lesson
    }
  }, [isEditorMode]);

  const clearUserInput = useCallback(() => {
    setUserInput('');
  }, []);

  const skipLesson = useCallback(() => {
    setLessonIndex(prev => prev + 1);
  }, []);

  const showSolution = useCallback(() => {
    if (currentLesson) {
      setUserInput(currentLesson.code);
    }
  }, [currentLesson]);

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

  const addEmojis = useCallback(async () => {
    if (!userInput) return;

    setIsAddingEmojis(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
      // First, try the private server
      const response = await fetch('http://123.123.123.26:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: 'system', content: 'You are an expert in using emojis. Your task is to take the user\'s text and add relevant emojis to it. Do not add too many emojis. Just add a few where they make sense. Only return the modified text, without any other comments or explanations. Do not wrap the response in quotes.' },
            { role: 'user', content: userInput }
          ],
          temperature: 0.7,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Private server failed, trying OpenRouter...');
      }

      const data = await response.json();
      const enhancedText = data.choices[0].message.content.trim();
      setUserInput(enhancedText);

    } catch (error) {
      clearTimeout(timeoutId);
      console.error(error);
      // If private server fails, fallback to OpenRouter
      try {
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lovable.dev/projects/05c44b27-96d7-4a2a-bf49-15a14be85d46',
            'X-Title': 'Markdown Playground'
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b:free",
            messages: [
              { role: 'system', content: 'You are an expert in using emojis. Your task is to take the user\'s text and add relevant emojis to it. Do not add too many emojis. Just add a few where they make sense. Only return the modified text, without any other comments or explanations. Do not wrap the response in quotes.' },
              { role: 'user', content: userInput }
            ],
          })
        });

        if (!openRouterResponse.ok) {
          const errorText = await openRouterResponse.text();
          console.error('OpenRouter API Error:', errorText);
          throw new Error(`OpenRouter API request failed with status: ${openRouterResponse.status}`);
        }

        const openRouterData = await openRouterResponse.json();
        const enhancedText = openRouterData.choices[0].message.content.trim();
        setUserInput(enhancedText);

      } catch (openRouterError) {
        console.error('Error with OpenRouter fallback:', openRouterError);
        console.error('Could not add emojis. Both primary and fallback services failed.');
      }
    } finally {
      setIsAddingEmojis(false);
    }
  }, [userInput]);

  return {
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
    clearUserInput,
    skipLesson,
    showSolution
  };
};