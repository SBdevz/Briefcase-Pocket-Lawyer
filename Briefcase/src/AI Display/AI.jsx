import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { supabase } from '../supabaseClient'; 

const suggestedQuestions = [
  'What is the latest bill about?',
  'How can I find information about a bill in Congress?',
  'What information is available in the official records?',
];

function AI() {
  const { isLoggedIn } = useAuth(); // Pulls global logged-in status variable
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- Sidebar & Sync States ---
  const [pastChats, setPastChats] = useState([]); 
  const [currentChatId, setCurrentChatId] = useState(null);
  const conversationEndRef = useRef(null);

  // Monitors your global login status and fetches chat logs accordingly
  useEffect(() => {
    if (isLoggedIn) {
      fetchPastChats();
    } else {
      setPastChats([]);
      setCurrentChatId(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Downloads past conversations from your backend using the user's session token
  const fetchPastChats = async () => {
    try {
      const sessionData = await supabase.auth.getSession();
      const token = sessionData.data.session?.access_token;
      if (!token) return;

      const res = await fetch('/api/chat-histories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.chats) setPastChats(data.chats);
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
  };

  // Triggers when you click "Save Chat" to create or update an account-linked thread
  const handleSaveChat = async () => {
    if (!isLoggedIn || !messages.length) return alert("Cannot save chat. Ensure you are logged in.");
    
    const sessionData = await supabase.auth.getSession();
    const token = sessionData.data.session?.access_token;
    if (!token) return alert("Session expired. Please log in again.");

    const firstUserMessage = messages.find(m => m.role === 'user')?.content || 'Saved Chat';
    const title = firstUserMessage.slice(0, 25) + '...';

    try {
      if (currentChatId) {
        // Scenario A: Update active chat logs
        const res = await fetch(`/api/chat-histories/${currentChatId}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ messages })
        });
        const data = await res.json();
        if (!res.ok || !data.chat) throw new Error(data.error || 'Unable to update saved chat.');
      } else {
        // Scenario B: Store a completely new entry
        const res = await fetch('/api/chat-histories', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, messages })
        });
        const data = await res.json();
        if (!res.ok || !data.chat) throw new Error(data.error || 'Unable to save chat.');
        setCurrentChatId(data.chat.id);
      }
      fetchPastChats();
      alert("Chat saved successfully!");
    } catch (e) {
      console.error("Save failed:", e);
      alert(e.message || "Save failed.");
    }
  };

  // Sends raw text strings out to your Node backend AI processor route
  async function sendQuestion(text = question) {
    const userQuestion = text.trim();
    if (!userQuestion || isLoading) return;

    setMessages((current) => [...current, { role: 'user', content: userQuestion }]);
    setQuestion(''); setError(''); setIsLoading(true);

    try {
      const response = await fetch('/api/Ben-AI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(response.status >= 500 ? 'Ben could not process that question.' : data.error);
      }
      setMessages((current) => [...current, { role: 'assistant', content: data.answer }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendQuestion();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  }
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 🧭 HISTORY SIDEBAR (Only mounts if logged in) */}
      {isLoggedIn && (
        <aside style={{ width: '260px', background: '#171717', color: '#fff', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid #2d2d2d' }}>
          <button 
            type="button"
            onClick={() => { setCurrentChatId(null); setMessages([]); }} 
            style={{ padding: '0.6rem', width: '100%', cursor: 'pointer', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            + New Chat
          </button>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Past Conversations</p>
            {pastChats.map(chat => (
              <button
                key={chat.id}
                type="button"
                onClick={() => { setCurrentChatId(chat.id); setMessages(chat.messages); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem',
                  background: currentChatId === chat.id ? '#262626' : 'transparent',
                  color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem'
                }}
              >
                💬 {chat.title}
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* 💬 MAIN APPLICATION VIEW WINDOW */}
      <main className="ai-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <header className="ai-header">
          <Link className="ai-brand" to="/Home" aria-label="Briefcase home">
            <span className="ai-brand-mark" aria-hidden="true">B</span>
            <span>Briefcase <span className="ai-brand-light">/ Ben</span></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="ai-status"><span aria-hidden="true" /> Government sources</span>
            {isLoggedIn && (
              <button 
                type="button"
                onClick={handleSaveChat}
                style={{ background: '#10a37f', color: '#fff', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
              >
                💾 Save Chat
              </button>
            )}
          </div>
        </header>

        <section className="ai-chat" aria-label="Chat with Ben" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div className="ai-chat-heading">
            <p className="ai-kicker">YOUR POCKET RESEARCHER</p>
            <h1>Ask Ben</h1>
            <p className="ai-intro">Questions about federal legislation? Start here.</p>
          </div>

          <div className="ai-conversation" aria-live="polite" aria-relevant="additions" style={{ flex: 1, overflowY: 'auto' }}>
            {messages.length === 0 ? (
              <div className="ai-welcome">
                <span className="ai-welcome-mark" aria-hidden="true">B</span>
                <h2>What would you like to know?</h2>
                <p>Ben checks official government records and explains what the available documents say.</p>
                <div className="ai-suggestions" aria-label="Suggested questions">
                  {suggestedQuestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => sendQuestion(suggestion)}>
                      {suggestion.trim()}
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ai-message-list">
                {messages.map((message, index) => (
                  <article className={`ai-message ai-message-${message.role}`} key={`${message.role}-${index}`}>
                    <span className="ai-message-label">{message.role === 'user' ? 'YOU' : 'BEN'}</span>
                    {message.role === 'assistant' ? (
                      <div className="ai-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content.replace(/<br\s*\/?>/gi, '\n')}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </article>
                ))}
                {isLoading && (
                  <div className="ai-message ai-message-assistant ai-typing" role="status">
                    <span className="ai-message-label">BEN</span>
                    <p>Checking the available records...</p>
                  </div>
                )}
                <div ref={conversationEndRef} />
              </div>
            )}
          </div>

          {error && <p className="ai-error" role="alert">{error}</p>}

          <form className="ai-composer" onSubmit={handleSubmit}>
            <label className="ai-sr-only" htmlFor="ai-question">Your question</label>
            <textarea
              id="ai-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a bill or federal legislation..."
              rows={2}
              disabled={isLoading}
            />
            <button type="submit" aria-label="Send question" disabled={isLoading || !question.trim()}>
              <span aria-hidden="true">↑</span>
            </button>
            <span className="ai-composer-hint">Enter to send · Shift+Enter for a new line</span>
          </form>

          <p className="ai-disclaimer">Ben provides general information from available public records, not legal advice.</p>
        </section>
      </main>

    </div>
  );
}

export default AI;
