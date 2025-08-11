import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSun,
  faMoon,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

export default function Header({ isSidebarOpen, toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

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
  };

  return (
    <header
      className={`${
        isSidebarOpen ? 'ml-64' : 'fixed left-0 top-0 w-full z-[999]'
      } transition-all duration-300 shadow-md ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <nav className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Left: Logo + Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
       
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-4 relative">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <FontAwesomeIcon icon={faMoon} />
            ) : (
              <FontAwesomeIcon icon={faSun} />
            )}
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
      </nav>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 transition-colors">
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li><a href="#" className="block py-1">Home</a></li>
            <li><a href="#" className="block py-1">About Us</a></li>
            <li><a href="#" className="block py-1">Services</a></li>
            <li><a href="#" className="block py-1">Shop</a></li>
            <li><a href="#" className="block py-1">Product</a></li>
            <li><a href="#" className="block py-1">Contact Us</a></li>
          </ul>
        </div>
      )}
    </header>
  );
}
