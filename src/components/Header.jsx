import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';

export default function Header({ activePath }) {
  const { currentUser, language, setLanguage } = useAppState();
  const { t } = useI18n();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Monitor page scroll to toggle background shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync active path with highlighting
  const currentRootPath = activePath.split('?')[0];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const categories = [
    { name: 'All Products', categoryKey: 'All', path: '#shop' },
    { name: 'Power Sprayers', categoryKey: 'Power Sprayers', path: '#shop?category=Power%20Sprayers' },
    { name: 'Knapsack Sprayers', categoryKey: 'Knapsack Sprayers', path: '#shop?category=Knapsack%20Sprayers' },
    { name: 'Battery Spray Pumps', categoryKey: 'Battery Spray Pumps', path: '#shop?category=Battery%20Spray%20Pumps' },
    { name: 'HDPE Pipes', categoryKey: 'HDPE Pipes', path: '#shop?category=HDPE%20Pipes' },
    { name: 'MDPE Pipes', categoryKey: 'MDPE Pipes', path: '#shop?category=MDPE%20Pipes' },
    { name: 'Electrofusion Fittings', categoryKey: 'Electrofusion Fittings', path: '#shop?category=Electrofusion%20Fittings' },
    { name: 'Moulded Fittings', categoryKey: 'Moulded Fittings', path: '#shop?category=Moulded%20Fittings' },
    { name: 'Fabricated Fittings', categoryKey: 'Fabricated Fittings', path: '#shop?category=Fabricated%20Fittings' }
  ];

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`} id="main-header">
      <div className="header-container">
        <a href="#home" className="logo" onClick={handleLinkClick}>
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8L18 20H6L12 8Z" fill="currentColor" />
            <circle cx="12" cy="14" r="2" fill="var(--color-bg)" />
          </svg>
          <span className="logo-text">Mech <span className="logo-accent">Corner</span></span>
        </a>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} id="nav-menu">
          <a
            href="#home"
            className={`nav-link ${currentRootPath === '#home' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav_home')}
          </a>
          <a
            href="#about"
            className={`nav-link ${currentRootPath === '#about' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav_about')}
          </a>

          {/* Products Dropdown */}
          <div
            className={`nav-dropdown ${dropdownOpen ? 'is-open' : ''}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
          >
            <a
              href="#shop"
              className={`nav-link nav-dropdown-trigger ${currentRootPath === '#shop' ? 'active' : ''}`}
              aria-expanded={dropdownOpen ? 'true' : 'false'}
              onClick={handleLinkClick}
            >
              {t('nav_products')}
            </a>
            <div className="nav-dropdown-menu">
              {categories.map((cat, idx) => (
                <a
                  key={idx}
                  href={cat.path}
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLinkClick();
                  }}
                >
                  {t(cat.categoryKey)}
                </a>
              ))}
            </div>
          </div>

          <a
            href="#contact"
            className={`nav-link ${currentRootPath === '#contact' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav_contact')}
          </a>

          {/* Conditional Auth Navigation Link */}
          {currentUser ? (
            <a href="#logout" className="nav-link auth-nav-link" onClick={handleLinkClick}>
              {t('nav_signout')} ({currentUser.username})
            </a>
          ) : (
            <a href="#auth" className={`nav-link auth-nav-link ${currentRootPath === '#auth' ? 'active' : ''}`} onClick={handleLinkClick}>
              {t('nav_signin')}
            </a>
          )}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-switcher-wrapper">
            <select
              id="lang-select"
              className="lang-select-dropdown"
              aria-label="Select Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="mr">मराठी</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-btn"
            className={`header-action-btn mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
