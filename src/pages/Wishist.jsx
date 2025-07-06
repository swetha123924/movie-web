import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const WishlistPage = () => {
  const location = useLocation();
  const { wishlist } = location.state || { wishlist: [] }; 
  const [movies, setMovies] = useState([]); 

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      const movieDetails = await Promise.all(
        wishlist.map(async (movieId) => {
          const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=7271c3f9`);
          const data = await response.json();
          return data; 
        })
      );
      setMovies(movieDetails); 
    };

    if (wishlist.length > 0) {
      fetchWishlistMovies(); 
    }
  }, [wishlist]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="bg-white rounded-lg shadow-md">
              <img className="h-64 w-full object-contain" src={movie.Poster} alt={movie.Title} />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.Title}</h2>
                <p className="text-gray-600 mb-2">Year: {movie.Year}</p>
                <p className="text-gray-600 mb-2 col-span-2">Plot: {movie.Plot || 'No plot available.'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No movies in your wishlist</div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;