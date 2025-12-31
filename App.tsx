import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { sendMessageToVBOT, resetChatSession } from './services/VBOTSERVICES';
import { ChatMessage } from './components/ChatMessage';
import { Send, Trash2, Cpu, Zap, Menu, X, Youtube } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am V-BOT. Created, owned, and trained by Vihaan. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToVBOT(userText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error connecting to my neural core. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    resetChatSession();
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "Chat memory cleared. I am ready for a new topic. (Still owned by Vihaan!)",
      timestamp: new Date(),
    }]);
    setIsSidebarOpen(false);
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 w-72 h-full bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
            <Cpu size={24} />
            <span>V-BOT</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Identity</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              I am an AI assistant created, trained, and owned by <span className="text-indigo-400 font-bold">Vihaan</span>.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-red-900/20 to-slate-800 rounded-lg p-4 border border-red-900/30">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Youtube size={14} /> Supported Channel
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-2">
              Check out Vihaan's tech channel for more content.
            </p>
            <a 
              href="https://youtube.com/@VihaanTech21" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded-full inline-block transition-colors"
            >
              @VihaanTech21
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleClearChat}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <Trash2 size={18} />
            <span>Clear Memory</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                V-BOT <span className="text-xs font-normal text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-400/10 border border-indigo-400/20">v1.0</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Model trained by Vihaan</p>
            </div>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex w-full mb-6 justify-start">
              <div className="flex max-w-[85%] flex-row gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg animate-pulse">
                  <Zap size={18} className="text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-slate-800">
          <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all shadow-xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={adjustTextareaHeight}
              onKeyDown={handleKeyDown}
              placeholder="Message V-BOT..."
              className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-base p-3 resize-none focus:outline-none max-h-32 min-h-[48px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-lg mb-0.5 transition-all duration-200 flex-shrink-0 ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-3">
            V-BOT can make mistakes. Created & Owned by Vihaan.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;