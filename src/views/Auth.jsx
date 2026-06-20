import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';

export default function Auth() {
  const { currentUser, loginUser, addToast } = useAppState();
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Redirect based on role if already logged in
      if (currentUser.role === 'admin') {
        window.location.hash = '#admin';
      } else {
        window.location.hash = '#shop';
      }
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPassError(true);
      isValid = false;
    } else {
      setPassError(false);
    }

    if (isValid) {
      try {
        await loginUser(email, password);
        addToast(`Welcome back! Syncing profile...`, 'success');
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="auth-wrapper glass-card">
          <div className="auth-tabs">
            <button className="auth-tab-btn active">{t('nav_signin')}</button>
          </div>

          <div id="auth-forms-container">
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="signin-email" className="form-label">{t('contact_email').replace(' *', '')}</label>
                <input
                  type="email"
                  id="signin-email"
                  className={`form-input ${emailError ? 'error' : ''}`}
                  placeholder="e.g. farmer@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <div className="form-error-msg">{t('contact_err_email')}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="signin-password" className="form-label">Password</label>
                <input
                  type="password"
                  id="signin-password"
                  className={`form-input ${passError ? 'error' : ''}`}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passError && (
                  <div className="form-error-msg">Password cannot be empty.</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-full-width" style={{ marginTop: '10px' }}>
                {t('nav_signin')}
              </button>
            </form>
          </div>

          <div className="auth-footer" id="auth-tip-box">
            <strong style={{ color: 'var(--color-accent)' }}>Welcome to Mech Corner</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
