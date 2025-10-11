import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setFilters, 
  setSearchTerm, 
  applyFilters, 
  resetFilters 
} from '../../store/productsSlice';
import { RootState } from '../../store';
import './styles.scss';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const {
    filteredProducts,
    filters: selectedPricingOptions,
    searchTerm,
    loading,
    error
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch(setFilters({
      Paid: params.get('Paid') === 'true',
      Free: params.get('Free') === 'true',
      ViewOnly: params.get('ViewOnly') === 'true'
    }));
    dispatch(setSearchTerm(params.get('search') || ''));
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedPricingOptions.Paid) params.set('Paid', 'true');
    if (selectedPricingOptions.Free) params.set('Free', 'true');
    if (selectedPricingOptions.ViewOnly) params.set('ViewOnly', 'true');
    if (searchTerm) params.set('search', searchTerm);
    window.history.pushState({}, '', `?${params.toString()}`);
    dispatch(applyFilters());
  }, [dispatch, selectedPricingOptions, searchTerm]);

  const handlePricingOptionChange = (option: keyof typeof selectedPricingOptions) => {
    dispatch(setFilters({
      ...selectedPricingOptions,
      [option]: !selectedPricingOptions[option]
    }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <span>CONNET</span>
          </div>
          <div className="search-bar">
            <span className="search-label">Find the Items you're looking for</span>
            <input
              type="text"
              placeholder="Find the Items you're looking for"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="search-icon">🍽️</span>
          </div>
          <button className="reset-button" onClick={handleResetFilters}>Reset</button>
        </div>
        <div className="header-separator" />
        <div className="header-bottom">
          <div className="filter-label">
            <span className="filter-icon">①</span>
            Contents Filter
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
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.photo} alt={product.title} />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p>By {product.userName}</p>
              <p>
                {product.pricingOption === 'Paid'
                  ? `$${product.price}`
                  : product.pricingOption}
              </p>
            </div>
            <button className="more-options">More Options</button>
          </div>
        ))}
      </div>
    </div>
  );
}
