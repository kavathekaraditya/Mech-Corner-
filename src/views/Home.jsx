import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { getCategoryIcon } from '../components/Icons';

export default function Home() {
  const { products, showModal } = useAppState();
  const { t } = useI18n();

  // 1. Hero Image Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

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
    if (isHeroHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHeroHovered]);

  const nextHeroSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // 2. Testimonials Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      quote: `"The Lu Shyoung LS-30 plunger pump has transformed our orchard spraying program. We run three nozzles on a single pump and the pressure stays absolutely steady. Outstanding reliability."`,
      avatar: 'AM',
      name: 'Arthur Miller',
      role: 'Commercial Vineyard Owner'
    },
    {
      quote: `"As a smallholder, the SM-16 Samarat was exactly what I needed. It is lightweight, the straps are padded, and pumping takes very little effort compared to my old manual sprayers."`,
      avatar: 'RP',
      name: 'Raj Patel',
      role: 'Organic Vegetable Farmer'
    },
    {
      quote: `"Upgraded to the LS-16E-3 battery sprayer last season. The 12V battery lasts for hours, allowing us to cover three greenhouse blocks without recharging. Saved us hours of labor."`,
      avatar: 'SL',
      name: 'Sarah Lindqvist',
      role: 'Greenhouse Manager'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Pull top 3 products
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-subtitle">{t('hero_subtitle')}</div>
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('hero_title') }} />
            <p className="hero-desc">{t('hero_desc')}</p>
            <div className="hero-actions">
              <a href="#shop" className="btn btn-primary">{t('btn_explore')}</a>
              <a href="#about" className="btn btn-secondary">{t('btn_learn_more')}</a>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div
              className="hero-slider-container"
              onMouseEnter={() => setIsHeroHovered(true)}
              onMouseLeave={() => setIsHeroHovered(false)}
            >
              <div className="hero-slider-track" id="hero-slider-track">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
                  >
                    <img src={slide.img} alt={slide.alt} />
                    <div className="hero-badge">
                      <span className="hero-badge-number">{slide.number}</span>
                      <span className="hero-badge-text">{slide.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Arrows */}
              <button className="hero-slide-nav prev" onClick={prevHeroSlide} aria-label="Previous Slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="hero-slide-nav next" onClick={nextHeroSlide} aria-label="Next Slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* Dots */}
              <div className="hero-slider-dots">
                {heroSlides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  ></span>
                ))}
              </div>
            </div>
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
