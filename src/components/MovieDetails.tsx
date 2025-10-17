import { useGetMovieByIdQuery } from '../store/moviesApi';
import './MovieDetails.scss';

interface MovieDetailsProps {
  movieId: string;
  onClose: () => void;
  isInWatchlist?: boolean;
  onAddToWatchlist?: () => void;
  onRemoveFromWatchlist?: () => void;
}

export default function MovieDetails({
  movieId,
  onClose,
  isInWatchlist = false,
  onAddToWatchlist = () => {},
  onRemoveFromWatchlist = () => {}
}: MovieDetailsProps) {
  const { data: movie, isLoading, error } = useGetMovieByIdQuery(movieId, {
    skip: !movieId
  });

  if (!movieId) return (
    <div className="movie-details-overlay">
      <div className="movie-details-container">
        <div className="error">Invalid movie ID</div>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="movie-details-overlay">
      <div className="movie-details-container">
        <div className="loading">Loading movie details...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="movie-details-overlay">
      <div className="movie-details-container">
        <div className="error">Failed to load movie details</div>
      </div>
    </div>
  );

  if (!movie) return (
    <div className="movie-details-overlay">
      <div className="movie-details-container">
        <div className="error">Movie not found</div>
      </div>
    </div>
  );
  const handleWatchlistClick = () => {
    if (isInWatchlist) {
      onRemoveFromWatchlist();
    } else {
      onAddToWatchlist();
    }
  };

  if (!movie) return null;

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details-container">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="movie-header">
          <div className="movie-poster">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No Image</div>
            )}
          </div>
          
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.runtime} min</span>
            </div>
            
            <button 
              className={`watchlist-button ${isInWatchlist ? 'in-watchlist' : ''}`}
              onClick={handleWatchlistClick}
            >
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
            
            <div className="genres">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="movie-content">
          <h2>Overview</h2>
          <p>{movie.overview}</p>
          
          <div className="director-section">
            <h2>Director</h2>
            {movie.credits?.crew?.find(person => person.job === 'Director') && (
              <div className="director-info">
                <p>
                  {movie.credits.crew.find(person => person.job === 'Director')?.name}
                </p>
              </div>
            )}
          </div>

          {movie.credits?.cast?.length > 0 && (
            <>
              <h2>Cast</h2>
              <div className="cast-grid">
                {movie.credits.cast.slice(0, 10).map(actor => (
                  <div key={actor.id} className="cast-member">
                    <img 
                      src={actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                        : '/default-avatar.png'
                      } 
                      alt={actor.name}
                    />
                    <span>{actor.name}</span>
                    <span className="character">{actor.character}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {movie.reviews?.results?.length > 0 && (
            <>
              <h2>Reviews</h2>
              <div className="reviews-section">
                {movie.reviews.results.slice(0, 3).map(review => (
                  <div key={review.id} className="review-card">
                    <h3>{review.author}</h3>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {movie.videos?.results?.length > 0 && (
            <>
              <h2>Trailers</h2>
              <div className="videos">
                {movie.videos.results
                  .filter(video => video.site === 'YouTube')
                  .slice(0, 2)
                  .map(video => (
                    <div key={video.id} className="video-embed">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        allowFullScreen
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
