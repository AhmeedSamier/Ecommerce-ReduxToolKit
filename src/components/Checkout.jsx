





import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/appSlice";



const Checkout = () => {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState({});

  const cartItems = useSelector((state) => state.appReducer.products);
  const userInfo = useSelector((state) => state.appReducer.userInfo);
  const user = useSelector((state) => state.appReducer.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If not logged in
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You must log in first</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to complete checkout</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/registration")}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">You haven't added any products yet</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!shippingInfo.firstName.trim()) newErrors.firstName = "First name is required";
    if (!shippingInfo.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = "Email is invalid";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.country.trim()) newErrors.country = "Country is required";
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.1; // Assuming 10% tax
  };

  const calculateShipping = () => {
    return calculateTotal() > 100 ? 0 : 10; // Free shipping for orders over $100
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateTax() + calculateShipping();
  };

  const handlePlaceOrder = () => {
    // In a real app, you would send the order to your backend here
    setTimeout(() => {
      dispatch(clearCart());
      setOrderPlaced(true);
    }, 2000);
  };

  const renderProgressIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"} font-medium`}>
              1
            </div>
            <span className="text-sm mt-2">Shipping</span>
          </div>
          
          {/* Line between steps */}
          <div className={`w-16 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"} font-medium`}>
              2
            </div>
            <span className="text-sm mt-2">Payment</span>
          </div>
          
          {/* Line between steps */}
          <div className={`w-16 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"} font-medium`}>
              3
            </div>
            <span className="text-sm mt-2">Review</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={shippingInfo.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.address ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={shippingInfo.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.city ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.country ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.zipCode ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleNextStep}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
        <div className="space-y-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === "creditCard" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onClick={() => setPaymentMethod("creditCard")}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === "creditCard" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                {paymentMethod === "creditCard" && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <span className="font-medium">Credit Card</span>
              <div className="ml-auto flex">
                <div className="w-10 h-6 bg-gray-200 rounded-sm mx-1"></div>
                <div className="w-10 h-6 bg-gray-200 rounded-sm mx-1"></div>
                <div className="w-10 h-6 bg-gray-200 rounded-sm mx-1"></div>
                <div className="w-10 h-6 bg-gray-200 rounded-sm mx-1"></div>
              </div>
            </div>
          </div>
          <div
            className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === "paypal" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                {paymentMethod === "paypal" && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <span className="font-medium">PayPal</span>
              <div className="ml-auto text-blue-500 font-medium">Log in to your PayPal account</div>
            </div>
          </div>
          <div
            className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === "applePay" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onClick={() => setPaymentMethod("applePay")}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === "applePay" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                {paymentMethod === "applePay" && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <span className="font-medium">Apple Pay</span>
              <div className="ml-auto w-10 h-6 bg-black rounded-sm"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button
            onClick={handlePrevStep}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Review
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Information</h3>
          <p className="text-gray-600">{shippingInfo.firstName} {shippingInfo.lastName}</p>
          <p className="text-gray-600">{shippingInfo.address}</p>
          <p className="text-gray-600">{shippingInfo.city}, {shippingInfo.country} {shippingInfo.zipCode}</p>
          <p className="text-gray-600">{shippingInfo.email}</p>
          <p className="text-gray-600">{shippingInfo.phone}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Method</h3>
          <p className="text-gray-600">
            {paymentMethod === "creditCard" && "Credit Card"}
            {paymentMethod === "paypal" && "PayPal"}
            {paymentMethod === "applePay" && "Apple Pay"}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">{calculateShipping() === 0 ? "Free" : `$${calculateShipping().toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-lg font-medium text-gray-900">${calculateFinalTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={handlePrevStep}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handlePlaceOrder}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
    );
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your order has been placed!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Order details will be sent to your email.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Checkout</h1>
        
        {renderProgressIndicator()}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Checkout;