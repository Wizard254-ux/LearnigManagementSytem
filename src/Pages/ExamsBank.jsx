import React, { useState } from 'react';
import { Search, Download, Eye, Filter, SortAsc, SortDesc } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const ExamsBank = () => {
  // ... [Previous state and functions remain the same] ...
  const [exams] = useState([
    {
      id: 1,
      unitCode: 'IT101',
      unitName: 'Introduction to Programming',
      year: 2024,
      semester: 'Spring',
      type: 'Final',
      pdfUrl: '/sample.pdf',
      size: '2.4 MB'
    },
    {
      id: 2,
      unitCode: 'IT102',
      unitName: 'Database Systems',
      year: 2024,
      semester: 'Spring',
      type: 'Midterm',
      pdfUrl: '/sample2.pdf',
      size: '1.8 MB'
    },
    {
      id: 3,
      unitCode: 'IT101',
      unitName: 'Introduction to Programming',
      year: 2023,
      semester: 'Fall',
      type: 'Final',
      pdfUrl: '/sample3.pdf',
      size: '2.1 MB'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('unitCode');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedType, setSelectedType] = useState('all');

  // ... [Previous filter and sort functions remain the same] ...
  const filteredAndSortedExams = exams
    .filter(exam => {
      const matchesSearch = 
        exam.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.unitName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || exam.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return a[sortField].localeCompare(b[sortField]) * multiplier;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        {/* Navigation Bar */}
        <NavBar />
      <div className="max-w-7xl mx-auto mt-4 flex-1 w-full mb-4">
        {/* Enhanced Header with gradient background */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 shadow-lg mx-4 md:mx-0">
          <h1 className="md:text-4xl text-2xl font-bold text-white mb-1 md:mb-3 tracking-tight">
            Exams Bank
          </h1>
          <p className="text-blue-100 text-base md:text-lg">
            Access past examination papers for Information Technology courses
          </p>
        </div>

        {/* Search and Filters - Enhanced styling */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-indigo-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by unit code or name..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            className="px-6 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all hover:bg-gray-50"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Final">Final Exam</option>
            <option value="Midterm">Midterm</option>
          </select>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
  {/* Add a wrapper div with overflow-x-auto */}
  <div className="overflow-x-auto mx-4 md:mx-0">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['Unit Code', 'Unit Name', 'Year', 'Type', 'Size', 'Actions'].map((header, index) => (
            <th 
              key={header}
              className={`px-6 py-4 text-left text-sm font-semibold text-gray-600 ${
                index < 2 ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
              }`}
              // onClick={() => index < 2 && handleSort(header.toLowerCase().replace(' ', ''))}
            >
              <div className="flex items-center">
                {header}
                {index < 2 && sortField === header.toLowerCase().replace(' ', '') && (
                  sortDirection === 'asc' ? 
                    <SortAsc className="ml-2 h-4 w-4 text-indigo-500" /> : 
                    <SortDesc className="ml-2 h-4 w-4 text-indigo-500" />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredAndSortedExams.map((exam) => (
          <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam.unitCode}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{exam.unitName}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {exam.year} {exam.semester}
              </span>
            </td>
            <td className="px-6 py-4 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                exam.type === 'Final' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'bg-green-50 text-green-700'
              }`}>
                {exam.type}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{exam.size}</td>
            <td className="px-6 py-4 text-right space-x-3">
              <button 
                className="inline-flex items-center justify-center p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                onClick={() => window.open(exam.pdfUrl, '_blank')}
              >
                <Eye className="h-5 w-5" />
              </button>
              <button 
                className="inline-flex items-center justify-center p-2 rounded-lg text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = exam.pdfUrl;
                  link.download = `${exam.unitCode}_${exam.type}_${exam.year}.pdf`;
                  link.click();
                }}
              >
                <Download className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </div>
      <Footer/>
    </div>
  );
};

export default ExamsBank;