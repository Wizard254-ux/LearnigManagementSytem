import React, { useState } from 'react';
import { Search, Plus, Edit2, X, Check } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const LecturerManagementSystem = () => {
  // Sample data structure for departments, courses, and units
  const [departments] = useState([
    {
      id: 1,
      name: 'Communication and Information Technology',
      shortName: 'CIT',
      courses: [
        { id: 1, name: 'Information Technology', shortName: 'IT' },
        { id: 2, name: 'Computer Science', shortName: 'CS' },
      ],
    },
  ]);

  // Units with course and department associations
  const [units] = useState([
    {
      id: 1,
      name: 'Programming Fundamentals',
      department: 'CIT',
      course: 'IT',
    },
    {
      id: 2,
      name: 'Database Systems',
      department: 'CIT',
      course: 'IT',
    },
    {
      id: 3,
      name: 'IT Project Management',
      department: 'CIT',
      course: 'IT',
    },
    {
      id: 4,
      name: 'Computer Architecture',
      department: 'CIT',
      course: 'CS',
    },
    {
      id: 5,
      name: 'Network Security',
      department: 'CIT',
      course: 'CS',
    },
    {
      id: 6,
      name: 'Data Communication',
      department: 'CIT',
      course: 'IT', // Common unit for IT and CS
    },
    {
      id: 7,
      name: 'Software Engineering',
      department: 'CIT',
      course: 'CS', // Common unit for IT and CS
    },
  ]);

  // Lecturers state
  const [lecturers, setLecturers] = useState([
    {
      id: 1,
      name: 'John Doe',
      staffNumber: 'LEC001',
      department: 'CIT',
      units: ['Programming Fundamentals', 'Database Systems'],
      isActive: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      staffNumber: 'LEC002',
      department: 'CIT',
      units: ['Computer Architecture'],
      isActive: true,
    },
  ]);

  // UI states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [newLecturer, setNewLecturer] = useState({
    name: '',
    staffNumber: '',
    department: '',
    course: '',
    units: [],
    isActive: true,
  });
  const [selectedCourse, setSelectedCourse] = useState(''); // For filtering units by course

  // Filtered lecturers based on search
  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.staffNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler functions
  const handleAddLecturer = () => {
    if (!newLecturer.name || !newLecturer.staffNumber || !newLecturer.department) {
      alert('Please fill in all required fields.');
      return;
    }

    const lecturer = {
      id: lecturers.length + 1,
      ...newLecturer,
    };
    setLecturers([...lecturers, lecturer]);
    setNewLecturer({
      name: '',
      staffNumber: '',
      department: '',
      course: '',
      units: [],
      isActive: true,
    });
    setShowAddModal(false);
  };

  const handleEditLecturer = () => {
    if (!editingLecturer.name || !editingLecturer.staffNumber || !editingLecturer.department) {
      alert('Please fill in all required fields.');
      return;
    }

    setLecturers(
      lecturers.map((lecturer) =>
        lecturer.id === editingLecturer.id ? editingLecturer : lecturer
      )
    );
    setShowEditModal(false);
  };

  const handleToggleStatus = (lecturer) => {
    setLecturers(
      lecturers.map((l) =>
        l.id === lecturer.id ? { ...l, isActive: !l.isActive } : l
      )
    );
  };

  // Get available units for a department and course
  const getAvailableUnits = (department, course) => {
    return units.filter(
      (unit) =>
        unit.department === department && (!course || unit.course === course)
    );
  };

  // Toggle unit assignment
  const handleToggleUnit = (unitName) => {
    setEditingLecturer((prev) => ({
      ...prev,
      units: prev.units.includes(unitName)
        ? prev.units.filter((unit) => unit !== unitName) // Remove unit
        : [...prev.units, unitName], // Add unit
    }));
  };

  // Get courses for a selected department
  const getCoursesForDepartment = (department) => {
    const dept = departments.find((dept) => dept.shortName === department);
    return dept ? dept.courses : [];
  };

  return (
    <div className="min-h-screen bg-gray-500 ">
        <NavBar/>
      {/* Header */}
      <div className='px-10'>
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Management </h1>
        <p className="text-gray-600">Manage lecturers, departments, and unit assignments</p>
      </div>

      {/* Search and Add Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search lecturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Lecturer
        </button>
      </div>

      {/* Lecturers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLecturers.map((lecturer) => (
              <tr key={lecturer.id}>
                <td className="px-6 py-4">{lecturer.name}</td>
                <td className="px-6 py-4">{lecturer.staffNumber}</td>
                <td className="px-6 py-4">{lecturer.department}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {lecturer.units.map((unit) => (
                      <span key={unit} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {unit}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      lecturer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {lecturer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditingLecturer(lecturer);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(lecturer)}
                    className={`${
                      lecturer.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {lecturer.isActive ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lecturer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Lecturer</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newLecturer.name}
                onChange={(e) => setNewLecturer({ ...newLecturer, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Staff Number"
                value={newLecturer.staffNumber}
                onChange={(e) => setNewLecturer({ ...newLecturer, staffNumber: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <select
                value={newLecturer.department}
                onChange={(e) =>
                  setNewLecturer({ ...newLecturer, department: e.target.value, units: [] })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.shortName}>
                    {department.name}
                  </option>
                ))}
              </select>
              {newLecturer.department && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter Units by Course
                  </label>
                  <select
                    value={newLecturer.course}
                    onChange={(e) =>
                      setNewLecturer({ ...newLecturer, course: e.target.value, units: [] })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Courses</option>
                    {getCoursesForDepartment(newLecturer.department).map((course) => (
                      <option key={course.id} value={course.shortName}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {newLecturer.department && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Units
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableUnits(newLecturer.department, newLecturer.course)
                      .filter((unit) => !newLecturer.units.includes(unit.name))
                      .map((unit) => (
                        <button
                          key={unit.id}
                          onClick={() =>
                            setNewLecturer({
                              ...newLecturer,
                              units: [...newLecturer.units, unit.name],
                            })
                          }
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                        >
                          {unit.name} ({unit.course})
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {newLecturer.units.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Units
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {newLecturer.units.map((unit) => {
                      const unitData = units.find((u) => u.name === unit);
                      return (
                        <button
                          key={unit}
                          onClick={() =>
                            setNewLecturer({
                              ...newLecturer,
                              units: newLecturer.units.filter((u) => u !== unit),
                            })
                          }
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                        >
                          {unit} ({unitData?.course}) <X className="inline h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLecturer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Lecturer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lecturer Modal */}
      {showEditModal && editingLecturer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Lecturer</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingLecturer.name}
                onChange={(e) =>
                  setEditingLecturer({ ...editingLecturer, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Staff Number"
                value={editingLecturer.staffNumber}
                onChange={(e) =>
                  setEditingLecturer({ ...editingLecturer, staffNumber: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <select
                value={editingLecturer.department}
                onChange={(e) =>
                  setEditingLecturer({ ...editingLecturer, department: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.shortName}>
                    {department.name}
                  </option>
                ))}
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Units by Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Courses</option>
                  {getCoursesForDepartment(editingLecturer.department).map((course) => (
                    <option key={course.id} value={course.shortName}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Units
                </label>
                <div className="flex flex-wrap gap-2">
                  {getAvailableUnits(editingLecturer.department, selectedCourse)
                    .filter((unit) => !editingLecturer.units.includes(unit.name))
                    .map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => handleToggleUnit(unit.name)}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                      >
                        {unit.name} ({unit.course})
                      </button>
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Units
                </label>
                <div className="flex flex-wrap gap-2">
                  {editingLecturer.units.map((unit) => {
                    const unitData = units.find((u) => u.name === unit);
                    return (
                      <button
                        key={unit}
                        onClick={() => handleToggleUnit(unit)}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                      >
                        {unit} ({unitData?.course}) <X className="inline h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditLecturer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    <Footer/>
    </div>
  );
};

export default LecturerManagementSystem;