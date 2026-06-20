import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { getCategoryIcon, Icons } from './Icons';

export default function Modal() {
  const { modal, hideModal } = useAppState();

  // Background body scrolling lock
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modal]);

  if (!modal) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      hideModal();
    }
  };

  const renderModalContent = () => {
    switch (modal.type) {
      case 'product-detail':
        return <ProductDetailModal product={modal.data} onClose={hideModal} />;
      case 'add-product':
        return <AddProductModal onClose={hideModal} />;
      case 'schedule-event':
        return <ScheduleEventModal onClose={hideModal} />;
      case 'enquiry-detail':
        return <EnquiryDetailModal enquiry={modal.data} onClose={hideModal} />;
      default:
        return null;
    }
  };

  return (
    <div
      id="modal-overlay"
      className="modal-overlay open"
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <button
          className="modal-close-btn"
          aria-label="Close Dialog"
          onClick={hideModal}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="modal-content">
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   Product Detail Modal
   ========================================== */
function ProductDetailModal({ product, onClose }) {
  const { t } = useI18n();
  if (!product) return null;

  const specsRows = Object.entries(product.specs).map(([key, val]) => (
    <tr key={key}>
      <td>{t(key)}</td>
      <td>{val}</td>
    </tr>
  ));

  return (
    <div className="product-detail-modal-layout">
      <div className="product-detail-img-wrapper">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          getCategoryIcon(product.category)
        )}
      </div>
      <div className="product-detail-info">
        <span className="product-detail-category">{t(product.category)}</span>
        <h2 className="product-detail-title">{product.name}</h2>
        <p className="product-detail-desc">{t(product.id + '_desc') || product.description}</p>
        
        <h4 style={{ marginTop: '12px', color: 'var(--color-primary)' }}>{t('Technical Specifications')}</h4>
        <table className="product-detail-specs-table">
          <tbody>
            {specsRows}
            <tr>
              <td>{t('Stock Status')}</td>
              <td>
                {product.stock > 0 ? (
                  `${product.stock} ${t('units available')}`
                ) : (
                  <span style={{ color: 'var(--color-error)' }}>{t('Out of Stock')}</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="product-detail-actions">
          <a
            href={`#contact?product=${encodeURIComponent(product.name)}`}
            className="btn btn-primary"
            onClick={onClose}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
          >
            {t('btn_get_quote')}
          </a>
          <button className="btn btn-secondary" onClick={onClose}>{t('btn_close')}</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   Add Product Modal
   ========================================== */
function AddProductModal({ onClose }) {
  const { t } = useI18n();
  const { saveProduct, addToast } = useAppState();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Power Sprayers');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [flow, setFlow] = useState('');
  const [press, setPress] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (!name || isNaN(parsedPrice) || isNaN(parsedStock) || !desc) {
      addToast(t('admin_modal_add_toast_incomplete'), 'error');
      return;
    }

    let imagePath = "/images/power_sprayer.png";
    if (category === "Knapsack Sprayers") imagePath = "/images/knapsack_sprayer.png";
    if (category === "Battery Spray Pumps") imagePath = "/images/battery_sprayer.png";

    const newProduct = {
      id: "prod-" + Date.now(),
      name,
      category,
      price: parsedPrice,
      stock: parsedStock,
      image: imagePath,
      specs: {
        "Flow Rate": flow || "N/A",
        "Working Pressure": press || "N/A"
      },
      description: desc,
      badge: "New"
    };

    saveProduct(newProduct);
    addToast(t('admin_modal_add_toast_success').replace('{name}', name), 'success');
    onClose();
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-primary)', marginBottom: '24px' }}>
        {t('admin_modal_add_title')}
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_name')}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Lu Shyoung LS-30N"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_cat')}</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Power Sprayers">{t('Power Sprayers')}</option>
              <option value="Knapsack Sprayers">{t('Knapsack Sprayers')}</option>
              <option value="Battery Spray Pumps">{t('Battery Spray Pumps')}</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_price')}</label>
            <input
              type="number"
              className="form-input"
              placeholder="28000"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_stock')}</label>
            <input
              type="number"
              className="form-input"
              placeholder="10"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_add_flow')}</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 30 L/min"
            value={flow}
            onChange={(e) => setFlow(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_add_press')}</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 15-45 kgf/cm²"
            value={press}
            onChange={(e) => setPress(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_add_desc')}</label>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Enter full specifications and suitability..."
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary">{t('admin_modal_add_btn_create')}</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>{t('admin_modal_add_btn_cancel')}</button>
        </div>
      </form>
    </>
  );
}

/* ==========================================
   Schedule Event Modal
   ========================================== */
function ScheduleEventModal({ onClose }) {
  const { t } = useI18n();
  const { saveEvent, addToast } = useAppState();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !location || !description) {
      addToast(t('admin_modal_ev_toast_incomplete'), 'error');
      return;
    }

    const newEvent = {
      id: "ev-" + Date.now(),
      title,
      date,
      location,
      description,
      badge: "Promo"
    };

    saveEvent(newEvent);
    addToast(t('admin_modal_ev_toast_success').replace('{title}', title), 'success');
    onClose();
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-primary)', marginBottom: '24px' }}>
        {t('admin_modal_ev_title')}
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">{t('admin_modal_ev_name')}</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Agri-Showroom Live Demonstration"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-grid-2" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_ev_date')}</label>
            <input
              type="date"
              className="form-input"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_ev_loc')}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hub Center / Virtual"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_ev_desc')}</label>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Enter details..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary">{t('admin_modal_ev_btn_publish')}</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>{t('admin_modal_add_btn_cancel')}</button>
        </div>
      </form>
    </>
  );
}

/* ==========================================
   Enquiry Details Modal
   ========================================== */
function EnquiryDetailModal({ enquiry, onClose }) {
  const { t } = useI18n();
  if (!enquiry) return null;

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-primary)', marginBottom: '16px' }}>
        {t('admin_modal_enq_title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--color-text)' }}>
        <div>
          <strong>{t('admin_modal_enq_from')}</strong> {enquiry.name}
        </div>
        <div className="enquiry-details-meta-grid">
          <div>
            <strong>{t('admin_modal_enq_email')}</strong> <a href={`mailto:${enquiry.email}`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{enquiry.email}</a>
          </div>
          <div>
            <strong>{t('admin_modal_enq_phone')}</strong> {enquiry.phone}
          </div>
        </div>
        <div>
          <strong>{t('admin_modal_enq_interest')}</strong> <span style={{ background: 'rgba(25, 103, 62, 0.05)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>{t(enquiry.interest) || enquiry.interest}</span>
        </div>
        <div>
          <strong>{t('admin_modal_enq_date')}</strong> {enquiry.date}
        </div>
        <hr style={{ border: 0, borderTop: '1px solid rgba(0,0,0,0.08)', margin: '8px 0' }} />
        <div>
          <strong>{t('admin_modal_enq_msg')}</strong>
          <p style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: 'var(--glass-border)', marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {enquiry.message}
          </p>
        </div>
        <div className="enquiry-details-actions">
          <a
            href={`mailto:${enquiry.email}?subject=Re: Mech Corner Enquiry regarding ${encodeURIComponent(t(enquiry.interest) || enquiry.interest)}`}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            {Icons.mail} {t('admin_modal_enq_btn_reply')}
          </a>
          <button type="button" className="btn btn-secondary" onClick={onClose}>{t('btn_close')}</button>
        </div>
      </div>
    </>
  );
}
