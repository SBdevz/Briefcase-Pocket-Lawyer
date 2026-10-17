import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const suggestedQuestions = [
  'What is the latest bill about?',
  'How can I find information about a bill in Congress?',
  'What information is available in the official records?',
];

function AI() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const conversationEndRef = useRef(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function sendQuestion(text = question) {
    const userQuestion = text.trim();
    if (!userQuestion || isLoading) return;

    setMessages((current) => [...current, { role: 'user', content: userQuestion }]);
    setQuestion('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/Ben-AI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status >= 500
            ? 'Ben could not process that question. Please try again.'
            : data.error || 'The assistant could not answer just now.',
        );
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.answer }]);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? 'Could not connect to Ben. Check that the backend is running, then try again.'
          : requestError.message,
      );
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
    <main className="ai-page">
      <header className="ai-header">
        <Link className="ai-brand" to="/Home" aria-label="Briefcase home">
          <span className="ai-brand-mark" aria-hidden="true">B</span>
          <span>Briefcase <span className="ai-brand-light">/ Ben</span></span>
        </Link>
        <span className="ai-status"><span aria-hidden="true" /> Government sources</span>
      </header>

      <section className="ai-chat" aria-label="Chat with Ben">
        <div className="ai-chat-heading">
          <p className="ai-kicker">YOUR POCKET RESEARCHER</p>
          <h1>Ask Ben</h1>
          <p className="ai-intro">Questions about federal legislation? Start here.</p>
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
                    <span aria-hidden="true">&#8599;</span>
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
                    <div className="ai-markdown"><ReactMarkdown>{message.content}</ReactMarkdown></div>
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
            <span aria-hidden="true">&#8593;</span>
          </button>
          <span className="ai-composer-hint">Enter to send · Shift+Enter for a new line</span>
        </form>

        <p className="ai-disclaimer">Ben provides general information from available public records, not legal advice.</p>
      </section>
    </main>
  );
}

export default AI;