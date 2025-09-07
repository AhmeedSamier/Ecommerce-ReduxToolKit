import React, { useState, useEffect } from "react";

const LoadingPage = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hide after 3 seconds (adjust based on actual loading time)

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>

        {/* Shop name */}
        <h1 className="text-4xl font-bold text-white mb-2">ShopNow</h1>
        <p className="text-blue-100 mb-8">Your favorite shopping destination</p>

        {/* Animated loading indicator */}
        <div className="inline-flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto bg-white bg-opacity-20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full animate-progress"></div>
        </div>

        {/* Loading text */}
        <p className="text-blue-100 mt-4">Loading your shopping experience...</p>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;