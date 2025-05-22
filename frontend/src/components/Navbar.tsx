'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Submit Request', path: '/request' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Chat', path: '/chat' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SafeBridge
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                }`}
              ></span>
              <span
                className={`absolute w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`absolute w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                }`}
              ></span>
            </div>
          </button>

          {/* Menu items */}
          <div
            className={`${
              isMenuOpen ? 'block animate-fade-up' : 'hidden'
            } w-full md:block md:w-auto`}
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md md:bg-transparent">
              {navItems.map((item, index) => (
                <li
                  key={item.path}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    href={item.path}
                    className={`group block py-2 pl-3 pr-4 rounded md:p-0 relative ${
                      pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ${
                        pathname === item.path ? 'w-full' : 'w-0'
                      }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
