import React, { useEffect, useState } from 'react';
import MovieModal from './MovieModal';
import FeedbackModal from './FeedbackModal';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartOff, Search, Film, Star, MessageSquare, List, LogOut, LogIn } from 'lucide-react';

const MovieList = ({ onLoginClick, user, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const apiKey = '7271c3f9';
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('movieHubWishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    const storedSearchHistory = localStorage.getItem('movieHubSearchHistory');
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }

    const storedLastSearch = localStorage.getItem('movieHubLastSearch');
    if (storedLastSearch) {
      setSearchTerm(storedLastSearch);
    }
  }, []);

  // Save search term to localStorage when it changes
  useEffect(() => {
    if (searchTerm) {
      localStorage.setItem('movieHubLastSearch', searchTerm);
    }
  }, [searchTerm]);

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

    // Add to search history
    setSearchHistory((prev) => {
      const newHistory = [searchTerm, ...prev.filter(term => term !== searchTerm)].slice(0, 10); // Keep last 10 searches
      localStorage.setItem('movieHubSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });

    fetchMovies(searchTerm);
  };

  const toggleWishlist = (movie) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(movie.imdbID)
        ? prev.filter((id) => id !== movie.imdbID)
        : [...prev, movie.imdbID];
      localStorage.setItem('movieHubWishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleMovieClick = (movie) => {
    navigate(`/dashboard/${encodeURIComponent(movie.Title)}`, { state: { movie } });
  };

  const goToWishlist = () => {
    navigate('/wishlist', { state: { wishlist } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-1 sm:gap-2 lg:gap-4 xl:gap-6 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <Film className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white tracking-tight whitespace-nowrap">MovieHub</h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-1 sm:gap-2 flex-1 min-w-0 max-w-[200px] sm:max-w-xs lg:max-w-md">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-1.5 sm:pl-2 lg:pl-3 flex items-center pointer-events-none">
                <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 sm:pl-6 lg:pl-8 xl:pl-10 pr-1.5 sm:pr-2 lg:pr-3 xl:pr-4 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm lg:text-base"
                placeholder="Search..."
              />
            </div>
            <button
              type="submit"
              className="px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0"
            >
              <span className="hidden lg:inline">Search</span>
              <Search className="w-3 h-3 lg:hidden" />
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 xl:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-1.5 sm:px-2 lg:px-3 xl:px-4 py-1 sm:py-1.5 lg:py-2 xl:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">Feedback</span>
            </button>
            <button
              onClick={goToWishlist}
              className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-1.5 sm:px-2 lg:px-3 xl:px-4 py-1 sm:py-1.5 lg:py-2 xl:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              <List className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">Wishlist</span>
            </button>
            <button
              onClick={user ? onLogout : onLoginClick}
              className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-1.5 sm:px-2 lg:px-3 xl:px-4 py-1 sm:py-1.5 lg:py-2 xl:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              {user ? <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" /> : <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />}
              <span className="hidden lg:inline">{user ? 'Logout' : 'Login'}</span>
            </button>
          </div>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-base sm:text-lg font-semibold text-gray-300">Loading amazing movies...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 lg:gap-8 overflow-y-auto pb-4">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  onClick={() => handleMovieClick(movie)}
                  className="group bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 cursor-pointer border border-white/20"
                >
                  <div className="relative overflow-hidden aspect-[2/3]">
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                      alt={movie.Title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(movie);
                      }}
                      className="p-1.5 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
                    >
                      {wishlist.includes(movie.imdbID) ? (
                        <Heart className="w-3 h-3 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
                      ) : (
                        <HeartOff className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Movie Info */}
                  <div className="p-3 sm:p-4">
                    <h2 className="text-sm sm:text-lg font-bold text-white truncate mb-1 sm:mb-2 leading-tight">{movie.Title}</h2>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm text-gray-300">{movie.Year}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'Discover this cinematic masterpiece...'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 sm:py-16">
                <Film className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No movies found</p>
                <p className="text-sm sm:text-base text-gray-400">Try searching for a different movie title</p>
              </div>
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
    </div>
  );
};

export default MovieList;
