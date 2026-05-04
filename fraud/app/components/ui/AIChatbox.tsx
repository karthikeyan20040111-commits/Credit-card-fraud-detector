'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am FraudGuard AI. How can I assist you with threat analysis today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = res.ok ? await res.json() : null;
      const aiText = data?.reply ?? "I'm analyzing data... please ensure the backend is running.";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "⚠️ Backend not reachable. Start the FastAPI server with `uvicorn main:app --reload`.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const mainBg = resolvedTheme === 'dark' ? '#1e293b' : '#ffffff';
  
  return (
    <>
      <div 
        className={`ai-chatbox-container ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Chat Window */}
        <div 
          className="chat-window shadow-xl glass"
          style={{
            width: '350px',
            height: '450px',
            backgroundColor: mainBg,
            borderRadius: '16px',
            marginBottom: '16px',
            overflow: 'hidden',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            border: '1px solid var(--color-border)',
            transition: 'all 0.3s ease',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>FraudGuard AI</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Online & Monitoring</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ color: 'white', opacity: 0.8, cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.opacity = '1'}
              onMouseOut={e => e.currentTarget.style.opacity = '0.8'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: msg.sender === 'user' ? 'var(--color-indigo-100)' : '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? <User size={14} color="#4f46e5" /> : <Bot size={14} color="#4f46e5" />}
                </div>
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#4f46e5' : 'var(--color-slate-100)',
                  color: msg.sender === 'user' ? 'white' : 'var(--color-slate-800)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  {msg.text}
                  <div style={{
                    fontSize: '0.65rem',
                    opacity: 0.7,
                    marginTop: '4px',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                 <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={14} color="#4f46e5" />
                </div>
                <div style={{
                  backgroundColor: 'var(--color-slate-100)', padding: '12px 14px',
                  borderRadius: '18px 18px 18px 4px', display: 'flex', gap: '4px'
                }}>
                  <span className="typing-dot" style={{ width: 6, height: 6, background: '#4f46e5', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                  <span className="typing-dot" style={{ width: 6, height: 6, background: '#4f46e5', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></span>
                  <span className="typing-dot" style={{ width: 6, height: 6, background: '#4f46e5', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            backgroundColor: 'var(--color-surface)'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask an AI assistant..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-primary)'
              }}
            />
            <button 
              onClick={handleSend}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#4f46e5',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(79, 70, 229, 0.4)',
                cursor: 'pointer',
                border: 'none',
                opacity: inputValue.trim() ? 1 : 0.6,
                pointerEvents: inputValue.trim() ? 'auto' : 'none'
              }}
            >
              <Send size={16} style={{ marginLeft: '-2px' }} />
            </button>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="shadow-lg"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          }}
          onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseOut={(e) => { if (!isOpen) e.currentTarget.style.transform = 'scale(1)' }}
        >
          {isOpen ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
