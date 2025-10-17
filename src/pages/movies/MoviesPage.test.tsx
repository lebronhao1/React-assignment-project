import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as router from 'react-router-dom';
import { moviesApi } from '../../store/moviesApi';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
import MoviesPage from './index';
import moviesReducer from '../../store/moviesSlice';

// Mock API responses
const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    poster_path: '/test1.jpg',
    vote_average: 7.5,
    release_date: '2023-01-01'
  },
  {
    id: 2,
    title: 'Test Movie 2',
    poster_path: '/test2.jpg',
    vote_average: 8.0,
    release_date: '2023-02-01'
  }
];

// Mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
      [moviesApi.reducerPath]: moviesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(moviesApi.middleware),
  });
};

describe('MoviesPage', () => {
  it('should render', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MoviesPage />
      </Provider>
    );
    
    expect(screen.getByText('MOVIE CENTER')).toBeInTheDocument();
  });
});
