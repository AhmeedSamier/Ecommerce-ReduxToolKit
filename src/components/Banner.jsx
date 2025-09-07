

import React, { useState, useRef, useEffect } from 'react';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/appSlice";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 1.5, spacing: 16 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });
  
  const products = [
    {
      id: 1,
      title: "Luxury Watch",
      category: "Accessories",
      price: 249,
      image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      discount: "15%",
      rating: { rate: 4.8, count: 124 }
    },
    {
      id: 2,
      title: "Premium Headphones",
      category: "Electronics",
      price: 199,
      oldPrice: 249,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      discount: "20%",
      rating: { rate: 4.5, count: 89 }
    },
    {
      id: 3,
      title: "Sport Shoes",
      category: "Footwear",
      price: 329,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      rating: { rate: 4.3, count: 67 }
    },
    {
      id: 4,
      title: "Smartphone",
      category: "Electronics",
      price: 2399,
      oldPrice: 2799,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      discount: "14%",
      rating: { rate: 4.9, count: 205 }
    },
    {
      id: 5,
      title: "Sunglasses",
      category: "Accessories",
      price: 149,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      rating: { rate: 4.2, count: 78 }
    },
    {
      id: 6,
      title: "Modern Wristwatch",
      category: "Accessories",
      price: 379,
      oldPrice: 449,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      discount: "16%",
      rating: { rate: 4.7, count: 142 }
    }
  ];

  // إضافة إلى السلة مع عرض الإشعار
  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
        description: product.description || `${product.title} - ${product.category}`,
        category: product.category,
        quantity: 1,
      })
    );

    // عرض إشعار بإضافة المنتج
    setNotification({
      message: `${product.title} added to cart`,
      image: product.image
    });

    // إلغاء أي إشعار سابق
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // إخفاء الإشعار تلقائياً بعد 3 ثوان
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // تنظيف الـ timeout عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Special Offers ⚡</h2>
      <p className="text-center text-gray-600 mb-8">Enjoy the best deals on our premium products</p>
      
      {/* إشعار الإضافة إلى السلة */}
      {notification && (
        <div className="fixed top-28 right-4 bg-white text-gray-800 px-4 py-3 rounded-xl shadow-lg z-50 border-l-4 border-green-500 animate-fadeInRight max-w-sm">
          <div className="flex items-start">
            <img 
              src={notification.image} 
              alt="Product" 
              className="h-12 w-12 object-contain mr-3 rounded" 
            />
            <div>
              <div className="font-medium">{notification.message}</div>
              <div className="text-sm text-gray-600 mt-1">Product successfully added to your cart</div>   
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div ref={sliderRef} className="keen-slider rounded-xl">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl m-2">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-60 object-cover" 
                />
                {product.discount && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Save {product.discount}
                  </span>
                )}
                <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              
              <div className="p-4">
                <span className="text-xs text-gray-500">{product.category}</span>
                <h3 className="font-bold text-lg mb-1 text-gray-800">{product.title}</h3>
                
                <div className="flex items-center mt-2">
                  <span className="text-lg font-bold text-amber-600">${product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">${product.oldPrice}</span>
                  )}
                </div>
                
                <div className="flex items-center mt-2">
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
                
                <div className="flex items-center justify-between mt-4">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                  
                  <button className="text-gray-500 hover:text-amber-500 transition-colors p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-amber-500' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>

      {/* إضافة أنيميشن في CSS */}
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

export default Banner;