import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Login from "../Components/Login";
import Register from "../Components/Register";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate=useNavigate()

  return (
    <div className="flex flex-col md:flex-row min-h-screen m-0 p-0 min-w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Image container */}
      <div className="w-full md:w-2/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          className="h-screen md:h-screen w-full object-cover"
          src="https://media.istockphoto.com/id/2190684362/photo/diagonal-3d-laptop-with-e-learning-text-in-bold-minimalist-design-3d-rendering.jpg?s=1024x1024&w=is&k=20&c=yWPDIybSMcemhW_kR-HDTiEBNsWRnxeY-wpdlmf4djA="
          alt="Machakos University E-learning Platform"
        />
        {/* Text overlay */}
        
        <div className="absolute top-0  inset-0 flex flex-col justify-center items-center md:items-start z-20 p-8 pb-[45%] md:p-16">
        <img
          src="https://www.mksu.ac.ke/wp-content/uploads/2018/08/cropped-logohead2.png"
          alt="Machakos University Logo"
          className="h-28 absolute top-[2%] md:h-36 w-28 md:w-36 rounded-full mb-[5%] shadow-lg md:hidden"
        />
                <button onClick={()=>navigate('/Home')} className=" hidden md:block mb-0 md:mb-10 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
              Proceed to Home
              <ArrowRight size={20} />
            </button>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 pt-[10%] md:pt-0">
            Machakos University LMS
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-[0] md:mb-[5%]">
            Welcome to Machakos University's Learning Management System.
            Excellence in Training, Research, and Service to Humanity.
          </p>
          <div className="hidden md:flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <p className="text-white font-semibold">20K+</p>
              <p className="text-white/80 text-sm">Enrolled Students</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <p className="text-white font-semibold">7+</p>
              <p className="text-white/80 text-sm">Academic Schools</p>
            </div>
          </div>

          {/* Mobile scroll indicator */}
          <div className="md:hidden absolute bottom-[28%] md:bottom-[25%] left-0 right-0 flex flex-col items-center animate-bounce">
            <p className="text-black text-center font-semibold text-lg mb-2">
              {isRegistering ? 'Register for MksU LMS' : 'Login to MksU LMS'}
            </p>
            <ChevronDown className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Mobile stats - Visible only on small screens */}
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
      <div className="w-full  md:w-1/3 flex flex-col md:h-screen justify-center items-center p-8">
      <button onClick={()=>navigate('/Home')} className="flex md:hidden items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
      Proceed to Home
      <ArrowRight size={20} />
    </button>
        <img
          src="https://www.mksu.ac.ke/wp-content/uploads/2018/08/cropped-logohead2.png"
          alt="Machakos University Logo"
          className="h-28 md:h-36 w-28 md:w-36 rounded-full mb-4 shadow-lg"
        />
        <div className="w-full max-w-md bg-black rounded-2xl shadow-lg p-8">
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