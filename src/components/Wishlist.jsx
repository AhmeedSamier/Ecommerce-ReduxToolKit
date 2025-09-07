import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, clearWishlist, addToCart } from '../redux/appSlice';
import { useNavigate } from "react-router-dom";


const Wishlist = () => {
    const wishlist = useSelector((state) => state.appReducer.wishlist);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Calculate total
    const total = wishlist.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">🛒 Wishlist</h1>
                    <p className="text-lg text-gray-600">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in wishlist
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Start adding some products to see them here!</p>
                        <button 
                            onClick={() => window.history.back()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {/* Wishlist Items */}
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Product Image */}
                                    <div className="sm:w-48 bg-gray-100 flex items-center justify-center p-6">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-40 object-contain"
                                        />
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h2 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                                                    {item.title}
                                                </h2>
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                                                    {item.category}
                                                </span>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Product Price */}
                                            <div className="text-right ml-4">
                                                <p className="text-xl font-bold text-green-600">
                                                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ${item.price} × {item.quantity || 1}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between mt-4">
                                            <button
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                                                onClick={() => dispatch(addToCart(item))}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add to Cart
                                            </button>

                                            <button
                                                className="text-red-600 hover:text-red-800 transition-colors font-medium flex items-center"
                                                onClick={() => dispatch(removeFromWishlist({ id: item.id }))}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Wishlist Summary and Actions */}
                        <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold text-gray-900">Wishlist Summary</h3>
                                    <p className="text-gray-600">Total: <span className="font-bold text-green-600">${total.toFixed(2)}</span></p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                                        onClick={() => dispatch(clearWishlist())}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Clear Wishlist
                                    </button>
                                    
                                   <button
      onClick={() => navigate("/checkout")}
      className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
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
          d="M5 13l4 4L19 7"
        />
      </svg>
      Checkout Now
    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
