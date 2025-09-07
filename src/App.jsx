



import React, { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider , createHashRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Cart from './components/Cart';
import { productData } from './api/api';
import './App.css';
import Registration from './components/Registration';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import Wishlist from './components/Wishlist';
import Profile from './components/Profile';
import ProductDetails from './components/ProductDetails';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './components/Checkout';
import LoadingPage from './components/LoadingPage'; // Import the LoadingPage component

const Layout = () => {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process (replace with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const router = createHashRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} loader={productData} />
          <Route path="cart" element={<Cart />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/Registration" element={<Registration />} />
        <Route path="/signin" element={<SignIn />} />
      </Route>
    )
  );

  return (
    <>
      {isLoading && <LoadingPage />}
      <RouterProvider router={router} />
    </>
  );
};

export default App;