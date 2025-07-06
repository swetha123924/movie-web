import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './pages/registration'; // Adjust the path as necessary
import MovieList from './pages/movie'; // Adjust the path as necessary
import MovieModal from './pages/MovieModal';
import WishlistPage from './pages/Wishist';

const App = () => {
  const [isLogin, setIsLogin] = useState(false); // Start with registration form
  const [showAuthForm, setShowAuthForm] = useState(false); // State to control AuthForm visibility

  const handleAuthSubmit = (data) => {
    if (data.switch) {
      setIsLogin(!isLogin); // Switch between login and registration
    } else {
      console.log(data);

      // You can add your API call here to handle login or registration
      if (isLogin) {
        alert(`Welcome back, ${data.email}!`); // Alert for login
        <Navigate to="/dashboard" />
        // navigate('/dashboard'); // Redirect to the dashboard after login
      } else {
        alert(`Registration successful, ${data.name}!`); // Alert for registration
        <Navigate to="/login" />
        // navigate('/login'); // Redirect to the login page after registration
      }
    }
  };

  const handleLoginClick = () => {
    setIsLogin(true); // Set to login mode
    setShowAuthForm(true); // Show the AuthForm when login button is clicked
  };

  const handleRegisterClick = () => {
    setIsLogin(false); // Set to registration mode
    setShowAuthForm(true); // Show the AuthForm when register button is clicked
  };

  const handleCloseAuthForm = () => {
    setShowAuthForm(false); // Close the AuthForm
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} /> {/* Redirect to registration by default */}
        <Route path="/login" element={<AuthForm isLogin={true} onSubmit={handleAuthSubmit} />} />
        <Route path="/register" element={<AuthForm isLogin={false} onSubmit={handleAuthSubmit} />} />
        <Route path="/dashboard" element={<MovieList onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />} />
        <Route path="/dashboard/:movieName" element={<MovieModal />} />
        <Route path='/wishlist' element={<WishlistPage />} />
      </Routes>
      {showAuthForm && (
        <AuthForm isLogin={isLogin} onSubmit={handleAuthSubmit} onClose={handleCloseAuthForm} />
      )}
    </Router>
  );
};

export default App;