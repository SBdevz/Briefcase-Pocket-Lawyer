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
  const [benReply, setBenReply] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  
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
    if (!benReply) conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, benReply]);

  useEffect(() => {
    if (!benReply || benReply.visibleText.length >= benReply.content.length) return;

    const timer = window.setTimeout(() => {
      setBenReply((current) => {
        if (!current || current.id !== benReply.id) return current;
        const revealStep = Math.max(2, Math.ceil(current.content.length / 200));
        const nextLength = Math.min(current.visibleText.length + revealStep, current.content.length);
        if (nextLength >= current.content.length) return null;
        return { ...current, visibleText: current.content.slice(0, nextLength) };
      });
    }, 18);

    return () => window.clearTimeout(timer);
  }, [benReply]);

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

    setBenReply(null);
    setMessages((current) => [...current, { role: 'user', content: userQuestion }]);
    setQuestion(''); setError(''); setIsLoading(true);

    try {
      const response = await fetch('/api/Ben-AI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Ben could not process that question. Please try again later.');
      }
      const reply = {
        id: `ben-${Date.now()}`,
        role: 'assistant',
        content: typeof data.answer === 'string' && data.answer.trim()
          ? data.answer
          : "I couldn't generate a response to that question.",
      };
      setMessages((current) => [...current, reply]);
      setBenReply({ ...reply, visibleText: '' });
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

  const benState = isLoading
    ? 'thinking'
    : benReply ? 'explaining' : 'neutral';
  const benImages = {
    neutral: '/ben-neutral-cutout.png',
    thinking: '/ben-thinking-cutout.png',
    explaining: '/ben-explain-cutout.png',
  };

  return (
    <div className={`ai-shell${isLoggedIn ? ' has-history' : ''}`}>
      
      {/* 🧭 HISTORY SIDEBAR (Only mounts if logged in) */}
      {isLoggedIn && (
        <aside id="ai-history" className={`ai-history${historyOpen ? ' is-open' : ''}`}>
          <button
            className="ai-new-chat"
            type="button"
            onClick={() => { setCurrentChatId(null); setMessages([]); setBenReply(null); setHistoryOpen(false); }}
          >
            + New Chat
          </button>
          <div className="ai-history-list">
            <p className="ai-history-heading">Past Conversations</p>
            {pastChats.map(chat => (
              <button
                key={chat.id}
                type="button"
                onClick={() => { setCurrentChatId(chat.id); setMessages(chat.messages); setBenReply(null); setHistoryOpen(false); }}
                className={`ai-history-chat${currentChatId === chat.id ? ' is-active' : ''}`}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </aside>
      )}
      {isLoggedIn && historyOpen && (
        <button
          className="ai-history-scrim"
          type="button"
          aria-label="Close chat history"
          onClick={() => setHistoryOpen(false)}
        />
      )}

      {/* 💬 MAIN APPLICATION VIEW WINDOW */}
      <main className="ai-page">
        <header className="ai-header">
          <Link className="ai-brand" to="/Home" aria-label="Briefcase home">
            <span className="ai-brand-mark" aria-hidden="true">B</span>
            <span>Briefcase Pocket Lawyer <span className="ai-brand-light">/ Ben</span></span>
          </Link>
          <div className="ai-header-actions">
            {isLoggedIn && (
              <button
                className="ai-history-toggle"
                type="button"
                aria-expanded={historyOpen}
                aria-controls="ai-history"
                onClick={() => setHistoryOpen((open) => !open)}
              >
                Chats
              </button>
            )}
            <span className="ai-status"><span aria-hidden="true" /> Government sources</span>
            {isLoggedIn && (
              <button
                className="ai-save-chat"
                type="button"
                onClick={handleSaveChat}
              >
                Save Chat
              </button>
            )}
            {!isLoggedIn && <Link className="ai-account-link" to="/login">Log In / Sign Up</Link>}
          </div>
        </header>

        <section className="ai-chat" aria-label="Chat with Ben">
          <div className="ai-chat-heading">
            <p className="ai-kicker">YOUR POCKET RESEARCHER</p>
            <h1>Ask Ben</h1>
            <p className="ai-intro">Seeking legal advisory? Start here.</p>
          </div>

          <div className="ai-conversation" aria-live="polite" aria-relevant="additions">
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
                {messages.filter((message) => !benReply || message.id !== benReply.id).map((message, index) => (
                  <article className={`ai-message ai-message-${message.role}`} key={`${message.role}-${index}`}>
                    <span className="ai-message-label">{message.role === 'user' ? 'YOU' : 'BEN SAYS'}</span>
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
                    <span className="ai-message-label">BEN SAYS</span>
                    <p>Checking the available records...</p>
                  </div>
                )}
                <div ref={conversationEndRef} />
              </div>
            )}
          </div>

          <div className={`ai-ben-stage ai-ben-stage-${benState}`}>
            <img
              className="ai-ben-portrait"
              src={benImages[benState]}
              alt={`Ben is ${benState === 'explaining' ? 'speaking' : benState}.`}
            />
            <div className="ai-ben-bubble" aria-label="Ben's response">
              <span className="ai-ben-speaker-label">BEN SAYS</span>
              {isLoading ? (
                <p className="ai-ben-thinking">Ben is checking the available records...</p>
              ) : benReply ? (
                <div className="ai-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {benReply.visibleText || '\u00a0'}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="ai-ben-thinking">Ready when you are.</p>
              )}
            </div>
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
