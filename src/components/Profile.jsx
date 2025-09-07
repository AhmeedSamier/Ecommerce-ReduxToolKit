import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaHistory, FaMapMarkerAlt, FaPhone, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const userInfo = useSelector((state) => state.appReducer.userInfo);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">User Profile</h1>
          <p className="text-lg text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
                <FaUser className="text-4xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userInfo?.userName || 'User Name'}</h2>
                <p className="text-blue-100">Premium Member</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userInfo?.userName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{userInfo?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{userInfo?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  Address
                </h3>
                <div>
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium">
                    {userInfo?.address || '123 Main Street, City, Country'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaHistory className="mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Order #12345</p>
                    <p className="text-sm text-gray-500">Placed on June 12, 2023</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Delivered
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Order #12346</p>
                    <p className="text-sm text-gray-500">Placed on June 10, 2023</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Shipped
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/edit-profile"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </Link>
              <Link
                to="/orders"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;