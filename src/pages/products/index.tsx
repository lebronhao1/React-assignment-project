import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PricingOption } from '../../store/productsSlice';
import { 
  setProducts,
  updateFiltersAndApply,
  resetFilters,
  setSortBy,
  applyFilters,
  setLoading,
  setPriceRange
} from '../../store/productsSlice';
import { fetchProducts } from '../../api/products';
import { RootState } from '../../store';
import './styles.scss';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const {
    filteredProducts,
    filters: selectedPricingOptions,
    searchTerm,
    sortBy,
    loading,
    error,
    priceRange
  } = useSelector((state: RootState) => state.products);

  const initializePage = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      // First load products
      const products = await fetchProducts();
      dispatch(setProducts(products));

      // Then process URL parameters
      const params = new URLSearchParams(window.location.search);
      const searchTerm = decodeURIComponent(params.get('search') || '');
      const filters = {
        Paid: params.get('paid') === 'true',
        Free: params.get('free') === 'true',
        ViewOnly: params.get('viewOnly') === 'true'
      };

      console.log('Initializing from URL with products loaded:', { 
        filters, 
        searchTerm,
        productsCount: products.length
      });

      // Apply filters only after products are loaded
      dispatch(updateFiltersAndApply({ filters, searchTerm }));
    } catch (err) {
      console.error('Failed to initialize page:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    initializePage();
  }, [initializePage]);

  const handlePricingOptionChange = (option: keyof typeof selectedPricingOptions) => {
    dispatch(setLoading(true));
    try {
      const updatedFilters = {
        ...selectedPricingOptions,
        [option]: !selectedPricingOptions[option]
      };
      dispatch(updateFiltersAndApply({ 
        filters: updatedFilters, 
        searchTerm,
        priceRange 
      }));

      // Update URL
      const params = new URLSearchParams();
      params.set('paid', String(updatedFilters.Paid));
      params.set('free', String(updatedFilters.Free));
      params.set('viewOnly', String(updatedFilters.ViewOnly));
      params.set('search', searchTerm);
      window.history.pushState({}, '', `?${params.toString()}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResetFilters = () => {
    dispatch(setLoading(true));
    try {
      dispatch(resetFilters());
    } finally {
      dispatch(setLoading(false));
    }
    window.history.pushState({}, '', window.location.pathname);
  };

  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    dispatch(setLoading(true));
    try {
      dispatch(updateFiltersAndApply({
        filters: selectedPricingOptions,
        searchTerm,
        priceRange: newRange
      }));
      
      const params = new URLSearchParams();
      params.set('paid', String(selectedPricingOptions.Paid));
      params.set('free', String(selectedPricingOptions.Free));
      params.set('viewOnly', String(selectedPricingOptions.ViewOnly));
      params.set('search', searchTerm);
      window.history.pushState({}, '', `?${params.toString()}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value;
    dispatch(setLoading(true));
    try {
      value = e.target.value;
      dispatch(updateFiltersAndApply({ filters: selectedPricingOptions, searchTerm: value }));
    } finally {
      dispatch(setLoading(false));
    }
    
    // Update URL
    const params = new URLSearchParams();
    params.set('paid', String(selectedPricingOptions.Paid));
    params.set('free', String(selectedPricingOptions.Free));
    params.set('viewOnly', String(selectedPricingOptions.ViewOnly));
    params.set('search', value);
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  if (loading) return (
    <div className="products-container">
      {/* Keep existing header */}
      <header className="header">
         <div className="logo">
            <span>CONNET</span>
          </div>
        <div className="header-top">
          <div className="search-bar">
            <div className="search-placeholder">
              <span className="search-icon"></span>
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <div className="filter-label">
            Pricing option
          </div>
          <div className="filter-options">
            <div className="filter-placeholder"></div>
          </div>
        </div>
      </header>

      {/* Skeleton product cards */}
      <div className="products-container">
          <div className="sort-dropdown">
            <div className="sort-placeholder"></div>
          </div>
           <div className="products-grid">
       
        {[...Array(8)].map((_, i) => (
          <div key={i} className="product-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
      </div>
     
    </div>
  );
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="products-container">
      {/* Header Section */}
      <header className="header">
         <div className="logo">
            <span>&nbsp;&nbsp;&nbsp;CONNET</span>
          </div>
        <div className="header-top">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Find the Items you're looking for"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="search-icon"></span>
          </div>
        </div>
        <div className="header-separator" />
        <div className="header-bottom">
          <div className="filter-label">
            Pricing option
          </div>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={selectedPricingOptions.Paid}
                onChange={() => handlePricingOptionChange('Paid')}
              />
              Paid
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedPricingOptions.Free}
                onChange={() => handlePricingOptionChange('Free')}
              />
              Free
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedPricingOptions.ViewOnly}
                onChange={() => handlePricingOptionChange('ViewOnly')}
              />
              View Only
            </label>

{selectedPricingOptions.Paid && (
              <div className="price-range-slider">
                 <div className='min-price-label'>${priceRange.min}</div>
                <div className="dual-slider">
                 
                  <input
                    type="range"
                    min="0"
                    max="999"
                    value={priceRange.min}
                    onChange={(e) => {
                      const newMin = Math.min(Number(e.target.value), priceRange.max - 1);
                      dispatch(setPriceRange({ min: newMin, max: priceRange.max }));
                      
                        dispatch(applyFilters());
                    
                      
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="999"
                    value={priceRange.max}
                    onChange={(e) => {
                      const newMax = Math.max(Number(e.target.value), priceRange.min + 1);
                      dispatch(setPriceRange({ min: priceRange.min, max: newMax }));
                      dispatch(applyFilters());
                    }}
                  />
                  
                </div>
                <div className='max-price-label'>${priceRange.max}</div>
              </div>
            )}

            <button className="reset-button" onClick={handleResetFilters}>Reset</button>
          </div>
          
        </div>
      </header>

      {/* Products Grid */}
      <div className='products-container'>
      <div className="sort-dropdown">
        <span className="sort-label">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => {
                dispatch(setLoading(true));
                try {
                  dispatch(setSortBy(e.target.value as 'name' | 'higherPrice' | 'lowerPrice'));
                  dispatch(applyFilters());
                } finally {
                  dispatch(setLoading(false));
                }
              }}
            >
              <option value="name">Item Name</option>
              <option value="higherPrice">Higher Price</option>
              <option value="lowerPrice">Lower Price</option>
            </select>
          </div>
      <div className="products-grid">
        {filteredProducts?.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.photo||product.imagePath} alt={product.title} />
              <div className="product-details">
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>By {product.userName}</p>
                </div>
                <div className="pricing-info">
                  {product.pricingOption === PricingOption.PAID ? (
                    <span className="price">{product.price}</span>
                  ) : product.pricingOption === PricingOption.FREE ? (
                    <span className="free-label">FREE</span>
                  ) : (
                    <span className="view-only-label">View Only</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <div className="no-products">No products found matching your filters</div>
        )}
      </div>
      </div>
    </div>
  );
}
