import React, { useState, useEffect } from 'react';
import './App.css';
import { useAppState } from './context/StateContext';
import { useI18n } from './utils/i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import Modal from './components/Modal';

import Home from './views/Home';
import Shop from './views/Shop';
import About from './views/About';
import Contact from './views/Contact';
import Auth from './views/Auth';
import Admin from './views/Admin';

export default function App() {
  const { currentUser, logoutUser, addToast } = useAppState();
  const { t } = useI18n();
  const [hash, setHash] = useState(() => window.location.hash || '#home');
  const [loading, setLoading] = useState(true);

  // Hash listener
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash || '#home';
      setHash(newHash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse path and query
  const parseHash = (hashVal) => {
    const [pathWithHash, queryString] = hashVal.split('?');
    const path = pathWithHash || '#home';
    const query = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      });
    }
    return { path, query };
  };

  const { path, query } = parseHash(hash);

  // Auth Guards & Logout Handling
  useEffect(() => {
    if (path === '#admin') {
      if (!currentUser || currentUser.role !== 'admin') {
        addToast('Access denied. Administrator privileges required.', 'error');
        window.location.hash = '#auth';
      }
    } else if (path === '#logout') {
      logoutUser();
      addToast('You have successfully signed out.', 'success');
      window.location.hash = '#home';
    }
  }, [path, currentUser, logoutUser]);

  // Loading animation feel on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // SEO updates
    updateSEO(path);

    return () => clearTimeout(timer);
  }, [path]);

  // Handle route change class on body
  useEffect(() => {
    if (path === '#admin') {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [path]);

  const updateSEO = (routePath) => {
    const seoDetails = {
      '#home': {
        title: 'Mech Corner | Premium Agricultural Spraying Solutions',
        description: 'Discover agricultural sprayers from Mech Corner: power sprayers, knapsack sprayers, and battery spray pumps.'
      },
      '#shop': {
        title: 'Shop Agricultural Sprayers & Equipment | Mech Corner',
        description: 'Explore the Lu Shyoung LS series. High quality power sprayers, manual knapsack sprayers, and 12V battery pumps.'
      },
      '#about': {
        title: 'Our Story & Team | Mech Corner Agricultural Equipment',
        description: 'Learn about Mech Corner, our mission to support local farmers, and our line of high efficiency spray equipment.'
      },
      '#contact': {
        title: 'Contact Us | Mech Corner Customer Support',
        description: 'Get in touch with agricultural spraying experts. Access our address, simulated map, and quick support forms.'
      },
      '#auth': {
        title: 'Sign In / Sign Up | Mech Corner Storefront',
        description: 'Access your Mech Corner user portal to manage purchases and browse catalog products.'
      },
      '#admin': {
        title: 'System Admin Panel | Mech Corner',
        description: 'Management portal for Mech Corner catalog pricing, product inventory, and customer sales order ledgers.'
      }
    };

    const seo = seoDetails[routePath] || seoDetails['#home'];
    document.title = seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description);
    }
  };

  // Determine current active page renderer
  const renderPage = () => {
    switch (path) {
      case '#home':
        return <Home />;
      case '#about':
        return <About />;
      case '#shop':
        return <Shop query={query} />;
      case '#contact':
        return <Contact query={query} />;
      case '#auth':
        return <Auth />;
      case '#admin':
        return currentUser && currentUser.role === 'admin' ? <Admin /> : <Auth />;
      default:
        return <Home />;
    }
  };

  const showBackButton = path !== '#home' && path !== '#admin' && path !== '#logout';

  return (
    <>
      {/* Loading Screen */}
      <div id="loading-screen" className={`loading-screen ${!loading ? 'fade-out' : ''}`}>
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-logo">Mech Corner</div>
        </div>
      </div>

      {/* Header */}
      <Header activePath={path} />

      {/* Main Viewport */}
      <main id="app-viewport" className="app-viewport">
        {showBackButton && (
          <div className="container" style={{ marginTop: '24px', marginBottom: '-16px' }}>
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary back-button"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: 'var(--border-radius-sm)'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {t('btn_back')}
            </button>
          </div>
        )}
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Admin Login Button */}
      {path !== '#admin' && path !== '#auth' && !(currentUser && currentUser.role === 'admin') && (
        <a
          href="#auth"
          id="admin-fab-btn"
          className="floating-admin-btn"
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

      {/* Declarative Modals Layer */}
      <Modal />

      {/* Toast notifications stack */}
      <ToastContainer />
    </>
  );
}
