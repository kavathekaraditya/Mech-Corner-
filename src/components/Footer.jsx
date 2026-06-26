import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';

export default function Footer() {
  const { addToast, currentUser } = useAppState();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const showAdminBtn = !(currentUser && currentUser.role === 'admin');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      addToast(t('contact_toast_success').replace('{name}', email) || `Thank you for subscribing with ${email}!`, 'success');
      setEmail('');
    }
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Brand Details */}
        <div className="footer-brand-section">
          <a href="#home" className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8L18 20H6L12 8Z" fill="currentColor" />
              <circle cx="12" cy="14" r="2" fill="var(--color-bg)" />
            </svg>
            <span className="logo-text">Mech <span className="logo-accent">Corner</span></span>
          </a>
          <p className="footer-desc" id="footer-desc">
            {t('footer_desc')}
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="footer-link-group">
            <h4 className="footer-group-title" id="footer-title-sitemap">{t('footer_title_sitemap')}</h4>
            <ul className="footer-links">
              <li><a href="#home">{t('nav_home')}</a></li>
              <li><a href="#shop">{t('nav_products')}</a></li>
              <li><a href="#about">{t('nav_about')}</a></li>
              <li><a href="#contact">{t('nav_contact')}</a></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h4 className="footer-group-title" id="footer-title-products">{t('footer_title_products')}</h4>
            <ul className="footer-links">
              <li><a href="#shop?category=Power%20Sprayers">{t('Power Sprayers')}</a></li>
              <li><a href="#shop?category=Knapsack%20Sprayers">{t('Knapsack Sprayers')}</a></li>
              <li><a href="#shop?category=Battery%20Spray%20Pumps">{t('Battery Spray Pumps')}</a></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h4 className="footer-group-title" id="footer-title-newsletter">{t('footer_title_newsletter')}</h4>
            <p className="footer-newsletter-text" id="footer-newsletter-text">
              {t('footer_newsletter_text')}
            </p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder={t('footer_newsletter_placeholder')}
                required
                aria-label="Email address for newsletter"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe to newsletter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright" id="footer-copyright" dangerouslySetInnerHTML={{ __html: t('footer_copyright') }} />

          {/* Admin login button — sits in footer bottom bar */}
          {showAdminBtn && (
            <a
              href="#auth"
              id="admin-fab-btn"
              className="footer-admin-btn"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <svg className="floating-admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Admin
            </a>
          )}

          <div className="footer-bottom-links">
            <a href="#">{t('footer_privacy')}</a>
            <a href="#">{t('footer_terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
