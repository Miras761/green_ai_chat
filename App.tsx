import React, { useState } from 'react';
import type { AppMode } from './types';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import ThemeToggle from './components/ThemeToggle';
import { BotIcon, ImageIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');

  const headerStyles = "flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-b border-green-200 dark:border-green-800 shadow-sm";
  const navButtonBaseStyles = "px-4 py-2 rounded-md font-semibold transition-all duration-300 flex items-center gap-2";
  const navButtonActiveStyles = "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-md";
  const navButtonInactiveStyles = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/50 text-gray-800 dark:text-gray-200">
      <header className={headerStyles}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#10B981] dark:from-[#34D399] dark:to-[#A7F3D0]">
              GreenBot
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">by GreenGamesStudio</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setMode('chat')}
              className={`${navButtonBaseStyles} ${mode === 'chat' ? navButtonActiveStyles : navButtonInactiveStyles}`}
            >
              <BotIcon className="w-5 h-5" /> Chat
            </button>
            <button
              onClick={() => setMode('image_generator')}
              className={`${navButtonBaseStyles} ${mode === 'image_generator' ? navButtonActiveStyles : navButtonInactiveStyles}`}
            >
              <ImageIcon className="w-5 h-5" /> Generate
            </button>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {mode === 'chat' && <ChatInterface />}
        {mode === 'image_generator' && <ImageGenerator />}
      </main>
    </div>
  );
};

export default App;
