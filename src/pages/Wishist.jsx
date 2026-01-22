import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Star, Calendar } from 'lucide-react';

const WishlistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem('movieHubWishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const removeFromWishlist = (movieId) => {
    const newWishlist = wishlist.filter(id => id !== movieId);
    setWishlist(newWishlist);
    localStorage.setItem('movieHubWishlist', JSON.stringify(newWishlist));
    setMovies(prev => prev.filter(movie => movie.imdbID !== movieId));
  };

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      setLoading(true);
      try {
        const movieDetails = await Promise.all(
          wishlist.map(async (movieId) => {
            const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=7271c3f9`);
            const data = await response.json();
            return data;
          })
        );
        setMovies(movieDetails);
      } catch (error) {
        console.error('Error fetching wishlist movies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (wishlist.length > 0) {
      fetchWishlistMovies();
    } else {
      setLoading(false);
    }
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-current" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">My Wishlist</h1>
            </div>
          </div>
          <div className="text-white/70 text-sm">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} saved
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-base sm:text-lg font-semibold text-gray-300">Loading your favorites...</p>
            </div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 lg:gap-8 overflow-y-auto pb-4">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="group bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25 cursor-pointer border border-white/20"
              >
                <div className="relative overflow-hidden aspect-[2/3]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Image'}
                    alt={movie.Title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(movie.imdbID);
                      }}
                      className="p-1 sm:p-1.5 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-200"
                    >
                      <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 fill-current drop-shadow-lg" />
                    </button>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-sm sm:text-lg font-bold text-white truncate mb-1 sm:mb-2 leading-tight">{movie.Title}</h2>
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-300">{movie.Year}</span>
                  </div>
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="flex items-center gap-1 mb-1 sm:mb-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm text-yellow-400 font-semibold">{movie.imdbRating}/10</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'A cinematic masterpiece waiting to be watched...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-white/20">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Your wishlist is empty</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-md mx-auto px-4">
              Start building your movie collection by adding films you love to your wishlist!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Discover Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;