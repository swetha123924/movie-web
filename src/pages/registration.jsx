import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Film, Star } from 'lucide-react';

const AuthForm = ({ isLogin, onSubmit, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && !name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ email, password, name });

      if (isLogin) {
        alert(`Welcome back, ${email}!`);
        navigate('/dashboard');
      } else {
        alert(`Registration successful, ${name}!`);
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with film icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-3 sm:mb-4 shadow-lg">
            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">MovieHub</h1>
          <p className="text-gray-300 text-sm sm:text-base">Your cinematic journey starts here</p>
        </div>

        {/* Main form card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mr-2">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs sm:text-sm">{errors.name}</p>}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs sm:text-sm">{errors.email}</p>}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs sm:text-sm">{errors.password}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle between login/register */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-300 text-xs sm:text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => onSubmit({ switch: true })}
                className="text-purple-400 hover:text-purple-300 font-semibold ml-1 transition-colors duration-200 text-xs sm:text-sm"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-gray-400 text-xs sm:text-sm">© 2024 MovieHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

