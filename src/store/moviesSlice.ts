import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMovies, searchMovies, getMovieDetails } from '../api/movies';

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface Review {
  id: string;
  author: string;
  content: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  credits?: {
    cast: Cast[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
  videos?: {
    results: Video[];
  };
  reviews?: {
    results: Review[];
  };
}

interface MoviesState {
  movies: Movie[];
  searchResults: Movie[];
  watchlist: Movie[];
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
  sortBy: 'popular' | 'top_rated' | 'now_playing';
}

// Load watchlist from localStorage
const loadWatchlist = (): Movie[] => {
  try {
    const serializedState = localStorage.getItem('watchlist');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load watchlist from localStorage', err);
    return [];
  }
};

const initialState: MoviesState = {
  movies: [],
  searchResults: [],
  watchlist: loadWatchlist(),
  currentMovie: null,
  loading: false,
  error: null,
  sortBy: 'popular'
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchAll',
  async (type: 'popular' | 'top_rated' | 'now_playing', { rejectWithValue }) => {
    try {
      const response = await fetchMovies();
      return { type, movies: response.results };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchMovie = createAsyncThunk(
  'movies/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await searchMovies(query);
      return response.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/details',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getMovieDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<Movie>) => {
      if (!state.watchlist.some(movie => movie.id === action.payload.id)) {
        state.watchlist.push(action.payload);
        // Save to localStorage
        localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<number>) => {
      state.watchlist = state.watchlist.filter(movie => movie.id !== action.payload);
      // Update localStorage
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    },
    setSortBy: (state, action: PayloadAction<'popular' | 'top_rated' | 'now_playing'>) => {
      state.sortBy = action.payload;
    },
    setCurrentMovie: (state, action: PayloadAction<Movie | null>) => {
      state.currentMovie = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.sortBy = action.payload.type;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  addToWatchlist, 
  removeFromWatchlist, 
  setSortBy, 
  setCurrentMovie,
  clearSearchResults
} = moviesSlice.actions;

export default moviesSlice.reducer;
