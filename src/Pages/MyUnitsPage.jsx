import React, { useState } from 'react';
import { Search, MoreVertical, Users, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import NavBar from '../Components/NavBar';

const MyUnits = () => {
  const [viewType, setViewType] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const navigate = useNavigate(); // Initialize the navigate function

  const initialCourses = [
    {
      id: 'SIT120',
      title: 'Programming Methodology',
      program: 'Bachelor of Science (Information Technology)',
      enrolled: 156,
      color: 'bg-blue-500'
    },
    {
      id: 'SIT180',
      title: 'Computer and Society',
      program: 'Bachelor of Science (Information Technology)',
      enrolled: 142,
      color: 'bg-purple-500'
    },
    {
      id: 'SIT190',
      title: 'Foundations of Mathematics for IT',
      program: 'Bachelor of Science (Information Technology)',
      enrolled: 198,
      color: 'bg-indigo-500'
    }
  ];

  // Filter and sort courses
  const filteredAndSortedCourses = initialCourses
    .filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'id') {
        return a.id.localeCompare(b.id);
      } else if (sortBy === 'enrolled') {
        return b.enrolled - a.enrolled;
      }
      return 0;
    });

  // Handle navigation on clicking a course
  const handleUnitClick = (unitId) => {
    navigate(`/Units/${unitId}`); // Navigate to the detail page with the unitId
  };

  const GridView = ({ courses }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className={`h-3 ${course.color}`} />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                        <button  className="text-indigo-600 hover:underline" onClick={() => handleUnitClick(course.id)} > 
            <h3 className="text-lg font-semibold text-indigo-600  mb-1">
            
            {course.title}</h3>
            </button>            
                <p className="text-sm text-gray-500">{course.id}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{course.program}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-1" />
              {course.enrolled} students
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = ({ courses }) => (
    <div className="flex flex-col gap-4">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" >
          <div className="flex">
            <div className={`w-2 ${course.color}`} />
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center">
                <div>
                    <button  className="text-indigo-600 hover:underline" onClick={() => handleUnitClick(course.id)} >

                       
                  <h3 className="text-lg font-semibold hover:text-indigo-600 text-gray-800 mb-1">
                    
                    {course.title}</h3>
                    </button>
                  <p className="text-sm text-gray-500">{course.id}</p>
                  <p className="text-sm text-gray-600 mt-2">{course.program}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    {course.enrolled} students
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <NavBar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Units</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="id">Sort by ID</option>
                <option value="enrolled">Sort by Enrollment</option>
              </select>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className={`px-4 py-2 flex items-center gap-2 ${viewType === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewType('grid')}
                >
                  <LayoutGrid size={18} />
                  Grid
                </button>
                <button
                  className={`px-4 py-2 flex items-center gap-2 ${viewType === 'list' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewType('list')}
                >
                  <List size={18} />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course List */}
        {viewType === 'grid' ? (
          <GridView courses={filteredAndSortedCourses} />
        ) : (
          <ListView courses={filteredAndSortedCourses} />
        )}
      </div>
    </div>
  );
};

export default MyUnits;
