import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './pages/registration'; // Adjust the path as necessary
import MovieList from './pages/movie'; // Adjust the path as necessary
import MovieModal from './pages/MovieModal';
import WishlistPage from './pages/Wishist';

const App = () => {
  const [isLogin, setIsLogin] = useState(false); // Start with registration form
  const [showAuthForm, setShowAuthForm] = useState(false); // State to control AuthForm visibility
  const [user, setUser] = useState(null); // Store user data

  // Load user data from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('movieHubUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('movieHubUser');
      }
    }
  }, []);

  const handleAuthSubmit = (data) => {
    if (data.switch) {
      setIsLogin(!isLogin); // Switch between login and registration
    } else {
      console.log(data);

      // You can add your API call here to handle login or registration
      if (isLogin) {
        // For login, store user data in localStorage
        const userData = { email: data.email, name: data.name || 'User', loginTime: new Date().toISOString() };
        localStorage.setItem('movieHubUser', JSON.stringify(userData));
        setUser(userData);
        alert(`Welcome back, ${data.email}!`);
      } else {
        // For registration, store user data in localStorage
        const userData = { email: data.email, name: data.name, loginTime: new Date().toISOString() };
        localStorage.setItem('movieHubUser', JSON.stringify(userData));
        setUser(userData);
        alert(`Registration successful, ${data.name}!`);
        setIsLogin(true); // Switch to login mode after registration
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

  const handleLogout = () => {
    localStorage.removeItem('movieHubUser');
    setUser(null);
    setIsLogin(false);
    setShowAuthForm(false);
  };

  const handleCloseAuthForm = () => {
    setShowAuthForm(false); // Close the AuthForm
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/register" />} />
        <Route path="/login" element={<AuthForm isLogin={true} onSubmit={handleAuthSubmit} />} />
        <Route path="/register" element={<AuthForm isLogin={false} onSubmit={handleAuthSubmit} />} />
        <Route path="/dashboard" element={<MovieList onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} user={user} onLogout={handleLogout} />} />
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