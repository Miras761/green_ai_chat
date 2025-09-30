import React from 'react';
import { ChatMessage, Role } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.role === Role.BOT;

  const wrapperClasses = `flex items-start gap-3 my-4 ${isBot ? '' : 'flex-row-reverse'}`;
  const avatarClasses = `w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isBot ? 'bg-gradient-to-br from-[#10B981] to-[#059669] text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`;
  const messageBoxClasses = `max-w-xl p-4 rounded-lg shadow-md ${isBot ? 'bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700' : 'bg-[#D1FAE5] dark:bg-green-900/50 text-[#065F46] dark:text-[#A7F3D0]'}`;

  // Basic markdown-like text formatting for code blocks
  const formattedText = message.text.split('```').map((part, index) => {
    if (index % 2 === 1) {
      // This is a code block
      const language = part.split('\n')[0];
      const code = part.substring(language.length + 1);
      return (
        <div key={index} className="bg-gray-100 dark:bg-black/50 rounded-md my-2">
            <div className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-t-md">{language || 'code'}</div>
            <pre className="p-3 text-sm whitespace-pre-wrap overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
      );
    }
    return <span key={index}>{part}</span>;
  });

  return (
    <div className={wrapperClasses}>
      <div className={avatarClasses}>
        {isBot ? <BotIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" /> }
      </div>
      <div className={messageBoxClasses}>
        {message.image && (
          <div className="mb-2">
            <img src={message.image} alt="Attached content" className="rounded-lg max-w-xs mx-auto shadow-lg" />
          </div>
        )}
        <div className="prose prose-sm dark:prose-invert max-w-none text-left">
          {formattedText}
        </div>
      </div>
    </div>
  );
};

export default Message;