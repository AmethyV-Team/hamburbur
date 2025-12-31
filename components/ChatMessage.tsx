import React from 'react';
import { Message } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  // Function to parse bold text formatted as **text**
  const renderFormattedText = (text: string) => {
    // Split by **text** pattern
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        // Extract content between ** and **
        const content = part.slice(2, -2);
        return <strong key={index} className={isUser ? "font-bold text-white" : "font-bold text-indigo-400"}>{content}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-indigo-600 text-white' 
            : isError 
              ? 'bg-red-500 text-white' 
              : 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white'
        }`}>
          {isUser ? <User size={18} /> : isError ? <AlertCircle size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-md text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : isError
                ? 'bg-red-900/50 border border-red-800 text-red-200 rounded-tl-sm'
                : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-sm'
          }`}>
            {renderFormattedText(message.text)}
          </div>
          
          {/* Timestamp / Name */}
          <span className="text-xs text-slate-500 mt-1 px-1">
            {isUser ? 'You' : 'V-BOT'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};