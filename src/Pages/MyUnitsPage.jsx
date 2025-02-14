import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Users, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { api } from '../Auth/api';
const MyUnits = () => {
  const [viewType, setViewType] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [units, setUnits] = useState([]);

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Fetch units from the backend
    const fetchUnits = async () => {
      try {
        const response = await api.get('/api/student/units')
        console.log(response.data)
        setUnits(response.data.units);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchUnits();
  }, []);

  // Filter and sort units
  const filteredAndSortedUnits = units
    .filter(unit => 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'code') {
        return a.code.localeCompare(b.code);
      }
      return 0;
    });

  // Handle navigation on clicking a unit
  const handleUnitClick = (unitId) => {
    navigate(`/units/${unitId}`); // Navigate to the detail page with the unitId
  };

  const GridView = ({ units }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 md:px-0 mb-8">
      {units.map((unit) => (
        <div key={unit.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className={`h-3 bg-blue-500`} />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <button className="text-indigo-600 hover:underline" onClick={() => handleUnitClick(unit.id)}>
                  <h3 className="text-lg font-semibold text-indigo-600 mb-1">{unit.name}</h3>
                </button>
                <p className="text-sm text-gray-500">{unit.code}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{unit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = ({ units }) => (
    <div className="flex flex-col gap-4 px-10 md:px-0 mb-8">
      {units.map((unit) => (
        <div key={unit.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex">
            <div className={`w-2 bg-blue-500`} />
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <button className="text-indigo-600 hover:underline" onClick={() => handleUnitClick(unit.id)}>
                    <h3 className="text-lg font-semibold hover:text-indigo-600 text-gray-800 mb-1">{unit.name}</h3>
                  </button>
                  <p className="text-sm text-gray-500">{unit.code}</p>
                  <p className="text-sm text-gray-600 mt-2">{unit.description}</p>
                </div>
                <div className="flex items-center gap-6">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="max-w-7xl mx-auto flex-1 w-full">
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
                placeholder="Search units..."
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
                <option value="code">Sort by Code</option>
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

        {/* Unit List */}
        {viewType === 'grid' ? (
          <GridView units={filteredAndSortedUnits} />
        ) : (
          <ListView units={filteredAndSortedUnits} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyUnits;