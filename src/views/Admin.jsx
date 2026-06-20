import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { getCategoryIcon, Icons } from '../components/Icons';

export default function Admin() {
  const {
    currentUser,
    products,
    users,
    events,
    enquiries,
    language,
    setLanguage,
    saveProduct,
    deleteProduct,
    deleteEvent,
    deleteEnquiry,
    showModal,
    addToast
  } = useAppState();

  const { t } = useI18n();

  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Bulk pricing state variables
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkType, setBulkType] = useState('percent-inc');
  const [bulkValue, setBulkValue] = useState('');

  // Individual product inputs map (stores unsaved stock/price input changes)
  const [prodInputs, setProdInputs] = useState({});

  const handleProdInputChange = (id, field, val) => {
    setProdInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: val
      }
    }));
  };

  const saveProductChanges = (product) => {
    const inputs = prodInputs[product.id] || {};
    const newPriceVal = inputs.price !== undefined ? parseFloat(inputs.price) : product.price;
    const newStockVal = inputs.stock !== undefined ? parseInt(inputs.stock) : product.stock;

    if (isNaN(newPriceVal) || newPriceVal <= 0) {
      addToast(t('admin_prod_toast_price_err'), 'error');
      return;
    }
    if (isNaN(newStockVal) || newStockVal < 0) {
      addToast(t('admin_prod_toast_stock_err'), 'error');
      return;
    }

    const updatedProduct = {
      ...product,
      price: newPriceVal,
      stock: newStockVal
    };

    saveProduct(updatedProduct);
    addToast(
      t('admin_prod_toast_update_success')
        .replace('{name}', product.name)
        .replace('{price}', newPriceVal.toLocaleString('en-IN'))
        .replace('{stock}', newStockVal),
      'success'
    );
  };

  const handleBulkPriceAdjustment = () => {
    const valInput = parseFloat(bulkValue);
    if (isNaN(valInput) || valInput <= 0) {
      addToast(t('admin_prod_toast_bulk_val_err'), 'error');
      return;
    }

    let affectedCount = 0;
    products.forEach(p => {
      if (bulkCategory !== 'all' && p.category !== bulkCategory) return;

      let newPrice = p.price;
      if (bulkType === 'percent-inc') {
        newPrice = p.price * (1 + valInput / 100);
      } else if (bulkType === 'percent-dec') {
        newPrice = p.price * (1 - valInput / 100);
      } else if (bulkType === 'fixed-inc') {
        newPrice = p.price + valInput;
      } else if (bulkType === 'fixed-dec') {
        newPrice = p.price - valInput;
      }

      newPrice = Math.max(0, Math.round(newPrice));

      if (newPrice !== p.price) {
        saveProduct({ ...p, price: newPrice });
        affectedCount++;
      }
    });

    if (affectedCount > 0) {
      addToast(t('admin_prod_toast_bulk_success').replace('{count}', affectedCount), 'success');
      setBulkValue('');
    } else {
      addToast(t('admin_prod_toast_bulk_no_match'), 'info');
    }
  };

  const handleProductDelete = (prod) => {
    if (window.confirm(t('admin_prod_confirm_delete').replace('{name}', prod.name))) {
      deleteProduct(prod.id);
      addToast(t('admin_prod_toast_delete_success').replace('{name}', prod.name), 'info');
    }
  };

  const handleEventDelete = (ev) => {
    if (window.confirm(t('admin_ev_confirm_delete').replace('{title}', ev.title))) {
      deleteEvent(ev.id);
      addToast(t('admin_ev_toast_delete_success').replace('{title}', ev.title), 'info');
    }
  };

  const handleEnquiryDelete = (enq) => {
    if (window.confirm(t('admin_enq_confirm_delete').replace('{name}', enq.name))) {
      deleteEnquiry(enq.id);
      addToast(t('admin_enq_toast_delete_success').replace('{name}', enq.name), 'info');
    }
  };

  return (
    <>
      {/* Admin Mobile Header */}
      <div className="admin-mobile-header">
        <button
          className="admin-menu-toggle"
          aria-label="Toggle Navigation"
          onClick={() => setMobileSidebarOpen(prev => !prev)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="admin-mobile-brand">{t('admin_brand_mobile')}</span>
        <a href="#home" className="admin-mobile-back-store-btn" aria-label="Back to Store">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </a>
      </div>

      {mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop open"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <section className="section-padding">
        <div className="container admin-layout">
          {/* Sidebar */}
          <aside className={`admin-sidebar glass-card ${mobileSidebarOpen ? 'open' : ''}`}>
            <div className="admin-user-profile">
              <div className="admin-avatar">
                {currentUser ? currentUser.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="admin-username">{currentUser ? currentUser.username : 'Administrator'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className="admin-role-badge">{t('admin_role')}</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      padding: '1px 3px',
                      cursor: 'pointer',
                      color: 'var(--color-text)',
                      fontWeight: 500
                    }}
                  >
                    <option value="en">EN</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div>
              </div>
            </div>

            <nav className="admin-nav">
              <button
                className={`admin-nav-btn ${activeAdminTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAdminTab('dashboard');
                  setMobileSidebarOpen(false);
                }}
              >
                {Icons.dashboard} {t('admin_tab_overview')}
              </button>
              <button
                className={`admin-nav-btn ${activeAdminTab === 'products' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAdminTab('products');
                  setMobileSidebarOpen(false);
                }}
              >
                {Icons.powerSprayer} {t('admin_tab_products')}
              </button>
              <button
                className={`admin-nav-btn ${activeAdminTab === 'customers' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAdminTab('customers');
                  setMobileSidebarOpen(false);
                }}
              >
                {Icons.users} {t('admin_tab_customers')}
              </button>
              <button
                className={`admin-nav-btn ${activeAdminTab === 'events' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAdminTab('events');
                  setMobileSidebarOpen(false);
                }}
              >
                {Icons.calendar} {t('admin_tab_events')}
              </button>
              <button
                className={`admin-nav-btn ${activeAdminTab === 'enquiries' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAdminTab('enquiries');
                  setMobileSidebarOpen(false);
                }}
              >
                {Icons.mail} {t('admin_tab_enquiries')}
              </button>
            </nav>

            <div className="admin-sidebar-footer">
              <a href="#home" className="admin-footer-btn back-store-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-btn-icon">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{t('admin_view_store')}</span>
              </a>
              <a href="#logout" className="admin-footer-btn logout-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-btn-icon">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>{t('admin_sign_out')}</span>
              </a>
            </div>
          </aside>

          {/* Viewport Content */}
          <div className="admin-main-viewport">
            {activeAdminTab === 'dashboard' && (
              <>
                <div className="admin-view-header">
                  <h2 className="admin-view-title">{t('admin_dash_title')}</h2>
                </div>

                <div className="admin-stats-grid">
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-icon">{Icons.powerSprayer}</div>
                    <div className="admin-stat-details">
                      <h4>{t('admin_dash_models')}</h4>
                      <div className="admin-stat-value">{products.length} {t('admin_suffix_sprayers')}</div>
                    </div>
                  </div>
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-icon">{Icons.users}</div>
                    <div className="admin-stat-details">
                      <h4>{t('admin_dash_farmers')}</h4>
                      <div className="admin-stat-value">{users.length} {t('admin_suffix_accounts')}</div>
                    </div>
                  </div>
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-icon">{Icons.calendar}</div>
                    <div className="admin-stat-details">
                      <h4>{t('admin_dash_events')}</h4>
                      <div className="admin-stat-value">{events.length} {t('admin_suffix_scheduled')}</div>
                    </div>
                  </div>
                  <div className="admin-stat-card glass-card">
                    <div className="admin-stat-icon">{Icons.mail}</div>
                    <div className="admin-stat-details">
                      <h4>{t('admin_dash_enquiries')}</h4>
                      <div className="admin-stat-value">{enquiries.length} {t('admin_suffix_inquiries')}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeAdminTab === 'products' && (
              <>
                <div className="admin-view-header">
                  <h2 className="admin-view-title">{t('admin_prod_title')}</h2>
                  <div className="admin-view-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => setActiveAdminTab('dashboard')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      {t('btn_back')}
                    </button>
                    <button className="btn btn-primary" onClick={() => showModal('add-product')}>
                      {Icons.plus} {t('admin_prod_add')}
                    </button>
                  </div>
                </div>

                {/* Bulk adjustments */}
                <div className="glass-card" style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '16px' }}>
                    {t('admin_prod_bulk_title')}
                  </h3>
                  <div className="admin-bulk-adjust-row">
                    <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>
                        {t('admin_prod_bulk_filter_cat')}
                      </label>
                      <select
                        className="form-select"
                        value={bulkCategory}
                        onChange={(e) => setBulkCategory(e.target.value)}
                        style={{ height: '38px', padding: '0 12px', fontSize: '0.85rem', width: '100%', background: '#fff' }}
                      >
                        <option value="all">{t('All')}</option>
                        <option value="Power Sprayers">{t('Power Sprayers')}</option>
                        <option value="Knapsack Sprayers">{t('Knapsack Sprayers')}</option>
                        <option value="Battery Spray Pumps">{t('Battery Spray Pumps')}</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0, minWidth: '180px' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>
                        {t('admin_prod_bulk_adjust_type')}
                      </label>
                      <select
                        className="form-select"
                        value={bulkType}
                        onChange={(e) => setBulkType(e.target.value)}
                        style={{ height: '38px', padding: '0 12px', fontSize: '0.85rem', width: '100%', background: '#fff' }}
                      >
                        <option value="percent-inc">{t('percent-inc')}</option>
                        <option value="percent-dec">{t('percent-dec')}</option>
                        <option value="fixed-inc">{t('fixed-inc')}</option>
                        <option value="fixed-dec">{t('fixed-dec')}</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0, maxWidth: '120px' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '6px', display: 'block' }}>
                        {t('admin_prod_bulk_val')}
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 5"
                        min="0"
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                        style={{ height: '38px', padding: '0 12px', fontSize: '0.85rem', width: '100%', background: '#fff' }}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleBulkPriceAdjustment}
                      style={{ height: '38px', padding: '0 20px', fontSize: '0.85rem', borderRadius: '8px' }}
                    >
                      {t('admin_prod_bulk_apply')}
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="glass-card">
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('admin_prod_th_name')}</th>
                          <th>{t('admin_prod_th_cat')}</th>
                          <th style={{ width: '160px' }}>{t('admin_prod_th_price')}</th>
                          <th>{t('admin_prod_th_stock')}</th>
                          <th>{t('admin_prod_th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => {
                          const inputs = prodInputs[p.id] || {};
                          const displayPrice = inputs.price !== undefined ? inputs.price : p.price;
                          const displayStock = inputs.stock !== undefined ? inputs.stock : p.stock;

                          return (
                            <tr key={p.id}>
                              <td data-label={t('admin_prod_th_name')}>
                                <div className="admin-table-product-cell">
                                  <div className="admin-table-product-icon">
                                    {p.image ? (
                                      <img src={p.image} alt={p.name} />
                                    ) : (
                                      getCategoryIcon(p.category)
                                    )}
                                  </div>
                                  <div>
                                    <strong>{p.name}</strong>
                                    {p.badge && (
                                      <span style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', marginLeft: '6px' }}>
                                        {t(p.badge) || p.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td data-label={t('admin_prod_th_cat')}>{t(p.category) || p.category}</td>
                              <td data-label={t('admin_prod_th_price')}>
                                <input
                                  type="number"
                                  className="form-input admin-price-adjust-field"
                                  value={displayPrice}
                                  onChange={(e) => handleProdInputChange(p.id, 'price', e.target.value)}
                                  style={{ padding: '6px 10px', fontSize: '0.85rem', width: '110px', textAlign: 'right', fontWeight: 700 }}
                                  step="1"
                                />
                              </td>
                              <td data-label={t('admin_prod_th_stock')}>
                                <input
                                  type="number"
                                  className="form-input admin-stock-adjust-field"
                                  value={displayStock}
                                  onChange={(e) => handleProdInputChange(p.id, 'stock', e.target.value)}
                                  style={{ padding: '6px 10px', fontSize: '0.85rem', width: '70px', textAlign: 'center' }}
                                />
                              </td>
                              <td data-label={t('admin_prod_th_actions')}>
                                <div className="admin-actions-cell">
                                  <button
                                    className="btn-action"
                                    onClick={() => saveProductChanges(p)}
                                    title="Save Changes"
                                    style={{ background: 'rgba(25, 103, 62, 0.05)', color: 'var(--color-primary)' }}
                                  >
                                    {Icons.check}
                                  </button>
                                  <button
                                    className="btn-action btn-action-delete"
                                    onClick={() => handleProductDelete(p)}
                                    title="Delete Sprayer"
                                  >
                                    {Icons.trash}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeAdminTab === 'customers' && (
              <>
                <div className="admin-view-header">
                  <h2 className="admin-view-title">{t('admin_cust_title')}</h2>
                  <button className="btn btn-secondary" onClick={() => setActiveAdminTab('dashboard')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    {t('btn_back')}
                  </button>
                </div>

                <div className="glass-card">
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('admin_cust_th_username')}</th>
                          <th>{t('admin_cust_th_email')}</th>
                          <th>{t('admin_cust_th_date')}</th>
                          <th>{t('admin_cust_th_role')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, idx) => (
                          <tr key={idx}>
                            <td data-label={t('admin_cust_th_username')}><strong>{u.username}</strong></td>
                            <td data-label={t('admin_cust_th_email')}>{u.email}</td>
                            <td data-label={t('admin_cust_th_date')}>{u.joinedDate || '2026-01-01'}</td>
                            <td data-label={t('admin_cust_th_role')}>
                              <span style={{
                                background: u.role === 'admin' ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.05)',
                                color: u.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                {u.role === 'admin' ? t('admin_role') : u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeAdminTab === 'events' && (
              <>
                <div className="admin-view-header">
                  <h2 className="admin-view-title">{t('admin_ev_title')}</h2>
                  <div className="admin-view-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => setActiveAdminTab('dashboard')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      {t('btn_back')}
                    </button>
                    <button className="btn btn-primary" onClick={() => showModal('schedule-event')}>
                      {Icons.plus} {t('admin_ev_btn_schedule')}
                    </button>
                  </div>
                </div>

                <div className="glass-card">
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('admin_ev_th_title')}</th>
                          <th>{t('admin_ev_th_date')}</th>
                          <th>{t('admin_ev_th_loc')}</th>
                          <th>{t('admin_ev_th_desc')}</th>
                          <th>{t('admin_prod_th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(ev => (
                          <tr key={ev.id}>
                            <td data-label={t('admin_ev_th_title')}><strong>{ev.title}</strong></td>
                            <td data-label={t('admin_ev_th_date')}>{ev.date}</td>
                            <td data-label={t('admin_ev_th_loc')}>{ev.location}</td>
                            <td data-label={t('admin_ev_th_desc')} style={{ maxWidth: '250px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {ev.description}
                            </td>
                            <td data-label={t('admin_prod_th_actions')}>
                              <div className="admin-actions-cell">
                                <button
                                  className="btn-action btn-action-delete"
                                  onClick={() => handleEventDelete(ev)}
                                  title="Remove Event"
                                >
                                  {Icons.trash}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {events.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                              {t('admin_ev_empty')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeAdminTab === 'enquiries' && (
              <>
                <div className="admin-view-header">
                  <h2 className="admin-view-title">{t('admin_enq_title')}</h2>
                  <button className="btn btn-secondary" onClick={() => setActiveAdminTab('dashboard')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    {t('btn_back')}
                  </button>
                </div>

                <div className="glass-card">
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('admin_enq_th_name')}</th>
                          <th>{t('admin_enq_th_contact')}</th>
                          <th>{t('admin_enq_th_interest')}</th>
                          <th>{t('admin_enq_th_msg')}</th>
                          <th>{t('admin_enq_th_date')}</th>
                          <th>{t('admin_prod_th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map(enq => (
                          <tr key={enq.id}>
                            <td data-label={t('admin_enq_th_name')}><strong>{enq.name}</strong></td>
                            <td data-label={t('admin_enq_th_contact')}>
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
                                <div>{enq.email}</div>
                                <div style={{ color: 'var(--color-text-muted)' }}>{enq.phone}</div>
                              </div>
                            </td>
                            <td data-label={t('admin_enq_th_interest')}>
                              <span style={{ background: 'rgba(25, 103, 62, 0.05)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {t(enq.interest) || enq.interest}
                              </span>
                            </td>
                            <td data-label={t('admin_enq_th_msg')} style={{ maxWidth: '250px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {enq.message}
                            </td>
                            <td data-label={t('admin_enq_th_date')}>{enq.date}</td>
                            <td data-label={t('admin_prod_th_actions')}>
                              <div className="admin-actions-cell">
                                <button
                                  className="btn-action"
                                  onClick={() => showModal('enquiry-detail', enq)}
                                  title="View Full Message"
                                  style={{ background: 'rgba(25, 103, 62, 0.05)', color: 'var(--color-primary)' }}
                                >
                                  {Icons.info}
                                </button>
                                <button
                                  className="btn-action btn-action-delete"
                                  onClick={() => handleEnquiryDelete(enq)}
                                  title="Delete Enquiry"
                                >
                                  {Icons.trash}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {enquiries.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                              {t('admin_enq_empty')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
