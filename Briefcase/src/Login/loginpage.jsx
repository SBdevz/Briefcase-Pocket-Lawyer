import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false); // Toggles between Login and Signup modes
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
          setIsSignUp(false);
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
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
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
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </div>
      </section>
    </main>
  );
}

export default LoginPage;
