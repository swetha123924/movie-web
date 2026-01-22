import React, { useState } from 'react';
import { MessageSquare, Send, X, Star } from 'lucide-react';

const FeedbackModal = ({ feedback, setFeedback, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert('Please enter your feedback');
      return;
    }
    alert(`Thank you for your ${rating > 0 ? `${rating}-star ` : ''}feedback: "${feedback}"`);
    setFeedback('');
    setRating(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[95vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200 transform hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">Share Your Feedback</h2>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">Help us improve MovieHub with your thoughts!</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto">
          {/* Rating Section */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2 sm:mb-3">
              How would you rate your experience?
            </label>
            <div className="flex gap-1 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400'
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-yellow-400 text-xs sm:text-sm mt-2 font-medium text-center sm:text-left">
                {rating} star{rating !== 1 ? 's' : ''} - {
                  rating === 1 ? 'Poor' :
                  rating === 2 ? 'Fair' :
                  rating === 3 ? 'Good' :
                  rating === 4 ? 'Very Good' : 'Excellent'
                }
              </p>
            )}
          </div>

          {/* Feedback Textarea */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="feedback">
              Your Feedback
            </label>
            <div className="relative">
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think about MovieHub... What features do you love? What can we improve?"
                className="w-full h-24 sm:h-32 px-3 sm:px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                required
              />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-xs text-gray-400">
                {feedback.length}/500
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-transparent transform transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base flex items-center justify-center gap-1 sm:gap-2"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Submit Feedback</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <p className="text-xs text-gray-400 text-center">
            Your feedback helps us create better movie experiences for everyone!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;