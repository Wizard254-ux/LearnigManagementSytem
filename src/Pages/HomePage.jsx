import React from 'react';
import { Book, Users, Trophy } from 'lucide-react';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-[url('https://images.pexels.com/photos/3747481/pexels-photo-3747481.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center py-24">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r "></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Text Content */}
            <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Welcome to Your Learning Journey
              </h1>
              <p className="text-lg mb-8 text-indigo-100">
                Access your courses, track your progress, and achieve your learning goals all in one place.
              </p>
              <button onClick={()=>navigate('/Dashboard')} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105">
                Get Started
              </button>
            </div>
            {/* Image Placeholder */}
            <div className="md:w-1/2 hidden md:flex justify-center">
              <div className="bg-white/20 rounded-lg shadow-2xl flex items-center justify-center md:ml-[10%]">
                <img
                  src="https://www.fixusjobs.com/wp-content/uploads/2018/07/machakos-university.jpg"
                  alt="Machakos University Logo"
                  className="h-full w-full bg-transparent rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Machakos University Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About Machakos University</h2>
            <p className="text-lg text-gray-600 mb-8">
              Machakos University is a leading institution of higher learning located in Machakos County, Kenya. 
              The university is committed to providing quality education, research, and innovation to empower 
              students and contribute to societal development. With a wide range of academic programs, state-of-the-art 
              facilities, and a vibrant student community, Machakos University is dedicated to nurturing future leaders 
              and professionals.
            </p>
            <p className="text-lg text-gray-600">
              Join us at Machakos University and embark on a transformative educational journey that will shape your future.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat Card 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow transform hover:-translate-y-2">
              <Book className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">1,200+</h3>
              <p className="text-gray-600">Available Courses</p>
            </div>
            {/* Stat Card 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow transform hover:-translate-y-2">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">50,000+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            {/* Stat Card 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow transform hover:-translate-y-2">
              <Trophy className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">15,000+</h3>
              <p className="text-gray-600">Certifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section (Optional) */}
      <div className="bg-indigo-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2023 Your Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;