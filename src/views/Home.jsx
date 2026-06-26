import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { getCategoryIcon } from '../components/Icons';

// Category definitions for the home grid
const HOME_CATEGORIES = [
  {
    name: 'Sprayers',
    queryName: 'Power Sprayers',
    borderColor: '#E87722',
    iconColor: '#E87722',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M12 2a5 5 0 0 1 5 5c0 3.5-5 13-5 13S7 10.5 7 7a5 5 0 0 1 5-5z" />
        <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'HDPE Pipes',
    queryName: 'HDPE Pipes',
    borderColor: '#00264b',
    iconColor: '#00264b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="4" y1="9" x2="4" y2="15" />
        <line x1="20" y1="9" x2="20" y2="15" />
      </svg>
    )
  },
  {
    name: 'Pipe Fittings',
    queryName: 'Moulded Fittings',
    borderColor: '#E87722',
    iconColor: '#E87722',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    )
  },
  {
    name: 'Irrigation Systems',
    queryName: 'MDPE Pipes',
    borderColor: '#012d1d',
    iconColor: '#012d1d',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    )
  },
  {
    name: 'Agri Machinery',
    queryName: 'Battery Spray Pumps',
    borderColor: '#00264b',
    iconColor: '#00264b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <circle cx="5" cy="17" r="3" />
        <circle cx="19" cy="17" r="3" />
        <path d="M5 14V9l4-5h8l2 5v5" />
        <path d="M9 4v10" />
      </svg>
    )
  },
  {
    name: 'Crop Protection',
    queryName: 'Knapsack Sprayers',
    borderColor: '#E87722',
    iconColor: '#E87722',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
];

export default function Home() {
  const { products, showModal, testimonials } = useAppState();
  const { t } = useI18n();

  // 1. Hero Image Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      img: '/images/power_sprayer.png',
      alt: 'Lu Shyoung LS-30 Power Sprayer',
      number: '45',
      text: 'Bar Max Working Pressure'
    },
    {
      img: '/images/knapsack_sprayer.png',
      alt: 'Manual Backpack Sprayer',
      number: '16',
      text: 'Liters Tank Capacity'
    },
    {
      img: '/images/battery_sprayer.png',
      alt: '12V Battery Spray Pump',
      number: '12V',
      text: 'High Capacity Battery'
    },
    {
      img: '/images/hdpe_pipe.avif',
      alt: 'HDPE Agricultural Pipes',
      number: 'DN20',
      text: 'to DN315 Diameter Range'
    },
    {
      img: '/images/mdpe_pipe.png',
      alt: 'MDPE Utility Pipe',
      number: '12',
      text: 'Bar Max Working Pressure'
    },
    {
      img: '/images/fabricated_pipe.png',
      alt: 'Fabricated HDPE Fittings',
      number: 'ISO',
      text: 'Certified Fabricated Fittings'
    },
    {
      img: '/images/moduled_hdpe.png',
      alt: 'Moulded HDPE Pipe Fittings',
      number: '100%',
      text: 'Virgin HDPE Grade Material'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // 2. Testimonials Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Pull top 3 products
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      {/* ── NEW Mobile-style Hero Banner ── */}
      <section className="mhero-section">
        <div className="mhero-inner">
          {/* Background image */}
          <img
            className="mhero-bg-img"
            src={heroSlides[currentSlide]?.img || '/images/power_sprayer.png'}
            alt={heroSlides[currentSlide]?.alt || 'Mech Corner'}
          />
          {/* Gradient overlay */}
          <div className="mhero-overlay" />
          {/* Content */}
          <div className="mhero-content">
            <h1 className="mhero-title">Modern Solutions for Productive Farming</h1>
            <p className="mhero-desc">Premium machinery and irrigation equipment delivered to your farm.</p>
            <a href="#shop" className="mhero-btn">Shop Now</a>
          </div>
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section className="mcat-section">
        <div className="container">
          <div className="mcat-header">
            <h2 className="mcat-title">Categories</h2>
            <a href="#shop" className="mcat-viewall">View All <span aria-hidden="true">›</span></a>
          </div>
          <div className="mcat-grid">
            {HOME_CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={`#shop?category=${encodeURIComponent(cat.queryName)}`}
                className="mcat-card"
                style={{ borderLeftColor: cat.borderColor }}
              >
                <div className="mcat-icon" style={{ color: cat.iconColor }}>
                  {cat.icon}
                </div>
                <span className="mcat-name">{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats counter */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-card">
            <div className="stat-number">10k+</div>
            <div className="stat-label">{t('stat_farms')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">{t('stat_parts')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">{t('stat_support')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0.3s</div>
            <div className="stat-label">{t('stat_valves')}</div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">{t('nav_products')}</span>
            <h2 className="section-title">{t('nav_products')}</h2>
            <p className="section-desc">{t('why_desc')}</p>
          </div>

          <div className="featured-grid">
            {featuredProducts.map((prod) => {
              const categoryIcon = getCategoryIcon(prod.category);
              const specsSnippet = Object.entries(prod.specs).slice(0, 3);
              return (
                <div
                  key={prod.id}
                  className="product-card"
                  onClick={() => showModal('product-detail', prod)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-card-img-container">
                    {prod.image ? (
                      <img src={prod.image} alt={prod.name} />
                    ) : (
                      categoryIcon
                    )}
                  </div>
                  <div className="product-card-content">
                    <h3 className="product-card-title">{prod.name}</h3>
                    <p
                      className="product-card-desc-snippet"
                      title={t(prod.id + '_desc')}
                    >
                      {t(prod.id + '_desc') || prod.description}
                    </p>
                    <div className="product-card-specs">
                      {specsSnippet.map(([key, val]) => (
                        <span key={key} className="spec-tag">{t(key)}: {val}</span>
                      ))}
                    </div>
                    <div className="product-card-footer" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`#contact?product=${encodeURIComponent(prod.name)}`}
                        className="btn btn-primary btn-card-add-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '0.85rem', width: '100%' }}
                      >
                        {t('btn_get_quote')}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="featured-actions">
            <a href="#shop" className="btn btn-secondary">{t('nav_all_products')}</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ background: 'var(--color-surface)', borderTop: 'var(--glass-border)' }}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">{t('why_subtitle')}</span>
            <h2 className="section-title">{t('why_title')}</h2>
            <p className="section-desc">{t('why_desc')}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-title">{t('why_feat1_title')}</h3>
              <p className="feature-desc">{t('why_feat1_desc')}</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="feature-title">{t('why_feat2_title')}</h3>
              <p className="feature-desc">{t('why_feat2_desc')}</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <h3 className="feature-title">{t('why_feat3_title')}</h3>
              <p className="feature-desc">{t('why_feat3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">{t('test_subtitle')}</span>
            <h2 className="section-title">{t('test_title')}</h2>
            <p className="section-desc">{t('test_desc')}</p>
          </div>

          <div className="testimonials-carousel-wrapper">
            <div
              className="testimonials-track"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)`, transition: 'transform 0.5s ease-in-out' }}
            >
              {testimonials.map((test, idx) => (
                <div key={idx} className="testimonial-slide">
                  <div className="testimonial-card">
                    <p className="testimonial-quote">{test.quote}</p>
                    <div className="testimonial-author">
                      <div className="author-avatar">{test.avatar}</div>
                      <span className="author-name">{test.name}</span>
                      <span className="author-role">{test.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-controls">
              <button className="carousel-control-btn" onClick={prevTestimonial} aria-label="Previous Testimonial">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="carousel-indicators">
                {testimonials.map((_, idx) => (
                  <span
                    key={idx}
                    className={`carousel-dot ${idx === currentTestimonial ? 'active' : ''}`}
                    onClick={() => setCurrentTestimonial(idx)}
                  ></span>
                ))}
              </div>
              <button className="carousel-control-btn" onClick={nextTestimonial} aria-label="Next Testimonial">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
