import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ErrorDisplay from '../../components/ErrorDisplay';
import EmptyState from '../../components/EmptyState';
import { 
  useGetMoviesQuery,
  useSearchMoviesQuery
} from '../../store/moviesApi';
import { 
  addToWatchlist,
  removeFromWatchlist,
  setCurrentMovie
} from '../../store/moviesSlice';
import { RootState } from '../../store';
import MovieCard from '../../components/MovieCard';
import './styles.scss';

// Lazy load MovieDetails since it's only shown when a movie is selected
const MovieDetails = lazy(() => import('../../components/MovieDetails'));

export default function MoviesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moviesState = useSelector((state: RootState) => state.movies || {});
  const {
    watchlist = [],
    currentMovie = null,
    loading = false,
    error = null
  } = moviesState;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showWatchlist, setShowWatchlist] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Initialize page with popular movies
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { data: movies, isFetching, isLoading } = useGetMoviesQuery({page, pageSize: 20});

  useEffect(() => {
    if (movies?.movies) {
      setAllMovies(prev => [...prev, ...movies.movies]);
      setHasMore(page < (movies.totalPages || 1));
    }
  }, [movies, page]);

  const handleScroll = useCallback(() => {
    if (isFetching || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasMore]);

  const { data: apiSearchResults } = useSearchMoviesQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery.trim()
  });

  const moviesList = allMovies;
  const searchResultsList = apiSearchResults?.results || [];

  // Simple watchlist sorting by rating
  const sortedWatchlist = useMemo(() => {
    return [...watchlist].sort((a, b) => b.vote_average - a.vote_average);
  }, [watchlist]);

  const displayedMovies = showWatchlist 
    ? sortedWatchlist
    : searchQuery.trim() 
      ? searchResultsList
      : moviesList;

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleWatchlist = () => setShowWatchlist(!showWatchlist);

  if ((isLoading || isFetching) && !displayedMovies.length) return (
    <div className="movies-container">
      <header className="header">
        <div className="logo">MOVIE CENTER</div>
      </header>
      <div className={`movies-grid ${showWatchlist ? 'watchlist-mode' : ''}`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="movie-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="movies-container">
      <ErrorDisplay 
        message={`Failed to load movies: ${error}`}
        onRetry={() => window.location.reload()}
      />
    </div>
  );

  return (
    <div className="movies-container">
      <header className="header">
        <div className="logo">MOVIE CENTER</div>
        <div className="header-top">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className={`watchlist-toggle ${showWatchlist ? 'active' : ''}`}
            onClick={toggleWatchlist}
          >
            {showWatchlist ? 'Show All' : 'Show Watchlist'}
          </button>
          <button 
            className="lottery-button"
            onClick={() => navigate('/lottery')}
          >
            Try Movie Lottery
          </button>
        </div>
      </header>

      <div className="movies-grid">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              isInWatchlist={watchlist.some(m => m.id === movie.id)}
              onAddToWatchlist={() => dispatch(addToWatchlist(movie))}
              onRemoveFromWatchlist={() => dispatch(removeFromWatchlist(movie.id))}
              onClick={() => dispatch(setCurrentMovie(movie))}
            />
          ))
        ) : (
          <EmptyState
            message={showWatchlist 
              ? 'Your watchlist is empty' 
              : 'No movies found matching your search'}
            icon={showWatchlist ? '📋' : '🔍'}
          />
        )}
      </div>

      {currentMovie && (
        <div className="modal-wrapper">
          <Suspense fallback={<div className="loading-modal">Loading movie details...</div>}>
            <MovieDetails
              key={currentMovie.id}
              movieId={String(currentMovie.id)}
              onClose={() => dispatch(setCurrentMovie(null))}
              isInWatchlist={watchlist.some(m => m.id === currentMovie.id)}
              onAddToWatchlist={() => dispatch(addToWatchlist(currentMovie))}
              onRemoveFromWatchlist={() => dispatch(removeFromWatchlist(currentMovie.id))}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
