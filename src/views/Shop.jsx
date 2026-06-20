import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { useI18n } from '../utils/i18n';
import { getCategoryIcon } from '../components/Icons';

export default function Shop({ query }) {
  const { products, showModal } = useAppState();
  const { t } = useI18n();

  // Category and Sorting state
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSort, setCurrentSort] = useState('price-low');
  
  // Custom dropdown states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Load category from query parameters if present
  useEffect(() => {
    if (query && query.category) {
      setActiveCategory(decodeURIComponent(query.category));
    }
  }, [query]);

  const categoriesList = [
    'All',
    'HDPE Pipes',
    'MDPE Pipes',
    'Electrofusion Fittings',
    'Moulded Fittings',
    'Fabricated Fittings',
    'Power Sprayers',
    'Knapsack Sprayers',
    'Battery Spray Pumps'
  ];

  // Count helper
  const getProductCount = (cat) => {
    if (cat === 'All') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  // Sort labels
  const sortLabels = {
    'price-low': t('price-low'),
    'price-high': t('price-high'),
    'name-az': t('name-az'),
    'name-za': t('name-za'),
    'category': t('category-wise')
  };

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let list = [...products];
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    list.sort((a, b) => {
      if (currentSort === 'price-low') return a.price - b.price;
      if (currentSort === 'price-high') return b.price - a.price;
      if (currentSort === 'name-az') return a.name.localeCompare(b.name);
      if (currentSort === 'name-za') return b.name.localeCompare(a.name);
      if (currentSort === 'category') {
        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) return catCompare;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    return list;
  };

  const filteredProducts = getFilteredProducts();

  // Handle document click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setCategoryOpen(false);
      setSortOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <section className="section-padding shop-section">
      <div className="container shop-container">
        <div className="shop-hero">
          {/* Sidebar Filters */}
          <aside className="shop-filters-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="glass-card">
              <h3 className="filter-group-title">{t('shop_categories_title')}</h3>
              <div className={`category-select-wrapper ${categoryOpen ? 'open' : ''}`}>
                <button
                  className="category-filter-select"
                  aria-expanded={categoryOpen ? 'true' : 'false'}
                  onClick={() => {
                    setCategoryOpen(prev => !prev);
                    setSortOpen(false);
                  }}
                >
                  <span>{t(activeCategory)} ({getProductCount(activeCategory)})</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="category-options-list">
                  {categoriesList.map((cat, idx) => (
                    <button
                      key={idx}
                      className={`category-option ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCategoryOpen(false);
                      }}
                    >
                      <span>{t(cat)}</span>
                      <span className="category-count">{getProductCount(cat)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="section-title-wrapper shop-title-wrapper">
            <span className="section-subtitle">{t('shop_subtitle')}</span>
            <h1 className="section-title">{t('shop_title')}</h1>
            <p className="section-desc">{t('shop_desc')}</p>
          </div>

          {/* Sort Dropdown */}
          <div className="shop-hero-sort" onClick={(e) => e.stopPropagation()}>
            <div className="glass-card">
              <h3 className="filter-group-title">{t('shop_sort_title')}</h3>
              <div className={`category-select-wrapper ${sortOpen ? 'open' : ''}`}>
                <button
                  className="category-filter-select"
                  aria-expanded={sortOpen ? 'true' : 'false'}
                  onClick={() => {
                    setSortOpen(prev => !prev);
                    setCategoryOpen(false);
                  }}
                >
                  <span>{sortLabels[currentSort] || t('sort-default')}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="category-options-list">
                  {Object.entries(sortLabels).map(([key, value]) => (
                    <button
                      key={key}
                      className={`category-option ${currentSort === key ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentSort(key);
                        setSortOpen(false);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="shop-layout">
          <div className="shop-main-content">
            <div className="shop-products-grid">
              {filteredProducts.length === 0 ? (
                <div className="shop-no-results">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <h3>{t('shop_no_results_title')}</h3>
                  <p>{t('shop_no_results_desc')}</p>
                </div>
              ) : (
                filteredProducts.map(prod => {
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
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '0.8rem', width: '100%' }}
                          >
                            {t('btn_get_quote')}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
