import { useParams } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails';
import ErrorDisplay from '../components/ErrorDisplay';
import './styles.scss';

export default function MovieDetailsPage() {
  const { id } = useParams();
  
  if (!id) {
    return (
      <div className="movie-details-container">
        <ErrorDisplay 
          message="Invalid movie ID"
          onRetry={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      <MovieDetails 
        movieId={id}
        onClose={() => window.location.href = '/'}
      />
    </div>
  );
}
