import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Zap, 
  HelpCircle, 
  Cpu, 
  CheckCircle2,
  CornerDownLeft
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  "Which vehicle should deliver the Hyderabad orders today?",
  "Predict traffic congestion on Gachibowli Flyover junction",
  "How can we minimize fuel cost across our active diesel fleet?",
  "Give me telemetry brief for vehicle VH-101 (Tata Ace EV)"
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "👋 **Hello! I'm MoveAI Mobility Copilot.**\n\nI analyze live fleet telemetry, road congestion, and parcel load constraints. How can I assist your dispatch team today?",
      source: "Gemini 1.5 Flash / MoveAI Engine",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const promptToSend = queryText || input;
    if (!promptToSend.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAssistant(promptToSend);
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.reply || "MoveAI: Query processed with nominal confidence.",
        source: res.source || "MoveAI Decision Core",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: "⚠️ MoveAI Copilot temporary timeout. Re-routing dispatch query through local cache.",
          source: "Offline Telemetry Fallback",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-cyan">Gemini Generative Engine</span>
            <span className="badge badge-purple">Telemetry Grounded</span>
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>AI Mobility & Fleet Copilot</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span className="pulse-dot"></span>
          <span>Context window synchronized with 6 live vehicles</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={20} color="#051329" />
                  </div>
                )}

                <div>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isUser ? 'var(--gradient-accent)' : 'rgba(13, 21, 39, 0.95)',
                    color: '#fff',
                    border: isUser ? 'none' : '1px solid var(--card-border)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--text-subtle)'
                  }}>
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>{msg.source}</span>
                      </>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={18} color="#f1f5f9" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} color="#051329" />
              </div>
              <div style={{
                padding: '12px 18px',
                borderRadius: '16px 16px 16px 2px',
                background: 'rgba(13, 21, 39, 0.9)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)'
              }}>
                <Sparkles size={16} className="animate-spin" />
                <span>MoveAI reasoning over fleet constraints...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--card-border)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          background: 'rgba(7, 11, 20, 0.5)'
        }}>
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
            >
              <Sparkles size={12} color="var(--accent-cyan)" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--card-border)', background: 'rgba(10, 15, 29, 0.9)' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
          >
            <input 
              type="text"
              placeholder="Ask anything about fleet dispatch, traffic predictions, or vehicle allocations..."
              className="form-input"
              style={{ margin: 0, padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '12px 20px', borderRadius: 'var(--radius-md)' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
