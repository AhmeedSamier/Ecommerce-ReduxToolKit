

import React, { useState, useRef, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToWishlist, removeFromWishlist } from "../redux/appSlice";

const Products = () => {
  const data = useLoaderData();
  const products = data.data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const cartItems = useSelector((state) => state.appReducer.products);
  const wishlistItems = useSelector((state) => state.appReducer.wishlist);

  // Extract unique categories from products
  const categories = ["all", ...new Set(products.map((product) => product.category))];

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating.rate - a.rating.rate;
    return 0;
  });

  // Navigate to product details page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Toggle product in wishlist (add/remove)
  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist({ id: product.id }));
      setNotification({
        message: `${product.title} was removed from wishlist`,
        image: product.image,
        type: "wishlist"
      });
    } else {
      dispatch(addToWishlist({
        id: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
        description: product.description,
        category: product.category,
      }));
      setNotification({
        message: `${product.title} was added to wishlist`,
        image: product.image,
        type: "wishlist"
      });
    }

    // Cancel any previous timeout and auto-hide notification after 3s
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Add to cart with notification
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
        description: product.description,
        category: product.category,
        quantity: 1,
      })
    );

    setNotification({
      message: `${product.title} was added to cart`,
      image: product.image,
      type: "cart"
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Cleanup timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-28 right-4 bg-white text-gray-800 px-4 py-3 rounded-xl shadow-lg z-50 border-l-4 max-w-sm ${
          notification.type === "cart" ? "border-green-500" : "border-pink-500"
        } animate-fadeInRight`}>
          <div className="flex items-start">
            <img
              src={notification.image}
              alt="Product"
              className="h-12 w-12 object-contain mr-3 rounded"
            />
            <div className="flex-1">
              <div className="font-medium">{notification.message}</div>
              <div className="text-sm text-gray-600 mt-1">
                {notification.type === "cart" 
                  ? `Cart now has ${cartItems.length} item(s)` 
                  : `Wishlist now has ${wishlistItems.length} item(s)`}
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Our Featured Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of high-quality products designed to enhance your lifestyle.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <span className="text-gray-700 font-medium self-center">
              Filter by:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all"
                  ? "All"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <span className="text-gray-700 font-medium ml-2">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-0 bg-gray-100 py-2 px-4 rounded-full text-sm focus:ring-2 focus:ring-blue-500 mr-2"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => {
            const isInWishlist = wishlistItems.some(item => item.id === product.id);
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="relative bg-gray-100 h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                  />

                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-colors"
                  >
                    {isInWishlist ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600 hover:text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                    {product.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </p>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 ml-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ${
                                i < Math.round(product.rating.rate)
                                  ? "fill-current"
                                  : "stroke-current"
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.rating.count})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
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
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mt-4">
              No products found
            </h3>
            <p className="text-gray-500 mt-2">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeInRight {
            animation: fadeInRight 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Products;