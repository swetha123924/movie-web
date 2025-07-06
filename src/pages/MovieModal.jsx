import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MovieModal = ({ movie }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movie: movieFromState } = location.state || {}; 

  const movieToDisplay = movieFromState || movie; 

  if (!movieToDisplay) {
    return <div>No movie details available.</div>; 
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{movieToDisplay.Title}</h2>
        <img src={movieToDisplay.Poster} alt={movieToDisplay.Title} className="mb-4" />
        <p className="text-gray-700"><strong>Year:</strong> {movieToDisplay.Year}</p>
        <p className="text-gray-700"><strong>Plot:</strong> {movieToDisplay.Plot || 'No plot available.'}</p>
        <p className="text-gray-700"><strong>Director:</strong> {movieToDisplay.Director}</p>
        <p className="text-gray-700"><strong>Actors:</strong> {movieToDisplay.Actors}</p>
        <p className="text-gray-700"><strong>Rating:</strong> {movieToDisplay.imdbRating}</p>
        <button  onClick={() => navigate('/dashboard')}className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default MovieModal;