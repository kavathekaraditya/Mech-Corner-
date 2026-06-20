import React, { useState } from 'react';
import { useI18n } from '../utils/i18n';

export default function About() {
  const { t } = useI18n();
  const [activeAccordion, setActiveAccordion] = useState(0);

  const toggleAccordion = (idx) => {
    setActiveAccordion(activeAccordion === idx ? null : idx);
  };

  const accordionItems = [
    {
      title: t('about_p1_title'),
      desc: t('about_p1_desc')
    },
    {
      title: t('about_p2_title'),
      desc: t('about_p2_desc')
    },
    {
      title: t('about_p3_title'),
      desc: t('about_p3_desc')
    }
  ];

  return (
    <>
      {/* About Story Section */}
      <section className="section-padding" style={{ paddingBottom: '40px' }}>
        <div className="container about-hero-grid">
          <div className="about-story">
            <span className="section-subtitle">{t('about_subtitle')}</span>
            <h1 className="section-title" style={{ marginBottom: '20px' }}>{t('about_title')}</h1>
            <p>{t('about_desc1')}</p>
            <p>{t('about_desc2')}</p>
            <p>{t('about_desc3')}</p>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <div className="hero-image-fallback">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h3>{t('about_image_title')}</h3>
                <p>{t('about_image_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Accordion */}
      <section
        className="section-padding"
        style={{
          paddingTop: '40px',
          paddingBottom: '40px',
          background: 'var(--color-surface)',
          borderTop: 'var(--glass-border)',
          borderBottom: 'var(--glass-border)'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-title-wrapper">
            <span className="section-subtitle">{t('about_principles_subtitle')}</span>
            <h2 className="section-title">{t('about_principles_title')}</h2>
            <p className="section-desc">{t('about_principles_desc')}</p>
          </div>

          <div className="about-values-accordion">
            {accordionItems.map((item, idx) => {
              const isActive = activeAccordion === idx;
              return (
                <div key={idx} className={`accordion-item ${isActive ? 'active' : ''}`}>
                  <div className="accordion-header" onClick={() => toggleAccordion(idx)}>
                    <h3 className="accordion-title">{item.title}</h3>
                    <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div
                    className="accordion-body"
                    style={{
                      maxHeight: isActive ? '300px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <p style={{ paddingTop: '8px' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">{t('about_team_subtitle')}</span>
            <h2 className="section-title">{t('about_team_title')}</h2>
            <p className="section-desc">{t('about_team_desc')}</p>
          </div>

          <div className="team-grid">
            {/* Member 1 */}
            <div className="team-card glass-card">
              <div className="team-avatar">JC</div>
              <h3 className="team-name">Jacob Chen</h3>
              <span className="team-role">{t('about_m1_role')}</span>
              <p className="team-bio">{t('about_m1_bio')}</p>
            </div>

            {/* Member 2 */}
            <div className="team-card glass-card">
              <div className="team-avatar">MS</div>
              <h3 className="team-name">Marcus Sterling</h3>
              <span className="team-role">{t('about_m2_role')}</span>
              <p className="team-bio">{t('about_m2_bio')}</p>
            </div>

            {/* Member 3 */}
            <div className="team-card glass-card">
              <div className="team-avatar">AL</div>
              <h3 className="team-name">Anna Lopez</h3>
              <span className="team-role">{t('about_m3_role')}</span>
              <p className="team-bio">{t('about_m3_bio')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
