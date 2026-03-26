import React, { useState } from 'react';
import { useAuth } from '../auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Email sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSignUp = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      setMessage('Account created. Check your email to confirm if prompted.');
    } catch (err: any) {
      setError(err?.message || 'Sign up failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      <div className="w-full max-w-md bg-white editorial-shadow p-6 space-y-5" style={{ borderRadius: '0.35rem' }}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-neutral-900 italic">Your Account</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-3 text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label="Close sign in dialog"
          >
            Close
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full min-h-[44px] bg-neutral-900 text-white text-xs font-label uppercase tracking-[0.2em] hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          style={{ borderRadius: '0.25rem' }}
          aria-label="Sign in with Google"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-neutral-200 flex-1" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">or</span>
          <div className="h-px bg-neutral-200 flex-1" />
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.2em] text-secondary" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full min-h-[44px] px-3 border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ borderRadius: '0.25rem' }}
            aria-label="Email address"
          />

          <label className="block text-xs uppercase tracking-[0.2em] text-secondary" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full min-h-[44px] px-3 border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ borderRadius: '0.25rem' }}
            aria-label="Password"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] px-4 bg-primary text-white text-xs font-label uppercase tracking-[0.2em] hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderRadius: '0.25rem' }}
              aria-label="Sign in with email"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleEmailSignUp}
              disabled={submitting}
              className="min-h-[44px] px-4 bg-surface-container-high text-neutral-900 text-xs font-label uppercase tracking-[0.2em] hover:bg-surface-container-low transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ borderRadius: '0.25rem' }}
              aria-label="Create account with email"
            >
              Sign up
            </button>
          </div>
        </form>

        {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
        {message && <p className="text-xs text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default AuthModal;
