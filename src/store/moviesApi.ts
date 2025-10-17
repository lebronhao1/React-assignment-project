import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = 'e2ef15b17ffb686cb9b411905487a612';
const BASE_URL = 'https://api.themoviedb.org/3';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: ({page = 1, pageSize = 20}) => `/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc&include_adult=false&include_video=false&page_size=${pageSize}`,
      transformResponse: (response: {results: any[], total_pages: number, total_results: number}) => ({
        movies: response.results,
        totalPages: response.total_pages,
        totalResults: response.total_results
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        if (currentCache.movies && newItems.movies) {
          return {
            ...newItems,
            movies: [...currentCache.movies, ...newItems.movies]
          };
        }
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      }
    }),
    getMovieById: builder.query({
      query: (id) => `/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,reviews`,
    }),
    searchMovies: builder.query({
      query: (query) => `/search/movie?api_key=${API_KEY}&query=${query}`,
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useSearchMoviesQuery,
} = moviesApi;
