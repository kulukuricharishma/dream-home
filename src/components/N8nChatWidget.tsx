import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const CHAT_WEBHOOK_URL = 'https://charishma1.app.n8n.cloud/webhook/c780d1aa-18e1-4ab0-8ed3-42cdf30b2a81/chat';

export const N8nChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hi there! 👋 I am your DreamHome AI Design Assistant. Ask me anything about furniture styling, room layouts, or color choices!',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [sessionId] = useState<string>(() => {
    // Generate or retrieve persistent chat session ID
    const stored = localStorage.getItem('dreamhome_n8n_session_id');
    if (stored) return stored;
    const fresh = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('dreamhome_n8n_session_id', fresh);
    return fresh;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Standard n8n chat payload structure supporting both Chat Trigger node and Webhook node
      const payload = {
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: trimmed,
        message: trimmed,
        input: trimmed,
        prompt: trimmed,
        context: {
          app: 'DreamHome',
          page: window.location.pathname,
        },
      };

      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      let botReplyText = '';

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Support all common n8n AI Chat Trigger / Agent response formats:
        if (typeof data === 'string') {
          botReplyText = data;
        } else if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          botReplyText =
            first.output ||
            first.text ||
            first.message ||
            first.reply ||
            first.response ||
            (typeof first === 'string' ? first : JSON.stringify(first));
        } else if (typeof data === 'object' && data !== null) {
          botReplyText =
            data.output ||
            data.text ||
            data.message ||
            data.reply ||
            data.response ||
            data.content ||
            (data.data && typeof data.data === 'string' ? data.data : '') ||
            (data.data && data.data.output ? data.data.output : '') ||
            JSON.stringify(data);
        }
      } else {
        botReplyText = await response.text();
      }

      if (!botReplyText || botReplyText.trim() === '') {
        botReplyText = "I received your message, but didn't get a response. How can I assist you with your room design?";
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.warn('n8n Chat webhook error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg_bot_err_${Date.now()}`,
        sender: 'bot',
        text: "I'm having a brief connection issue with the design assistant. Feel free to ask another question or explore our design collections!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Chat history cleared. How can I help you design your space today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group flex items-center gap-2.5 border border-stone-700/60"
          aria-label="Open DreamHome AI Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-stone-900 animate-pulse" />
            )}
          </div>
          <span className="hidden sm:inline font-semibold text-xs tracking-wide pr-1">Chat with AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded
              ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[480px] h-[calc(100vh-80px)] sm:h-[620px]'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[520px]'
          }`}
        >
          {/* Header */}
          <div className="bg-stone-900 text-stone-100 p-3.5 px-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm tracking-wide text-white">DreamHome AI</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">Powered by n8n assistant</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Restart Chat"
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition hidden sm:inline-flex"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="bg-[#FAF8F5] border-b border-stone-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-[10px] font-semibold text-stone-600 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Suggest:
            </span>
            <button
              type="button"
              onClick={() => {
                setInputMessage('What wall color goes well with light oak wooden floors?');
              }}
              className="bg-white hover:bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 shrink-0 transition"
            >
              Wall colors
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMessage('Help me style a cozy minimalist living room');
              }}
              className="bg-white hover:bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 shrink-0 transition"
            >
              Cozy living room
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMessage('How should I choose between warm and cool lighting?');
              }}
              className="bg-white hover:bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 shrink-0 transition"
            >
              Lighting tips
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-[#FBF9F6]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isUser
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-stone-900 text-amber-400'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words shadow-xs ${
                      isUser
                        ? 'bg-stone-900 text-stone-100 rounded-tr-xs'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] mt-1 block ${
                        isUser ? 'text-stone-400 text-right' : 'text-stone-600'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing / Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-white text-stone-600 border border-stone-200 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Consulting interior design model...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-stone-200/90 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about room styling, colors, furniture..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition placeholder:text-stone-400"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 text-stone-100 rounded-xl transition shadow-xs flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
