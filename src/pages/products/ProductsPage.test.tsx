import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductsPage from './index';
import productsReducer from '../../store/productsSlice';
import { mockProducts } from '../../api/fake-products';

const mockStore = configureStore({
  reducer: {
    products: productsReducer
  },
  preloadedState: {
    products: {
      products: mockProducts,
      filteredProducts: mockProducts,
      loading: false,
      error: null,
      filters: {
        Paid: false,
        Free: false,
        ViewOnly: false
      },
      searchTerm: '',
      sortBy: 'name',
      priceRange: { min: 0, max: 999 }
    }
  }
});

describe('ProductsPage', () => {
  it('renders loading state', () => {
    const loadingStore = configureStore({
      reducer: {
        products: productsReducer
      },
      preloadedState: {
        products: {
          ...mockStore.getState().products,
          loading: true
        }
      }
    });

    render(
      <Provider store={loadingStore}>
        <ProductsPage />
      </Provider>
    );

    expect(screen.getByText('CONNET')).toBeInTheDocument();
  });
});
