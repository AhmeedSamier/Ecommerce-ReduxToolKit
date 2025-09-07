

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/appSlice";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const location = useLocation();
  const dispatch = useDispatch();

  // استخراج استعلام البحث من URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      // محاكاة جلب نتائج البحث
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          const allProductsResponse = await fetch("https://fakestoreapi.com/products");
          const allProducts = await allProductsResponse.json();
          
          // تصفية المنتجات بناءً على استعلام البحث
          const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
          );
          
          setSearchResults(filteredProducts);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [query]);

  // إخفاء Toast بعد 3 ثوان
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // استخراج الفئات الفريدة من نتائج البحث
  const categories = ["all", ...new Set(searchResults.map(product => product.category))];

  // تصفية المنتجات حسب الفئة
  const filteredProducts = selectedCategory === "all" 
    ? searchResults 
    : searchResults.filter(product => product.category === selectedCategory);

  // ترتيب المنتجات
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating.rate - a.rating.rate;
    return 0;
  });

  // تبديل المنتجات المفضلة
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // دالة إضافة إلى السلة
  const handleAddToCart = (product) => {
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
    
    // عرض Toast
    setToastMessage(`${product.title} added to cart!`);
    setShowToast(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-down">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)} 
            className="ml-4 text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Search Results for "{query}"
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Found {searchResults.length} products
        </p>

        {/* عوامل التصفية والترتيب */}
        {searchResults.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <span className="text-gray-700 font-medium self-center">Filter by:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-2">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-0 bg-gray-100 py-2 px-4 rounded-full text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mt-4">No products found</h3>
            <p className="text-gray-500 mt-2">Try different search terms or categories</p>
            <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
              >
                <div className="relative bg-gray-100 h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                  />
                  
                  <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  
                  {/* زر الإعجاب */}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {favorites.includes(product.id) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
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
                        <div className="flex text-yellow-400 mr-1">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'stroke-current'}`} 
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
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* إضافة أنميشن للـ Toast في CSS */}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;








