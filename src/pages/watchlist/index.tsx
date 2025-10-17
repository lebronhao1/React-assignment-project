import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { sortWatchlist, setCurrentMovie } from '../../store/moviesSlice';
import MovieCard from '../../components/MovieCard';
import MovieLottery from '../../components/MovieLottery';
import './styles.scss';

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const { watchlist } = useSelector((state: RootState) => state.movies);
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'rating'>('added');

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'rating') return b.vote_average - a.vote_average;
    return 0; // Keep added order by default
  });

  const handleMovieSelect = (movie: Movie) => {
    dispatch(setCurrentMovie(movie));
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        
        <div className="sort-options">
          <label>
            Sort by:
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="added">Recently Added</option>
              <option value="title">Title</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>

      {sortedWatchlist.length > 0 && (
        <MovieLottery 
          movies={sortedWatchlist}
          onSelect={handleMovieSelect}
        />
      )}
      
      {sortedWatchlist.length > 0 ? (
        <div className="movies-grid">
          {sortedWatchlist.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={true}
              onAddToWatchlist={() => {}}
              onRemoveFromWatchlist={() => {}}
              onClick={() => handleMovieSelect(movie)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-watchlist">
          Your watchlist is empty. Start adding movies!
        </div>
      )}
    </div>
  );
}
