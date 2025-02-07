import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, X, Check,Trash } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import {
  fetchLecturers,
  addLecturer,
  updateLecturer,
  deleteLecturer,
  fetchDepartments,
  fetchCourses,
  fetchUnits,
  api
} from "../Auth/api"
const LecturerManagementSystem = () => {
  const [departments, setDepartments] = useState([]);
  const [units, setUnits] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [loading,setLoading]=useState(false)

  const [newLecturer, setNewLecturer] = useState({
    name: '',
    staffNumber: '',
    department: { id: '', name: '' },
    units: [],
    email:'',
    phoneNumber:'',
    isActive: true,
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [addedUnits, setAddedUnits] = useState([]);
  const [removedUnits, setRemovedUnits] = useState([]);

  useEffect(() => {
    fetchDepartments().then(data => {
      const departmentsData = data.map(each => {
        return {
          name: each.name,
          id: each._id,
          shortName: each.name,
          courses: each.courses.map(course => {
            return { name: course.name, id: course._id, shortName: course.name }
          })
        }
      })
      setDepartments(departmentsData);
    });

    fetchUnits().then(data => {
      console.log('fetched units ',data)
      const unitsData = data.map(each => {
        return { name: each.name, id: each._id, course: each.course.name, code: each.code }
      })
      console.log('units data',unitsData)
      setUnits(unitsData);
    });

    fetchLecturers().then(data => {
      const lecturersData = data.map(each => {
        return {
          name: each.name,
          id: each._id,
          email:each.email,
          phoneNumber:each.phoneNumber,
          staffNumber: each.staffNumber,
          department: { name: each.department.name, id: each.department._id },
          isActive: each.isActive,
          units: each.units.map(e => {
            return { name: e.name, id: e._id }
          })
        }
      })
      console.log('settign lecturer ',lecturersData)
      setLecturers(lecturersData);
    });
  }, []);

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.staffNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLecturer =async () => {
    if (!newLecturer.name || !newLecturer.staffNumber || !newLecturer.department.id) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true)
      const lecturer = {
        id: lecturers.length + 1,
        ...newLecturer,
      };
      setLecturers([...lecturers, lecturer]);
      const res =await addLecturer(lecturer);
      console.log(res);
      setNewLecturer({
        name: '',
        staffNumber: '',
        department: { id: '', name: '' },
        units: [],
        isActive: true,
        email:'',
        phoneNumber:''
      });
      setShowAddModal(false);
      setLoading(false)
    } catch (error) {
      console.log(error);
      if(!error.status){
        alert('check your internet connection and try again')
      }
      alert('Error ',error.message)
      setLoading(false)
    }
  };

  const handleEditLecturer = () => {
    const originalLecturer = lecturers.find((l) => l.id === editingLecturer.id);
    const changes = {};

    if (originalLecturer.email !== editingLecturer.email) changes.email = editingLecturer.email;
    if (originalLecturer.phoneNumber !== editingLecturer.phoneNumber) changes.phoneNumber = editingLecturer.phoneNumber;
    if (originalLecturer.name !== editingLecturer.name) changes.name = editingLecturer.name;
    if (originalLecturer.department.id !== editingLecturer.department.id) changes.department = editingLecturer.department;
    if (JSON.stringify(originalLecturer.units) !== JSON.stringify(editingLecturer.units)) {
      changes.units = {
        added: addedUnits,
        removed: removedUnits,
      };
    }
    changes.lecturerId=editingLecturer.id
    if (originalLecturer.isActive !== editingLecturer.isActive) changes.isActive = editingLecturer.isActive;
    setLoading(true)
    console.log('Changes made:', changes);

    // Send changes to the backend
    updateLecturer(changes).then(() => {
      setLecturers(
        lecturers.map((lecturer) =>
          lecturer.id === editingLecturer.id ? editingLecturer : lecturer
        )
      );
      setShowEditModal(false);
      setAddedUnits([]);
      setRemovedUnits([]);
      setLoading(false)
    });
  };

  const handleToggleStatus = (lecturer) => {
    console.log('revers of whats theor ',!lecturer.isActive)
    updateLecturer({isActive:!lecturer.isActive,lecturerId:lecturer.id}).then(()=>{

      setLecturers(
        lecturers.map((l) =>
          l.id === lecturer.id ? { ...l, isActive: !l.isActive } : l
      )
    );
    })
    return;
  };

  const getAvailableUnits = (course) => {
    // Get all units that match the course filter (or all units if no course selected)
    const courseFilteredUnits = units.filter((unit) => !course || unit.course === course);
    
    // Get all assigned units across all lecturers (except the current editing lecturer)
    const assignedUnitIds = new Set();
    lecturers.forEach(lecturer => {
      // Skip the current editing lecturer's units when in edit mode
      if (editingLecturer && lecturer.id === editingLecturer.id) {
        return;
      }
      lecturer.units.forEach(unit => {
        assignedUnitIds.add(unit.id);
      });
    });

    // Filter out units that are already assigned to other lecturers
    return courseFilteredUnits.filter(unit => !assignedUnitIds.has(unit.id));
  };


  const handleAddUnit = (unitId, unitName) => {
    setEditingLecturer((prev) => ({
      ...prev,
      units: [...prev.units, { id: unitId, name: unitName }],
    }));
    setAddedUnits((prev) => [...prev, { id: unitId, name: unitName }]);
  };

  const handleRemoveUnit = (unitId) => {
    const removedUnit = editingLecturer.units.find((unit) => unit.id === unitId)
    console.log(unitId)
    setEditingLecturer((prev) => ({
      ...prev,
      units: prev.units.filter((unit) => unit.id !== unitId),
    }));
    setRemovedUnits((prev) => [...prev, removedUnit]);
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = departments.find((dept) => dept.id === e.target.value);
    const changes = {
      department: {
        from: editingLecturer.department.name,
        to: selectedDept.name,
      },
    };
    console.log('Department changed:', changes);

    setEditingLecturer({
      ...editingLecturer,
      department: { id: selectedDept.id, name: selectedDept.shortName },
    });
  };

  const getCoursesForDepartment = (department) => {
    const dept = departments.find((dept) => dept.shortName === department);
    return dept ? dept.courses : [];
  };

  const handleDelete = async (lecturerId) => {
    console.log(lecturerId)
    try {
        const response = await deleteLecturer(lecturerId);

      // Update the lecturers list by filtering out the deleted lecturer
      setLecturers(prevLecturers => 
        prevLecturers.filter(lecturer => lecturer.id !== lecturerId)
      );
    } catch (error) {
      alert("Error ",error)
      console.error('Error deleting lecturer:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <div className="px-2 md:px-11 flex-1 mb-6">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Management </h1>
          <p className="text-gray-600">Manage lecturers, departments, and unit assignments</p>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between gap-2 items-center">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PhoneNumber</th>
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
                    <td className="px-6 py-4">{lecturer.email}</td>
                    <td className="px-6 py-4">{lecturer.phoneNumber}</td>
                    <td className="px-6 py-4">{lecturer.department.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {lecturer.units.map((unit) => (
                          <span key={unit.id} className=" text-blue-800 rounded-full text-base">
                            {unit.name},
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
                          console.log(lecturer)
                          setEditingLecturer(lecturer);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>{if (window.confirm(`Are you sure you want to deactivate ${lecturer.name} ,Staff Number ${lecturer.staffNumber} ?`)) {
                          handleToggleStatus(lecturer)                        }}}
                        className={`${
                          lecturer.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {lecturer.isActive ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="p-3">
                <div className="relative">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${lecturer.name}?`)) {
                        handleDelete(lecturer.id);
                      }
                    }}
                    className="flex items-center px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Lecturer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6  max-h-[90%] overflow-auto w-full max-w-md">
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
                <input
                  type="text"
                  placeholder="Email"
                  value={newLecturer.email}
                  onChange={(e) => setNewLecturer({ ...newLecturer, email: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Phone Number "
                  value={newLecturer.phoneNumber}
                  onChange={(e) => setNewLecturer({ ...newLecturer, phoneNumber: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                <select
                  value={newLecturer.department.id}
                  onChange={(e) => {
                    const selectedDept = departments.find((dept) => dept.id === e.target.value);
                    setNewLecturer({
                      ...newLecturer,
                      department: { id: selectedDept.id, name: selectedDept.shortName },
                    });
                  }}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {newLecturer.department.id && (
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
                      {getCoursesForDepartment(newLecturer.department.name).map((course) => (
                        <option key={course.id} value={course.shortName}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {newLecturer.department.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Units
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableUnits(selectedCourse)
                        .filter((unit) => !newLecturer.units.some((u) => u.id === unit.id))
                        .map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() =>
                              setNewLecturer({
                                ...newLecturer,
                                units: [...newLecturer.units, { id: unit.id, name: unit.name }],
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
                        const unitData = units.find((u) => u.id === unit.id);
                        return (
                          <button
                            key={unit.id}
                            onClick={() =>
                              setNewLecturer({
                                ...newLecturer,
                                units: newLecturer.units.filter((u) => u.id !== unit.id),
                              })
                            }
                            className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                          >
                            {unit.name} ({unitData?.course}) <X className="inline h-4 w-4" />
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
                    {loading?"Adding Lecturer...":
                    "Add Lecturer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Lecturer Modal */}
        {showEditModal && editingLecturer && (
          <div className="fixed z-[100000000] inset-0 bg-black bg-opacity-50 flex items-center  justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90%] overflow-auto">
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
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={editingLecturer.email}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
                <input
                  type="text"
                  placeholder="phoneNumber"
                  value={editingLecturer.phoneNumber}
                  onChange={(e) =>
                    setEditingLecturer({ ...editingLecturer, phoneNumber: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
                <select
                  value={editingLecturer.department.id}
                  onChange={handleDepartmentChange}
                  className="w-full p-2 border rounded-lg"
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
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
                    {getCoursesForDepartment(editingLecturer.department.name).map((course) => (
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
                    {getAvailableUnits(selectedCourse)
                      .filter((unit) => !editingLecturer.units.some((u) => u.id === unit.id))
                      .map((unit) => (
                        <button
                          key={unit.id}
                          onClick={() => handleAddUnit(unit.id, unit.name)}
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
                      console.log(unit,'editiing unit')
                      const unitData = units.find((u) => u.id === unit.id);
                      return (
                        <button
                          key={unit.id}
                          onClick={() => handleRemoveUnit(unit.id)}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                        >
                          {unit.name} ({unitData?.course}) <X className="inline h-4 w-4" />
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
                    {loading?"Saving Changes.....":"Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LecturerManagementSystem;