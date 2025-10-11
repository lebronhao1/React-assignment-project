import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Product = {
  id: string;
  photo: string;
  userName: string;
  title: string;
  pricingOption: 'Paid' | 'Free' | 'View Only';
  price?: number;
};

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: {
    Paid: boolean;
    Free: boolean;
    ViewOnly: boolean;
  };
  searchTerm: string;
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
  searchTerm: '',
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setFilters(state, action: PayloadAction<{ 
      Paid: boolean; 
      Free: boolean; 
      ViewOnly: boolean 
    }>) {
      state.filters = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    applyFilters(state) {
      const { Paid, Free, ViewOnly } = state.filters;
      const noFiltersSelected = !Paid && !Free && !ViewOnly;
      const noSearchTerm = !state.searchTerm.trim();

      if (noFiltersSelected && noSearchTerm) {
        state.filteredProducts = state.products;
        return;
      }

      state.filteredProducts = state.products.filter(product => {
        const pricingMatch =
          (Paid && product.pricingOption === 'Paid') ||
          (Free && product.pricingOption === 'Free') ||
          (ViewOnly && product.pricingOption === 'View Only') ||
          noFiltersSelected;

        const searchMatch =
          noSearchTerm ||
          product.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          product.userName.toLowerCase().includes(state.searchTerm.toLowerCase());

        return pricingMatch && searchMatch;
      });
    },
    resetFilters(state) {
      state.filters = {
        Paid: false,
        Free: false,
        ViewOnly: false
      };
      state.searchTerm = '';
      state.filteredProducts = state.products;
    }
  }
});

export const { 
  setProducts, 
  setFilters, 
  setSearchTerm, 
  applyFilters, 
  resetFilters 
} = productsSlice.actions;

export default productsSlice.reducer;
