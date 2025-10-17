import { useState, useEffect } from 'react';
import { Movie } from '../store/moviesSlice';
import { useGetMoviesQuery } from '../store/moviesApi';
import './MovieLottery.scss';

export default function MovieLottery() {
  const { data: moviesData, isLoading, error } = useGetMoviesQuery({page: 1, pageSize: 100});
  const movies = moviesData?.movies || [];
  const [spinning, setSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);

  const spin = () => {
    if (spinning || !movies.length) return;
    
    setSpinning(true);
    setSelectedMovie(null);
    
    // Create a shuffled array for display
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    setDisplayMovies(shuffled.slice(0, 8)); // Show 8 movies in the wheel

    // Spin for 3 seconds then select a random movie
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const selected = movies[randomIndex];
      setSelectedMovie(selected);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="movie-lottery">
      <h2>Movie Lottery</h2>
      <p>Let fate decide what to watch next!</p>
      
      <div className={`lottery-wheel ${spinning ? 'spinning' : ''}`}>
        {displayMovies.map((movie, index) => (
          <div 
            key={`${movie.id}-${index}`}
            className="wheel-item"
            style={{ transform: `rotate(${index * (360 / displayMovies.length)}deg)` }}
          >
            <div className="wheel-item-content">
              {movie.title}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={spin}
        disabled={spinning || !movies.length || isLoading}
        className="spin-button"
      >
        {isLoading ? 'Loading movies...' : spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {error && <div className="error">Failed to load movies</div>}

      {selectedMovie && (
        <div className="result">
          <h3>Your movie is:</h3>
          <p className="selected-movie">{selectedMovie.title}</p>
          <button 
            onClick={() => window.location.href = `/movies/${selectedMovie.id}`}
            className="watch-button"
          >
            Watch Now
          </button>
        </div>
      )}
    </div>
  );
}
