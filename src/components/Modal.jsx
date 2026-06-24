import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { getCategoryIcon, Icons } from './Icons';
import { uploadImageToCloudinary, validateImageFile } from '../utils/cloudinary';

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
        return <AddEditProductModal onClose={hideModal} />;
      case 'edit-product':
        return <AddEditProductModal product={modal.data} onClose={hideModal} />;
      case 'schedule-event':
        return <ScheduleEventModal onClose={hideModal} />;
      case 'enquiry-detail':
        return <EnquiryDetailModal enquiry={modal.data} onClose={hideModal} />;
      case 'add-testimonial':
        return <AddEditTestimonialModal onClose={hideModal} />;
      case 'edit-testimonial':
        return <AddEditTestimonialModal testimonial={modal.data} onClose={hideModal} />;
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
   Add / Edit Product Modal (with Cloudinary Upload)
   ========================================== */
function AddEditProductModal({ product, onClose }) {
  const { t } = useI18n();
  const { saveProduct, addToast } = useAppState();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'Power Sprayers');
  const [price, setPrice] = useState(product?.price || '');
  const [stock, setStock] = useState(product?.stock ?? '');
  const [flow, setFlow] = useState(product?.specs?.['Flow Rate'] || '');
  const [press, setPress] = useState(product?.specs?.['Working Pressure'] || '');
  const [desc, setDesc] = useState(product?.description || '');
  const [badge, setBadge] = useState(product?.badge || 'New');

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(product?.cloudinaryPublicId || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      addToast(validation.error, 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, [addToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(isEdit ? product?.image : null);
    setCloudinaryPublicId(isEdit ? product?.cloudinaryPublicId : null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (!name || isNaN(parsedPrice) || isNaN(parsedStock) || !desc) {
      addToast(t('admin_modal_add_toast_incomplete'), 'error');
      return;
    }

    let finalImageUrl = product?.image || '/images/power_sprayer.png';
    let finalPublicId = product?.cloudinaryPublicId || null;

    // Upload to Cloudinary if a new file was selected
    if (imageFile) {
      setUploading(true);
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 85));
      }, 200);
      try {
        const result = await uploadImageToCloudinary(imageFile, 'mech_corner_products');
        finalImageUrl = result.url;
        finalPublicId = result.publicId;
        clearInterval(progressInterval);
        setUploadProgress(100);
      } catch (err) {
        clearInterval(progressInterval);
        setUploading(false);
        setUploadProgress(0);
        addToast('Image upload failed: ' + err.message, 'error');
        return;
      }
      setUploading(false);
    } else if (!imagePreview && !isEdit) {
      // No image selected for new product — use category default
      if (category === 'Knapsack Sprayers') finalImageUrl = '/images/knapsack_sprayer.png';
      else if (category === 'Battery Spray Pumps') finalImageUrl = '/images/battery_sprayer.png';
      else finalImageUrl = '/images/power_sprayer.png';
    }

    const savedProduct = {
      id: product?.id || 'prod-' + Date.now(),
      name,
      category,
      price: parsedPrice,
      stock: parsedStock,
      image: finalImageUrl,
      cloudinaryPublicId: finalPublicId,
      specs: {
        'Flow Rate': flow || 'N/A',
        'Working Pressure': press || 'N/A',
        ...(product?.specs || {}),
        ...(flow ? { 'Flow Rate': flow } : {}),
        ...(press ? { 'Working Pressure': press } : {}),
      },
      description: desc,
      badge: badge || 'New',
    };

    await saveProduct(savedProduct);
    addToast(
      isEdit
        ? `Product "${name}" updated successfully!`
        : (t('admin_modal_add_toast_success') || 'Product created!').replace('{name}', name),
      'success'
    );
    onClose();
  };

  const defaultFallbackImage = () => {
    if (category === 'Knapsack Sprayers') return '/images/knapsack_sprayer.png';
    if (category === 'Battery Spray Pumps') return '/images/battery_sprayer.png';
    return '/images/power_sprayer.png';
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-primary)', marginBottom: '20px' }}>
        {isEdit ? `Edit Product: ${product.name}` : (t('admin_modal_add_title') || 'Add New Product')}
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">

        {/* ── Image Upload Zone ── */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Product Image</label>

          {/* Preview */}
          {imagePreview && (
            <div style={{ position: 'relative', marginBottom: '12px', display: 'inline-block' }}>
              <img
                src={imagePreview}
                alt="Preview"
                onError={(e) => { e.target.src = defaultFallbackImage(); }}
                style={{
                  width: '160px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '2px solid var(--color-primary)',
                  display: 'block',
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--color-error, #e53e3e)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  padding: 0,
                  fontWeight: 700,
                }}
                title="Remove image"
              >×</button>
              {cloudinaryPublicId && (
                <span style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: 'var(--color-primary)',
                  marginTop: '4px',
                  fontWeight: 600,
                }}>☁ Stored on Cloudinary</span>
              )}
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? 'var(--color-primary)' : 'rgba(25,103,62,0.3)'}`,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragOver ? 'rgba(25,103,62,0.05)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '6px' }}>📷</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {imageFile ? `✓ ${imageFile.name}` : 'Drag & drop or click to upload image'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              JPG, PNG, WebP or AVIF · Max 5MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); }}
          />

          {/* Upload Progress Bar */}
          {uploading && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: 'var(--color-primary)', fontWeight: 600 }}>
                <span>Uploading to Cloudinary…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                  borderRadius: '999px',
                  transition: 'width 0.2s ease',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Fields ── */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_name') || 'Product Name'}</label>
            <input type="text" className="form-input" placeholder="e.g. Lu Shyoung LS-30N" required
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_cat') || 'Category'}</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Power Sprayers">{t('Power Sprayers') || 'Power Sprayers'}</option>
              <option value="Knapsack Sprayers">{t('Knapsack Sprayers') || 'Knapsack Sprayers'}</option>
              <option value="Battery Spray Pumps">{t('Battery Spray Pumps') || 'Battery Spray Pumps'}</option>
              <option value="HDPE Pipes">HDPE Pipes</option>
              <option value="MDPE Pipes">MDPE Pipes</option>
              <option value="Electrofusion Fittings">Electrofusion Fittings</option>
              <option value="Moulded Fittings">Moulded Fittings</option>
              <option value="Fabricated Fittings">Fabricated Fittings</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_price') || 'Price (₹)'}</label>
            <input type="number" className="form-input" placeholder="28000" required
              value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_stock') || 'Stock Qty'}</label>
            <input type="number" className="form-input" placeholder="10" required
              value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>

        <div className="form-grid-2" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_flow') || 'Flow Rate'}</label>
            <input type="text" className="form-input" placeholder="e.g. 30 L/min"
              value={flow} onChange={(e) => setFlow(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_add_press') || 'Working Pressure'}</label>
            <input type="text" className="form-input" placeholder="e.g. 15-45 kgf/cm²"
              value={press} onChange={(e) => setPress(e.target.value)} />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">Badge Label</label>
          <input type="text" className="form-input" placeholder="e.g. Best Seller, New Arrival, Premium"
            value={badge} onChange={(e) => setBadge(e.target.value)} />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_add_desc') || 'Description'}</label>
          <textarea className="form-textarea" rows="4" placeholder="Enter full specifications and suitability..." required
            value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading Image…' : (isEdit ? 'Save Changes' : (t('admin_modal_add_btn_create') || 'Create Product'))}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={uploading}>
            {t('admin_modal_add_btn_cancel') || 'Cancel'}
          </button>
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

/* ==========================================
   Add/Edit Testimonial Modal
   ========================================== */
function AddEditTestimonialModal({ testimonial, onClose }) {
  const { t } = useI18n();
  const { saveTestimonial, addToast } = useAppState();

  const isEdit = !!testimonial;
  const [name, setName] = useState(testimonial ? testimonial.name : '');
  const [avatar, setAvatar] = useState(testimonial ? testimonial.avatar : '');
  const [role, setRole] = useState(testimonial ? testimonial.role : '');
  const [quote, setQuote] = useState(testimonial ? testimonial.quote : '');

  // Auto-generate avatar initials when name changes
  useEffect(() => {
    if (!isEdit && name) {
      const parts = name.trim().split(/\s+/);
      let initials = '';
      if (parts.length > 0) {
        initials += parts[0][0] || '';
      }
      if (parts.length > 1) {
        initials += parts[parts.length - 1][0] || '';
      }
      setAvatar(initials.toUpperCase().slice(0, 2));
    }
  }, [name, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !avatar || !role || !quote) {
      addToast('Please fill out all fields.', 'error');
      return;
    }

    const updatedTestimonial = {
      id: testimonial ? testimonial.id : "test-" + Date.now(),
      name,
      avatar: avatar.toUpperCase().slice(0, 2),
      role,
      quote
    };

    saveTestimonial(updatedTestimonial);
    addToast(isEdit ? 'Successfully updated testimonial.' : 'Successfully added testimonial.', 'success');
    onClose();
  };

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-primary)', marginBottom: '24px' }}>
        {isEdit ? t('admin_modal_edit_test_title') || 'Edit Testimonial' : t('admin_modal_add_test_title') || 'Add Testimonial'}
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">{t('admin_modal_test_name') || 'Customer Name'}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Raj Patel"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin_modal_test_avatar') || 'Avatar Initials'}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. RP"
              maxLength="2"
              required
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_test_role') || 'Customer Role / Details'}</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Organic Vegetable Farmer"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">{t('admin_modal_test_quote') || 'Quote / Success Story'}</label>
          <textarea
            className="form-textarea"
            rows="5"
            placeholder="Enter the customer's quote..."
            required
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary">
            {isEdit ? t('admin_modal_test_btn_save') || 'Save Changes' : t('admin_modal_test_btn_create') || 'Create Testimonial'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('admin_modal_add_btn_cancel') || 'Cancel'}
          </button>
        </div>
      </form>
    </>
  );
}
