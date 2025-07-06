import React, { useEffect, useState } from 'react';
import MovieModal from './MovieModal';
import FeedbackModal from './FeedbackModal';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartOff } from 'lucide-react';

const MovieList = ({ onLoginClick, user }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const apiKey = '7271c3f9';
  const navigate = useNavigate();

  const fetchMovies = async (term) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}`);
      const data = await response.json();
      if (data.Response === 'True') {
        const detailed = await Promise.all(
          data.Search.map(async (movie) => {
            const detail = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
            return detail.json();
          })
        );
        setMovies(detailed);
      } else {
        setMovies([]);
      }
    } catch (err) {
      alert('Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies('Avengers'); // Default fetch on mount
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return alert('Enter movie name');
    fetchMovies(searchTerm);
  };

  const toggleWishlist = (movie) => {
    setWishlist((prev) =>
      prev.includes(movie.imdbID)
        ? prev.filter((id) => id !== movie.imdbID)
        : [...prev, movie.imdbID]
    );
  };

  const handleMovieClick = (movie) => {
    navigate(`/dashboard/${encodeURIComponent(movie.Title)}`, { state: { movie } });
  };

  const goToWishlist = () => {
    navigate('/wishlist', { state: { wishlist } });
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-slate-100 to-white px-4 py-6">
      <div className="">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">🎬 Movie Explorer</h1>
          <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by movie title"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
              Search
            </button>
          </form>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Feedback
            </button>
            <button
              onClick={goToWishlist}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Wishlist
            </button>
            <button
              onClick={onLoginClick}
              className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg"
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-600 py-16">Loading movies...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  onClick={() => handleMovieClick(movie)}
                  className="relative group bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer"
                >
                  <img src={movie.Poster} alt={movie.Title} className="h-80 w-full object-cover" />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(movie);
                      }}
                    >
                      {wishlist.includes(movie.imdbID) ? (
                        <Heart className="fill-red-500 text-red-500" />
                      ) : (
                        <HeartOff className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 truncate">{movie.Title}</h2>
                    <p className="text-sm text-gray-600">Year: {movie.Year}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{movie.Plot || 'No plot available'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-full text-gray-500">No movies found</div>
            )}
          </div>
        )}

        {/* Modals */}
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
        {showFeedbackModal && (
          <FeedbackModal
            feedback={feedback}
            setFeedback={setFeedback}
            onClose={() => setShowFeedbackModal(false)}
          />
        )}
      </div>
    </section>
  );
};

export default MovieList;
