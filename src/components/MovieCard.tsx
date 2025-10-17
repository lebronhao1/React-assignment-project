import { Movie } from '../store/moviesSlice';
import './MovieCard.scss';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onAddToWatchlist: () => void;
  onRemoveFromWatchlist: () => void;
  onClick: () => void;
}

export default function MovieCard({
  movie,
  isInWatchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onClick
}: MovieCardProps) {
  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      onRemoveFromWatchlist();
    } else {
      onAddToWatchlist();
    }
  };

  return (
    <div className="movie-card" onClick={(e) => {
      console.log('MovieCard clicked', movie.id);
      onClick();
    }}>
      <div className="movie-poster">
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            width={200}
            height={300}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '';
              target.parentElement!.querySelector('.no-poster')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`no-poster ${movie.poster_path ? 'hidden' : ''}`}>
          <div className="placeholder-icon">🎬</div>
          <span>{movie.title}</span>
        </div>
        <button 
          className={`watchlist-button ${isInWatchlist ? 'in-watchlist' : ''}`}
          onClick={handleWatchlistClick}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isInWatchlist ? '✓' : '+'}
        </button>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          {/* <span>{new Date(movie.release_date).getFullYear()}</span> */}
          <span className="rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
