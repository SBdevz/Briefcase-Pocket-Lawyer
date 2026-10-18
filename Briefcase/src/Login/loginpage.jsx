import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../Home/Header.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSignUp = searchParams.get('mode') === 'signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.session) {
          navigate('/Home');
        } else {
          setStatusMessage('Account created. Check your email to confirm your address, then sign in.');
          setSearchParams({});
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/Home');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page home-newspaper login-site">
      <Header />
      <main className="login-page">
        <nav className="login-nav" aria-label="Breadcrumb">
          <Link to="/Home"><span aria-hidden="true">&larr;</span> Resource Toolbox</Link>
          <span>Account access</span>
        </nav>
        <div className="login-content">
          <section className="login-heading" aria-labelledby="login-page-title">
            <p className="home-eyebrow"><span aria-hidden="true"></span> Briefcase member access</p>
            <h1 id="login-page-title">Your legal research, ready when you are.</h1>
            <p>Sign in to return to your saved conversations, or create an account to keep them together.</p>
            <div className="login-stamp" aria-hidden="true">
              <strong>B</strong>
              <span>MEMBER</span>
              <span>ACCESS</span>
            </div>
          </section>

          <section className="login-panel" aria-labelledby="login-title">
            <p className="login-panel-kicker">{isSignUp ? 'New account' : 'Welcome back'}</p>
            <h2 id="login-title">{isSignUp ? 'Create an Account' : 'Sign In to Your Account'}</h2>

            {errorMessage && <p className="login-message login-error" role="alert">{errorMessage}</p>}
            {statusMessage && <p className="login-message login-status" role="status">{statusMessage}</p>}

            <form className="login-form" onSubmit={handleAuth}>
              <div className="login-field">
                <label className="login-label" htmlFor="login-email">Email Address</label>
                <input
                  className="login-input"
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">Password</label>
                <input
                  className="login-input"
                  id="login-password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <div className="login-switch">
              <span>{isSignUp ? 'Already have an account? ' : "Don't have an account yet? "}</span>
              <button
                className="login-switch-button"
                type="button"
                onClick={() => setSearchParams(isSignUp ? {} : { mode: 'signup' })}
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </div>
          </section>
        </div>
        <p className="login-disclaimer">Briefcase Pocket Lawyer provides information, not legal advice.</p>
      </main>
    </div>
  );
}

export default LoginPage;
