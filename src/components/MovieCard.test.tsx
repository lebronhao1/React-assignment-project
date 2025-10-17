import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from './MovieCard';

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  vote_average: 7.5,
  release_date: '2023-01-01'
};

describe('MovieCard', () => {

  it('shows add button when not in watchlist', () => {
    const mockOnClick = jest.fn();
    const mockOnAdd = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={false}
        onAddToWatchlist={mockOnAdd}
        onRemoveFromWatchlist={mockOnRemove}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('+')).toBeInTheDocument();
    fireEvent.click(screen.getByText('+'));
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('shows checkmark when in watchlist', () => {
    const mockOnClick = jest.fn();
    const mockOnAdd = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={true}
        onAddToWatchlist={mockOnAdd}
        onRemoveFromWatchlist={mockOnRemove}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('✓')).toBeInTheDocument();
    fireEvent.click(screen.getByText('✓'));
    expect(mockOnRemove).toHaveBeenCalled();
  });
});
