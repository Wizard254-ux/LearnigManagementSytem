import React, { useState } from 'react';
import { 
  Menu, Bell, MessageCircle, ChevronDown, X, Home, 
  LayoutDashboard, BookOpen, GraduationCap, Settings, 
  HelpCircle, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate function
  
  const navLinks = [
    { name: 'Home', path: '/Home', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Exams Bank', path: '/ExamsBank', icon: <BookOpen size={20} /> },
    { name: 'My Units', path: '/Units', icon: <GraduationCap size={20} /> },
    { name: 'Lecturer Profile', path: '/Staff', icon: <GraduationCap size={20} /> },
    { name: 'Admin', path: '/Admin', icon: <GraduationCap size={20} /> },
  ];

  const bottomLinks = [
    { name: 'Settings', path: '', icon: <Settings size={20} /> },
    { name: 'Help & Support', path: '', icon: <HelpCircle size={20} /> },
    { name: 'Logout', path: '', icon: <LogOut size={20} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);  // Use navigate to programmatically navigate to a route
  };

  return (
    <>
      <nav className="bg-indigo-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white md:hidden"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center">
                <img
                  src="https://www.mksu.ac.ke/wp-content/uploads/2018/08/cropped-logohead2.png"
                  alt="Logo"
                  className="h-16 w-16 rounded-full mt-2"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.path)}  // Use button with onClick for navigation
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 cursor-pointer hover:text-indigo-200" />
              <MessageCircle className="h-6 w-6 cursor-pointer hover:text-indigo-200" />
              <div className="flex items-center space-x-1 cursor-pointer hover:text-indigo-200">
                <span>BN</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sliding Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}
      >
        {/* User Profile Section */}
        <div className="bg-indigo-700 text-white p-6">
          <div className="flex items-center space-x-3 mb-4">
            {/* <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="h-12 w-12 rounded-full border-2 border-white"
            /> */}
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-indigo-200">Student</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="py-4">
          <div className="px-4 mb-2 text-sm text-gray-500 uppercase">Main Menu</div>
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.path)}  // Use button with onClick for navigation
              className="flex items-center space-x-3 px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
          {bottomLinks.map((link) => (
            <button
              key={link.name}
            //   onClick={() => handleNavigation(link.path)}  // Use button with onClick for navigation
              className="flex items-center space-x-3 px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
