import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToWishlist, removeFromWishlist } from "../redux/appSlice";
import { FaArrowLeft, FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const wishlistItems = useSelector((state) => state.appReducer.wishlist);

  useEffect(() => {
    // Fetch product details
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        
        // Fetch related products (same category)
        fetch(`https://fakestoreapi.com/products/category/${data.category}`)
          .then(res => res.json())
          .then(related => {
            // Filter out the current product
            const filteredRelated = related.filter(item => item.id !== data.id);
            setRelatedProducts(filteredRelated.slice(0, 4));
          });
      })
      .catch(error => console.error("Error fetching product:", error));
  }, [id]);

  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({ id: product.id }));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
        description: product.description,
        category: product.category,
      }));
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
        description: product.description,
        category: product.category,
        quantity: quantity,
      })
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images */}
            <div className="lg:w-1/2 p-8">
              <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center p-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-72 object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-8">
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.round(product.rating.rate) ? "fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.rating.count} reviews)
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-6">
                  ${product.price}
                </p>
                <p className="text-gray-700 mb-6">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-32">
                  <button
                    className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 bg-white text-gray-800 font-medium text-center w-12">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center ${
                    isInWishlist
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart className="mr-2" />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {/* {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="relative bg-gray-100 h-48 overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ${relatedProduct.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}


        {relatedProducts.length > 0 && (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedProducts.map((relatedProduct) => {
        const isInWishlist = wishlistItems.some(item => item.id === relatedProduct.id);
        
        return (
          <div
            key={relatedProduct.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => navigate(`/product/${relatedProduct.id}`)}
          >
            {/* Product Image */}
            <div className="relative bg-gray-100 h-48 overflow-hidden">
              <img
                src={relatedProduct.image}
                alt={relatedProduct.title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
              />

              {/* Category Badge */}
              <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {relatedProduct.category}
              </span>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const isInWishlist = wishlistItems.some(item => item.id === relatedProduct.id);
                  
                  if (isInWishlist) {
                    dispatch(removeFromWishlist({ id: relatedProduct.id }));
                    setNotification({
                      message: `${relatedProduct.title} was removed from wishlist`,
                      image: relatedProduct.image,
                      type: "wishlist"
                    });
                  } else {
                    dispatch(addToWishlist({
                      id: relatedProduct.id,
                      image: relatedProduct.image,
                      price: relatedProduct.price,
                      title: relatedProduct.title,
                      description: relatedProduct.description,
                      category: relatedProduct.category,
                    }));
                    setNotification({
                      message: `${relatedProduct.title} was added to wishlist`,
                      image: relatedProduct.image,
                      type: "wishlist"
                    });
                  }

                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  timeoutRef.current = setTimeout(() => {
                    setNotification(null);
                  }, 3000);
                }}
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
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {relatedProduct.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                {relatedProduct.description}
              </p>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-gray-900">
                    ${relatedProduct.price}
                  </p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 ml-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${
                            i < Math.round(relatedProduct.rating?.rate || 0)
                              ? "fill-current"
                              : "stroke-current"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      ({relatedProduct.rating?.count || 0})
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      addToCart({
                        id: relatedProduct.id,
                        image: relatedProduct.image,
                        price: relatedProduct.price,
                        title: relatedProduct.title,
                        description: relatedProduct.description,
                        category: relatedProduct.category,
                        quantity: 1,
                      })
                    );

                    setNotification({
                      message: `${relatedProduct.title} was added to cart`,
                      image: relatedProduct.image,
                      type: "cart"
                    });

                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                      setNotification(null);
                    }, 3000);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-xl font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
  </div>
)}
      </div>
    </div>
  );
};

export default ProductDetails;