import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Minimize2, Maximize2, Loader2, Sparkles, RefreshCw, AlertCircle, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

const WEBHOOK_URL = 'https://charishma1.app.n8n.cloud/webhook/6a2982f3-8f86-41e1-9ff4-2f1d1f2381e0/chat';

export const N8nChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: 'Hello! 👋 I am your DreamHome AI Assistant. How can I help you customize or style your space today?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() => {
    const stored = localStorage.getItem('dreamhome_n8n_session_id_v2');
    if (stored) return stored;
    const fresh = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('dreamhome_n8n_session_id_v2', fresh);
    return fresh;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: text,
        message: text,
        input: text,
        prompt: text,
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      let botReplyText = '';

      if (response.status === 404) {
        botReplyText =
          "⚠️ **Your n8n workflow is currently inactive.**\n\n" +
          "To allow messages through:\n" +
          "1. Open your workflow in **charishma1.app.n8n.cloud**\n" +
          "2. In the top-right corner, switch the toggle from **Inactive** to **Active**\n" +
          "3. Save the workflow and try sending your message again!";
        
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_bot_${Date.now()}`,
            sender: 'bot',
            text: botReplyText,
            timestamp: new Date(),
            isError: true,
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned status HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
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
        botReplyText = "I received your message, but didn't receive text back from the agent.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_bot_${Date.now()}`,
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown connection error';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Connection notice (${errorMsg}). Please ensure your n8n workflow is active and allows requests.`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Conversation restarted. How can I help you design your space today?',
        timestamp: new Date(),
      },
    ]);
  };

  const suggestions = [
    'Tips for modern minimalist living room',
    'Best wall color for a warm cozy bedroom',
    'How to choose the right lighting',
  ];

  return (
    <>
      {/* Floating launcher button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat Assistant"
            className="flex items-center gap-3 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-105 border border-stone-700/80 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-900 animate-pulse" />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold tracking-tight">AI Assistant</div>
              <div className="text-[10px] text-amber-300 font-medium">n8n Connected</div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#FAF8F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 md:inset-16 w-auto h-auto'
              : 'bottom-5 right-5 w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-100 leading-tight">
                  DreamHome AI Assistant
                </h3>
                <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  n8n Cloud
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      {msg.isError ? (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? msg.isError
                          ? 'bg-amber-50 text-stone-800 border border-amber-300 rounded-tl-sm'
                          : 'bg-white text-stone-800 border border-stone-200 shadow-xs rounded-tl-sm'
                        : 'bg-stone-900 text-stone-100 rounded-tr-sm shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center justify-start">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-stone-600 animate-spin" />
                  <span className="text-xs text-stone-500">n8n is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt suggestions */}
          {messages.length <= 2 && (
            <div className="px-3.5 py-2 bg-stone-100/70 border-t border-stone-200 flex flex-wrap gap-1.5">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  disabled={isLoading}
                  className="text-[11px] bg-white hover:bg-stone-200/80 text-stone-700 px-2.5 py-1 rounded-full border border-stone-300/80 transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about room design, colors, lighting..."
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-stone-900 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
              className="p-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
