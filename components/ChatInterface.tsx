import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { Role } from '../types';
import { runChat } from '../services/geminiService';
import Message from './Message';
import Spinner from './Spinner';
import ImageUpload from './ImageUpload';
import { SendIcon } from './IconComponents';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: Role.BOT, text: "Hello! I'm GreenBot, your educational assistant. How can I help you learn today? You can ask me questions or even upload an image." }
  ]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (file: File | null, previewUrl: string | null) => {
    setImageFile(file);
    setImagePreviewUrl(previewUrl);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { 
      role: Role.USER, 
      text: input, 
      image: imagePreviewUrl ?? undefined 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // Reset image file after sending
    const currentImageFile = imageFile;
    setImageFile(null);
    setImagePreviewUrl(null);

    try {
      const botResponseText = await runChat(input, currentImageFile ?? undefined);
      const botMessage: ChatMessage = { role: Role.BOT, text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      const errorBotMessage: ChatMessage = { role: Role.BOT, text: `Sorry, something went wrong: ${errorMessage}` };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#ECFDF5]/50 dark:bg-gray-800/50">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Spinner className="w-5 h-5 text-[#10B981]"/>
              <span>GreenBot is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-green-200 dark:border-green-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto space-y-3">
          <ImageUpload onImageSelect={handleImageSelect} />
          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[#10B981] transition-shadow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask GreenBot anything..."
              className="flex-1 w-full px-4 py-2 bg-transparent focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#059669] hover:to-[#10B981] transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34D399] dark:focus:ring-offset-gray-800"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;