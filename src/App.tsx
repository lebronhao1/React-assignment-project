import "./styles/theme.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MoviesPage from "./pages/movies";
import WatchlistPage from "./pages/watchlist";
import MovieLottery from "./components/MovieLottery";
import MovieDetailsPage from "./pages/movie-details";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/lottery" element={<MovieLottery />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
