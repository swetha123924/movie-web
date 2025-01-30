import React, { useEffect, useState } from 'react';

// Modal Component
const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{movie.Title}</h2>
        <img className="w-full h-64 object-cover mb-4" src={movie.Poster} alt={movie.Title} />
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Type:</strong> {movie.Type}</p>
        <p><strong>IMDB ID:</strong> {movie.imdbID}</p>
        <p><strong>Plot:</strong> {movie.Plot || 'No plot available.'}</p>
        <p><strong>Director:</strong> {movie.Director || 'N/A'}</p>
        <p><strong>Actors:</strong> {movie.Actors || 'N/A'}</p>
        <p><strong>Rating:</strong> {movie.Rated || 'N/A'}</p>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

// Feedback Modal Component
const FeedbackModal = ({ feedback, setFeedback, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback submitted: ${feedback}`);
    setFeedback(''); // Clear feedback after submission
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Feedback</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            className="border border-gray-300 rounded-lg p-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(5);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // State for feedback modal

  const apiKey = '7271c3f9'; // Replace with your actual API key

  const movieTitles = [
    'Inception',
    'The Dark Knight',
    'Interstellar',
    'The Matrix',
    'Pulp Fiction',
    'Forrest Gump',
    'The Shawshank Redemption',
    'The Godfather',
    'Fight Club',
    'The Lord of the Rings: The Fellowship of the Ring',
  ];

  const fetchMovies = async (term) => {
    const response = await fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}`);
    const data = await response.json();
    console.log(data);

    if (data.Response === "True") {
      const detailedMovies = await Promise.all(data.Search.map(async (movie) => {
        const detailResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
        return detailResponse.json();
      }));
      setMovies(detailedMovies);
    } else {
      setMovies([]);
    }
    setLoading(false);
  };

  const fetchRandomMovies = () => {
    const randomTitles = [];
    while (randomTitles.length < 10) {
      const randomIndex = Math.floor(Math.random() * movieTitles.length);
      const randomTitle = movieTitles[randomIndex];
      if (!randomTitles.includes(randomTitle)) {
        randomTitles.push(randomTitle);
      }
    }
    randomTitles.forEach(title => fetchMovies(title));
  };

  useEffect(() => {
    fetchRandomMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      alert('Please enter a search term');
      return;
    }
    setLoading(true);
    setMovies([]);
    fetchMovies(searchTerm);
  };

  const handleFeedbackClick = () => {
    setShowFeedbackModal(true); // Show feedback modal
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false); // Close feedback modal
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handleMovieClick = async (movie) => {
    const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
    const data = await response.json();
    setSelectedMovie(data);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-2 bg-gray-100 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-4xl font-bold text-gray-800">Movie Search</h1>
        <button
          onClick={handleFeedbackClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Feedback
        </button>
      </header>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className ="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Search
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div key={movie.imdbID} className="bg-white rounded-lg h-84 grid grid-cols-2 shadow-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer" onClick={() => handleMovieClick(movie)}>
              <img className="h-84 w-full" src={movie.Poster} alt={movie.Title} />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.Title}</h2>
                <p className="text-gray-600 mb-2">Year: {movie.Year}</p>
                <p className="text-gray-600 mb-2">Plot: {movie.Plot || 'No plot available.'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No movies found</div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-4 py-2 rounded-lg transition duration-300 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
      {showFeedbackModal && (
        <FeedbackModal
          feedback={feedback}
          setFeedback={setFeedback}
          onClose={closeFeedbackModal}
        />
      )}
    </div>
  );
};

export default MovieList;