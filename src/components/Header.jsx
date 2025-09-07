

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoBagCheckOutline } from "react-icons/io5";
import {
  FaSignOutAlt,
  FaShoppingCart,
  FaUser,
  FaHome,
  FaSearch,
  FaHeart,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { logoutUser } from "../redux/appSlice";

const Header = () => {
  const products = useSelector((state) => state.appReducer.products);
  const wishlist = useSelector((state) => state.appReducer.wishlist);
  const userInfo = useSelector((state) => state.appReducer.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logoutUser());
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.header-container')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <div className="container mx-auto px-4 header-container">
        <div className="flex items-center justify-between">
          {/* Logo and Hamburger Menu */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-white flex items-center hover:opacity-90 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-8 md:w-8 mr-2"
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
              ShopNow
            </Link>
          </div>

          {/* Search Bar - Always visible on desktop, conditional on mobile */}
          <form 
            onSubmit={handleSearch} 
            className={`${isMenuOpen ? 'hidden' : 'flex'} md:flex mx-2 md:mx-4 flex-1 max-w-xl transition-all duration-300`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 shadow-inner"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-md"
                aria-label="Search"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="flex items-center hover:text-blue-200 transition-colors p-2 rounded-md"
              title="Home"
            >
              <FaHome className="mr-1" />
              <span className="hidden lg:inline">Home</span>
            </Link>

            <Link
              to={userInfo ? "/checkout" : "/signin"}
              className="flex items-center hover:text-blue-200 transition-colors p-2 rounded-md"
              title="Checkout"
            >
              <IoBagCheckOutline className="mr-1" />
              <span className="hidden lg:inline">Checkout</span>
            </Link>

            {userInfo ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center bg-blue-700 px-3 py-1 rounded-full hover:bg-blue-800 transition"
                  title="Your Profile"
                >
                  <FaUser className="mr-2 text-sm" />
                  <span className="text-sm font-medium truncate max-w-[100px]">{userInfo.userName}</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center bg-red-500 px-3 py-1 rounded-full text-white text-sm hover:bg-red-600 transition"
                  title="Logout"
                >
                  <FaSignOutAlt className="mr-1" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/Registration"
                className="hover:text-blue-200 transition-colors p-2 rounded-md"
              >
                Register
              </Link>
            )}

            {/* Wishlist Link with counter */}
            <Link
              to="/wishlist"
              className="relative flex items-center hover:text-blue-200 transition-colors p-2 rounded-md"
              title="Wishlist"
            >
              <FaHeart className="text-xl" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link with counter */}
            <Link
              to="/cart"
              className="relative flex items-center hover:text-blue-200 transition-colors p-2 rounded-md"
              title="Shopping Cart"
            >
              <FaShoppingCart className="text-xl" />
              {products.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {products.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Icons - Visible when menu is closed */}
          <div className={`${isMenuOpen ? 'hidden' : 'flex'} md:hidden items-center space-x-4`}>
            <Link
              to="/wishlist"
              className="relative flex items-center p-2 hover:bg-blue-700 rounded-md transition-colors"
              title="Wishlist"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHeart className="text-xl" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center p-2 hover:bg-blue-700 rounded-md transition-colors"
              title="Shopping Cart"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaShoppingCart className="text-xl" />
              {products.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {products.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu - Appears when hamburger menu is clicked */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 pt-4 opacity-100' : 'max-h-0 pt-0 opacity-0'}`}>
          <div className="flex flex-col space-y-2 pb-4 border-t border-blue-500 pt-4">
            <Link
              to="/"
              className="flex items-center hover:bg-blue-700 transition-colors py-3 px-4 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHome className="mr-3" />
              Home
            </Link>

            <Link
              to={userInfo ? "/checkout" : "/signin"}
              className="flex items-center hover:bg-blue-700 transition-colors py-3 px-4 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <IoBagCheckOutline className="mr-3" />
              Checkout
            </Link>

            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center hover:bg-blue-700 transition-colors py-3 px-4 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-3" />
                  Profile: {userInfo.userName}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center hover:bg-blue-700 transition-colors py-3 px-4 rounded-md text-left"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/Registration"
                className="flex items-center hover:bg-blue-700 transition-colors py-3 px-4 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            )}
            
            {/* Mobile Search - Visible in menu on mobile */}
            <form 
              onSubmit={handleSearch} 
              className="px-4 pt-2"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
