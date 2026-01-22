import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { X, Star, Calendar, User, Users, Film, Award } from 'lucide-react';

const MovieModal = ({ movie }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movie: movieFromState } = location.state || {};

  const movieToDisplay = movieFromState || movie;

  if (!movieToDisplay) {
    return <div>No movie details available.</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => navigate('/dashboard')}></div>

      {/* Modal Content */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[95vh] overflow-y-auto">
          {/* Movie Poster */}
          <div className="lg:w-1/3 p-4 sm:p-6 flex-shrink-0">
            <div className="relative group">
              <img
                src={movieToDisplay.Poster !== 'N/A' ? movieToDisplay.Poster : 'https://via.placeholder.com/400x600/374151/ffffff?text=No+Image'}
                alt={movieToDisplay.Title}
                className="w-full rounded-xl sm:rounded-2xl shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/374151/ffffff?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:w-2/3 p-4 sm:p-6 text-white overflow-y-auto">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 leading-tight">{movieToDisplay.Title}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieToDisplay.Year}</span>
                </div>
                {movieToDisplay.imdbRating && movieToDisplay.imdbRating !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-yellow-400">{movieToDisplay.imdbRating}/10</span>
                  </div>
                )}
                {movieToDisplay.Runtime && movieToDisplay.Runtime !== 'N/A' && (
                  <span>{movieToDisplay.Runtime}</span>
                )}
              </div>
            </div>

            {/* Plot */}
            {movieToDisplay.Plot && movieToDisplay.Plot !== 'N/A' && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  Plot
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-lg">{movieToDisplay.Plot}</p>
              </div>
            )}

            {/* Movie Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {movieToDisplay.Director && movieToDisplay.Director !== 'N/A' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-400 text-sm sm:text-base">Director</h4>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">{movieToDisplay.Director}</p>
                </div>
              )}

              {movieToDisplay.Actors && movieToDisplay.Actors !== 'N/A' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <h4 className="font-semibold text-green-400 text-sm sm:text-base">Cast</h4>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">{movieToDisplay.Actors}</p>
                </div>
              )}

              {movieToDisplay.Genre && movieToDisplay.Genre !== 'N/A' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <h4 className="font-semibold text-purple-400 text-sm sm:text-base">Genre</h4>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">{movieToDisplay.Genre}</p>
                </div>
              )}

              {movieToDisplay.Language && movieToDisplay.Language !== 'N/A' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Language</h4>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">{movieToDisplay.Language}</p>
                </div>
              )}
            </div>

            {/* Awards */}
            {movieToDisplay.Awards && movieToDisplay.Awards !== 'N/A' && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  Awards
                </h3>
                <p className="text-gray-300 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 text-sm sm:text-base">
                  {movieToDisplay.Awards}
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Back to Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;