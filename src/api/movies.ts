const API_KEY = 'e2ef15b17ffb686cb9b411905487a612';
const BASE_URL = 'https://api.themoviedb.org/3';

let cachedMovies: any = null;
let isFetching = false;

export async function fetchMovies() {
  if (cachedMovies) {
    return cachedMovies;
  }

  if (isFetching) {
    return new Promise((resolve) => {
      const checkCache = () => {
        if (cachedMovies) {
          resolve(cachedMovies);
        } else {
          setTimeout(checkCache, 100);
        }
      };
      checkCache();
    });
  }

  isFetching = true;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    cachedMovies = data;
    isFetching = false;
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('API request timed out, using fallback data');
      return { results: [] };
    }
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export async function searchMovies(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search movies');
    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,reviews`);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}
