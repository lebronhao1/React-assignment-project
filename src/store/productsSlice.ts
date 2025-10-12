import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const MAX_PRICE = 9999;

export enum PricingOption {
  PAID = 0,
  FREE = 1,
  VIEW_ONLY = 2
}

export type Product = {
  id: string;
  photo: string;
  imagePath: string;
  userName: string;
  title: string;
  pricingOption: PricingOption;
  price?: number;
};

type SortByOption = 'name' | 'higherPrice' | 'lowerPrice';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: {
    Paid: boolean;
    Free: boolean;
    ViewOnly: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
  searchTerm: string;
  sortBy: SortByOption;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  filters: {
    Paid: false,
    Free: false,
    ViewOnly: false
  },
  priceRange: {
    min: 0,
    max: MAX_PRICE
  },
  searchTerm: '',
  sortBy: 'name',
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      console.log('Initial products data:', action.payload);
      state.products = action.payload;
      // Show all products initially with no price filtering
      // Validate and safely sort products
      if (!Array.isArray(action.payload)) {
        console.error('Invalid products data:', action.payload);
        state.products = [];
        state.filteredProducts = [];
        return;
      }

      const validProducts = action.payload.filter(p => p?.title);
      state.filteredProducts = [...validProducts].sort((a, b) => 
        (a.title || '').localeCompare(b.title || '')
      );
      console.log('Initial filtered products:', state.filteredProducts);
      state.loading = false;
    },
    setFilters(state, action: PayloadAction<{ 
      Paid: boolean; 
      Free: boolean; 
      ViewOnly: boolean 
    }>) {
      state.loading = true;
      state.filters = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.loading = true;
      state.searchTerm = action.payload;
    },
    applyFilters(state) {
      state.loading = false;
      const { Paid, Free, ViewOnly } = state.filters;
      const hasFilters = Paid || Free || ViewOnly;
      const searchTerm = state.searchTerm.trim();
      const hasSearchTerm = !!searchTerm;

      console.log('Applying filters:', {
        filters: state.filters,
        searchTerm: searchTerm,
        productsCount: state.products.length,
        hasFilters,
        hasSearchTerm
      });

      if (!hasFilters && !hasSearchTerm) {
        state.filteredProducts = [...state.products];
      } else {
        state.filteredProducts = state.products.filter(product => {
          // Pricing filter logic
          const pricingMatch = 
            (!hasFilters) || // Show all if no filters selected
            (Paid && product.pricingOption === 0) ||
            (Free && product.pricingOption === 1) ||
            (ViewOnly && product.pricingOption === 2);

          // Search filter logic
          const searchMatch = 
            !hasSearchTerm ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.userName.toLowerCase().includes(searchTerm.toLowerCase());

          return pricingMatch && searchMatch;
        });
      }

      // Only apply price filtering if priceRange is not default
      const shouldFilterByPrice = state.priceRange.min !== 0 || state.priceRange.max !== MAX_PRICE;
      const priceFilteredProducts = shouldFilterByPrice 
        ? state.filteredProducts.filter(product => {
            return product.price === undefined || 
                   (product.price >= state.priceRange.min && 
                    product.price <= state.priceRange.max);
          })
        : state.filteredProducts;

      // Apply sorting to products
      // Safe sorting with null checks
      state.filteredProducts = [...priceFilteredProducts].sort((a, b) => {
        if (!a || !b) return 0;
        
        switch (state.sortBy) {
          case 'name':
            return (a.title || '').localeCompare(b.title || '');
          case 'higherPrice':
            return (b.pricingOption !== PricingOption.PAID ? 0 : (b.price || 0)) - 
                   (a.pricingOption !== PricingOption.PAID ? 0 : (a.price || 0));
          case 'lowerPrice':
            return (a.pricingOption !== PricingOption.PAID ? 0 : (a.price || 0)) - 
                   (b.pricingOption !== PricingOption.PAID ? 0 : (b.price || 0));
          default:
            return 0;
        }
      });

      console.log('Filtered products count:', state.filteredProducts.length);
    },
    setSortBy(state, action: PayloadAction<SortByOption>) {
      state.loading = true;
      state.sortBy = action.payload;
    },
    resetFilters(state) {
      state.loading = true;
      state.filters = {
        Paid: false,
        Free: false,
        ViewOnly: false
      };
      state.searchTerm = '';
      state.priceRange = {
        min: 0,
        max: MAX_PRICE
      };
      state.filteredProducts = state.products;
      // Remove URL manipulation
    },
    setPriceRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.loading = true;
      state.priceRange = action.payload;
      
      // Apply filters immediately
      const { Paid, Free, ViewOnly } = state.filters;
      const searchTerm = state.searchTerm.trim();
      const hasSearchTerm = !!searchTerm;

      state.filteredProducts = state.products.filter(product => {
        const priceInRange = 
          product.price === undefined || 
          (product.price >= state.priceRange.min && 
           product.price <= state.priceRange.max);

        const pricingMatch = 
          (Paid && product.pricingOption === 0 && priceInRange) ||
          (Free && product.pricingOption === 1 && priceInRange) ||
          (ViewOnly && product.pricingOption === 2 && priceInRange);

        const searchMatch = 
          !hasSearchTerm ||
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.userName.toLowerCase().includes(searchTerm.toLowerCase());

        if (!Paid && !Free && !ViewOnly) {
          return searchMatch;
        }

        return pricingMatch && searchMatch;
      });

      state.loading = false;
    },
    updateFiltersAndApply(state, action: PayloadAction<{
      filters: { Paid: boolean; Free: boolean; ViewOnly: boolean };
      searchTerm: string;
      priceRange?: { min: number; max: number };
    }>) {
      state.loading = true;
      state.filters = action.payload.filters;
      state.searchTerm = action.payload.searchTerm;
      if (action.payload.priceRange) {
        state.priceRange = action.payload.priceRange;
      }
      
      const { Paid, Free, ViewOnly } = state.filters;
      const searchTerm = state.searchTerm.trim();
      const hasSearchTerm = !!searchTerm;

      console.log('Applying filters with values:', {
        filters: state.filters,
        searchTerm,
        productsCount: state.products.length
      });

      state.filteredProducts = state.products.filter(product => {
        // Pricing filter logic - respect explicit false values
        const priceInRange = 
          product.price === undefined || 
          (product.price >= state.priceRange.min && 
           product.price <= state.priceRange.max);

        console.log('Checking pricing match for product:', {
          id: product.id,
          pricingOption: product.pricingOption,
          price: product.price,
          priceInRange,
          filters: { Paid, Free, ViewOnly }
        });

        const pricingMatch = 
          (Paid && product.pricingOption === 0 && priceInRange) ||
          (Free && product.pricingOption === 1 && priceInRange) ||
          (ViewOnly && product.pricingOption === 2 && priceInRange);

        console.log('Pricing match result:', pricingMatch);

        // Search filter logic
        const searchMatch = 
          !hasSearchTerm ||
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.userName.toLowerCase().includes(searchTerm.toLowerCase());

        // If all filters are false, show all products that match search
        if (!Paid && !Free && !ViewOnly) {
          return searchMatch;
        }

        // Otherwise, show products that match both active filters and search
        return pricingMatch && searchMatch;
      });

      // Only apply price filtering if priceRange is not default
      const shouldFilterByPrice = state.priceRange.min !== 0 || state.priceRange.max !== MAX_PRICE;
      const priceFilteredProducts = shouldFilterByPrice 
        ? state.filteredProducts.filter(product => {
            return product.price === undefined || 
                   (product.price >= state.priceRange.min && 
                    product.price <= state.priceRange.max);
          })
        : state.filteredProducts;

      // Apply sorting to products
      // Safe sorting with null checks
      state.filteredProducts = [...priceFilteredProducts].sort((a, b) => {
        if (!a || !b) return 0;
        
        switch (state.sortBy) {
          case 'name':
            return (a.title || '').localeCompare(b.title || '');
          case 'higherPrice':
            return (b.pricingOption !== PricingOption.PAID ? 0 : (b.price || 0)) - 
                   (a.pricingOption !== PricingOption.PAID ? 0 : (a.price || 0));
          case 'lowerPrice':
            return (a.pricingOption !== PricingOption.PAID ? 0 : (a.price || 0)) - 
                   (b.pricingOption !== PricingOption.PAID ? 0 : (b.price || 0));
          default:
            return 0;
        }
      });

      console.log('Filtered products count:', state.filteredProducts.length);
    }
  }
});

export const { 
  setProducts, 
  setFilters, 
  setSearchTerm, 
  applyFilters, 
  resetFilters,
  updateFiltersAndApply,
  setSortBy,
  setLoading,
  setPriceRange
} = productsSlice.actions;

export default productsSlice.reducer;
