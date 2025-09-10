import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, BookOpen } from 'lucide-react';
import Login from "../Components/Login";
import Register from "../Components/Register";
import { useNavigate } from 'react-router-dom';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center z-50">
    <div className="w-24 h-24 mb-8 relative">
      <div className="absolute inset-0 border-8 border-white/20 rounded-full"></div>
      <div className="absolute inset-0 border-t-8 border-white rounded-full animate-spin"></div>
      <BookOpen className="absolute inset-0 m-auto w-12 h-12 text-white animate-pulse" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-4">Berlin Language School Ltd LMS</h2>
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen m-0 p-0 min-w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Image container */}
      <div className="w-full md:w-2/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          className="h-screen md:h-screen w-full object-cover"
          src="eLearnignBackground.jpg"
          alt="Berlin Language School Ltd E-learning Platform"
        />
        
        <div className="absolute top-0 inset-0 flex flex-col justify-center items-center md:items-start z-20 p-8 pb-[45%] md:p-16">
          <div className="h-28 absolute top-[2%] md:h-36 w-28 md:w-36 md:pt-4 rounded-full mb-[5%] shadow-lg  bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {/* <img
          src="mksuLogo.png"
          alt="Berlin Language School Ltd Logo"
          className="h-28 absolute top-[2%] md:h-36 w-28 md:w-36  rounded-full mb-[5%] shadow-lg "
        />    */}
               </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 pt-[10%] md:pt-0 animate-fade-in">
            Berlin Language School Ltd LMS
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-[0] md:mb-[5%] animate-fade-in-delay">
            Welcome to Berlin Language School Ltd's Learning Management System.
            Excellence in Training, Research, and Service to Humanity.
          </p>
          <div className="hidden md:flex gap-4 animate-fade-in-delay-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 transition-all hover:bg-white/30">
              <p className="text-white font-semibold">20K+</p>
              <p className="text-white/80 text-sm">Enrolled Students</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 transition-all hover:bg-white/30">
              <p className="text-white font-semibold">7+</p>
              <p className="text-white/80 text-sm">Academic Schools</p>
            </div>
          </div>

          <div 
            onClick={scrollToBottom}
            className="md:hidden absolute bottom-[28%] md:bottom-[25%] left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer transition-transform hover:scale-105"
          >
            <p className="text-white text-center font-semibold text-lg mb-2 bg-black/40 px-4 py-2 rounded-full">
              {isRegistering ? 'Register for MksU LMS' : 'Login to MksU LMS'}
            </p>
            <ChevronDown className="text-white w-6 h-6" />
          </div>
        </div>

        <div className="md:hidden absolute bottom-20 left-0 right-0 flex justify-center gap-4 z-20 px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/30 flex-1">
            <p className="text-white font-semibold text-center">20K+</p>
            <p className="text-white/80 text-sm text-center">Enrolled Students</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/30 flex-1">
            <p className="text-white font-semibold text-center">7+</p>
            <p className="text-white/80 text-sm text-center">Academic Schools</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth container */}
      <div className="w-full md:w-1/3 flex flex-col md:h-screen justify-center items-center p-8 overflow-auto">
        <div className="h-28 md:h-36 w-28 md:w-36 rounded-full mb-4 shadow-lg bg-white flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-up">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {isRegistering ? "Create Student Account" : "Student Portal Login"}
          </h2>
          
          {isRegistering ? <Register /> : <Login />}
          
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full mt-6 text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            {isRegistering 
              ? "Already have an account? Login" 
              : "New student? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}