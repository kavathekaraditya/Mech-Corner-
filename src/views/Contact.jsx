import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { Icons } from '../components/Icons';

export default function Contact({ query }) {
  const { products, saveEnquiry, addToast } = useAppState();
  const { t } = useI18n();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('general');
  const [message, setMessage] = useState('');

  // Form Errors State
  const [errors, setErrors] = useState({ name: false, email: false, phone: false, message: false });

  // Map pin tooltip toggle
  const [mapTooltipOpen, setMapTooltipOpen] = useState(false);

  // Prepopulate form if redirected with ?product=XXX
  useEffect(() => {
    if (query && query.product) {
      const prodName = decodeURIComponent(query.product);
      setMessage(t('contact_initial_msg').replace('{product}', prodName));
      
      const matchedProd = products.find(
        p => p.name.toLowerCase() === prodName.toLowerCase() || p.id.toLowerCase() === prodName.toLowerCase()
      );
      if (matchedProd) {
        if (matchedProd.category === "Power Sprayers") setInterest("power");
        else if (matchedProd.category === "Knapsack Sprayers") setInterest("knapsack");
        else if (matchedProd.category === "Battery Spray Pumps") setInterest("battery");
      }
    }
  }, [query, products]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { name: false, email: false, phone: false, message: false };

    // Name Validate (min 3 chars)
    if (!name || name.trim().length < 3) {
      newErrors.name = true;
      isValid = false;
    }

    // Email Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = true;
      isValid = false;
    }

    // Phone Validate (Optional, but if filled must be 10-15 digits)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone.trim())) {
      newErrors.phone = true;
      isValid = false;
    }

    // Message Validate (min 10 chars)
    if (!message || message.trim().length < 10) {
      newErrors.message = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const interestLabelMap = {
        general: t('contact_interest_general'),
        power: t('contact_interest_power'),
        knapsack: t('contact_interest_knapsack'),
        battery: t('contact_interest_battery')
      };

      const newEnquiry = {
        id: "enq-" + Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "N/A",
        interest: interestLabelMap[interest] || 'General Support / Parts',
        message: message.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      saveEnquiry(newEnquiry);
      addToast(t('contact_toast_success').replace('{name}', name), 'success');
      
      // Reset Form
      setName('');
      setEmail('');
      setPhone('');
      setInterest('general');
      setMessage('');
    } else {
      addToast(t('contact_toast_error'), 'error');
    }
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('contact_subtitle')}</span>
          <h1 className="section-title">{t('contact_title')}</h1>
          <p className="section-desc">{t('contact_desc')}</p>
        </div>

        <div className="contact-layout">
          {/* Inquiry Form */}
          <div className="glass-card contact-form-wrapper">
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '12px' }}>
              {t('contact_form_title')}
            </h3>
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">{t('contact_name')}</label>
                  <input
                    type="text"
                    id="contact-name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <div className="form-error-msg">{t('contact_err_name')}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">{t('contact_email')}</label>
                  <input
                    type="email"
                    id="contact-email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="e.g. john@farm.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="form-error-msg">{t('contact_err_email')}</div>
                  )}
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label htmlFor="contact-phone" className="form-label">{t('contact_phone')}</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.phone && (
                    <div className="form-error-msg">{t('contact_err_phone')}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="contact-interest" className="form-label">{t('contact_interest')}</label>
                  <select
                    id="contact-interest"
                    className="form-select"
                    aria-label="Select equipment of interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option value="general">{t('contact_interest_general')}</option>
                    <option value="power">{t('contact_interest_power')}</option>
                    <option value="knapsack">{t('contact_interest_knapsack')}</option>
                    <option value="battery">{t('contact_interest_battery')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label htmlFor="contact-message" className="form-label">{t('contact_message')}</label>
                <textarea
                  id="contact-message"
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  rows="5"
                  placeholder="Specify model questions or custom sprayer setups..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && (
                  <div className="form-error-msg">{t('contact_err_message')}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', alignSelf: 'flex-start' }}>
                {t('btn_submit')}
              </button>
            </form>
          </div>

          {/* Info cards and Map Simulation */}
          <div className="contact-info-cards">
            <div className="contact-info-card glass-card">
              <div className="contact-card-icon">{Icons.phone}</div>
              <div className="contact-card-info">
                <h4>{t('contact_card_phone_title')}</h4>
                <p>+1 (555) 309-8080</p>
                <p style={{ fontSize: '0.85rem' }}>{t('contact_card_phone_hours')}</p>
              </div>
            </div>

            <div className="contact-info-card glass-card">
              <div className="contact-card-icon">{Icons.mail}</div>
              <div className="contact-card-info">
                <h4>{t('contact_card_email_title')}</h4>
                <p>support@mechcorner.com</p>
                <p style={{ fontSize: '0.85rem' }}>{t('contact_card_email_hours')}</p>
              </div>
            </div>

            <div className="contact-info-card glass-card">
              <div className="contact-card-icon">{Icons.map}</div>
              <div className="contact-card-info">
                <h4>{t('contact_card_map_title')}</h4>
                <p>102 Orchard Lane, Agri Industrial Hub, TX 75001</p>
                <p style={{ fontSize: '0.85rem' }}>{t('contact_card_map_desc')}</p>
              </div>
            </div>

            {/* Simulated Map Canvas */}
            <div className="map-canvas-container" onClick={() => setMapTooltipOpen(false)}>
              <div className="simulated-map" id="simulated-map-container">
                <div className="map-grid-lines"></div>
                
                {/* Pulsing Coordinates Red Pin */}
                <div
                  className="map-pin"
                  id="map-interactive-pin"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMapTooltipOpen(prev => !prev);
                  }}
                >
                  <div className="map-pin-pulse"></div>
                  <div className="map-pin-dot"></div>
                </div>

                {/* Info Tooltip box overlay */}
                {mapTooltipOpen && (
                  <div className="map-popup" style={{ display: 'block' }}>
                    <div className="map-popup-title">Mech Corner HQ</div>
                    <div>102 Orchard Lane</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '4px' }}>Click to Hide</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
