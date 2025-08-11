import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BannerForm from './Component/home/BannerForm.jsx';
import ShippingForm from './Component/home/ShippingForm.jsx';
import CategoryForm from './Component/home/CategoryForm.jsx';
import FreshGroceryForm from './Component/home/FreshGroceryForm.jsx';
import StoreSectionForm from './Component/home/StoreSectionForm.jsx';
import AboutTeamForm from './Component/home/AboutTeamForm.jsx';
import AppIntroForm from './Component/home/AppIntroForm.jsx';
import FaqForm from './Component/home/FaqForm.jsx';
import TestimonialForm from './Component/home/TestimonialForm.jsx';
import FooterForm from './Component/home/Footer.jsx';
import HeaderForm from './Component/home/HeaderForm.jsx';
import LoginForm from './Component/LoginForm.jsx';
import SidebarWithHeader from './Component/sidber.jsx';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/LoginForm"
          element={
            isLoggedIn ? <Navigate to="/BannerForm" /> : <LoginForm onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Protected routes */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <div className="flex">
                <SidebarWithHeader
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <div
                  className={`transition-all duration-300 ease-in-out min-h-screen p-4 mt-20 ${
                    isSidebarOpen ? 'ml-64' : 'ml-0'
                  } w-full`}
                >
                  <Routes>
                    <Route path="/BannerForm" element={<BannerForm />} />
                    <Route path="/ShippingForm" element={<ShippingForm />} />
                    <Route path="/CategoryForm" element={<CategoryForm />} />
                    <Route path="/FreshGroceryForm" element={<FreshGroceryForm />} />
                    <Route path="/StoreSectionForm" element={<StoreSectionForm />} />
                    <Route path="/AboutTeamForm" element={<AboutTeamForm />} />
                    <Route path="/AppIntroForm" element={<AppIntroForm />} />
                    <Route path="/FaqForm" element={<FaqForm />} />
                    <Route path="/TestimonialForm" element={<TestimonialForm />} />
                    <Route path="/FooterForm" element={<FooterForm />} />
                    <Route path="/HeaderForm" element={<HeaderForm />} />
                    <Route path="*" element={<Navigate to="/BannerForm" />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/LoginForm" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
