import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './../assets/images/logo.png';
import playstore from './../assets/images/playstore.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faInfoCircle, faConciergeBell, faStore, faBoxOpen,
  faPhone, faSignOutAlt, faChevronDown, faChevronUp,
  faTimes, faBars, faSun, faMoon
} from '@fortawesome/free-solid-svg-icons';

export default function SidebarWithHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
    setIsSidebarOpen(false); // ✅ close sidebar
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      localStorage.removeItem('token');
      alert("You have been logged out successfully.");
      navigate('/LoginForm');

      // ✅ Try closing the window (only works if it was opened by JS)
      setTimeout(() => {
        window.open('', '_self'); // switch to same window
        window.close();           // try to close it

        // ✅ Fallback if window can't be closed (browser blocked it)
        setTimeout(() => {
          if (!window.closed) {
            window.location.href = '/LoginForm'; // fallback
          }
        }, 500);
      }, 500);
    } catch (error) {
      console.error('Logout failed:', error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isSidebarOpen ? 'bg-blue-100 dark:bg-blue-950' : 'bg-gray-100 dark:bg-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <img src={logo} alt="Logo" className="h-10" />
          <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="px-4 py-6 overflow-y-auto flex-grow">
          <ul className="space-y-4 text-gray-700 dark:text-gray-200">
            <li>
              <button
                onClick={() => setIsHomeOpen(!isHomeOpen)}
                className="flex justify-between items-center w-full hover:text-blue-600"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faHome} />
                  Home
                </span>
                <FontAwesomeIcon icon={isHomeOpen ? faChevronUp : faChevronDown} />
              </button>
              {isHomeOpen && (
                <ul className="ml-6 mt-2 space-y-2 text-sm ">
                  {[
                    "HeaderForm", "BannerForm", "ShippingForm", "CategoryForm",
                    "FreshGroceryForm", "StoreSectionForm", "AboutTeamForm", "AppIntroForm",
                    "FaqForm", "TestimonialForm", "FooterForm"
                  ].map(path => (
                    <li key={path}>
                      <Link
                        to={`/${path}`}
                        onClick={() => setIsSidebarOpen(false)} // ✅ close sidebar
                        className="block hover:text-blue-500"
                      >
                        {path}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {[
              { label: 'About Us', icon: faInfoCircle },
              { label: 'Services', icon: faConciergeBell },
              { label: 'Shop', icon: faStore },
              { label: 'Product', icon: faBoxOpen },
              { label: 'Contact Us', icon: faPhone }
            ].map(({ label, icon }) => (
              <li key={label}>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-blue-600"
                  onClick={() => setIsSidebarOpen(false)} // ✅ close sidebar
                >
                  <FontAwesomeIcon icon={icon} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-6 border-t dark:border-gray-700">
          <a href="#" className="block mb-4">
            <img src={playstore} alt="Play Store" className="h-10" />
          </a>
          <button
            className="w-full flex items-center gap-2 justify-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
            onClick={() => {
              setIsSidebarOpen(false); // ✅ close sidebar before logout
              handleLogout();          // ✅ logout + attempt close
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-30">
          <button onClick={toggleSidebar} className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>

          <div className="flex items-center space-x-4 relative">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
              >
                {language.toUpperCase()}
                <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
              </button>

              {showLangMenu && (
                <ul className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border rounded shadow-lg z-50">
                  {['en', 'hi', 'fr'].map((lang) => (
                    <li
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      {lang.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
