import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import CustomAlert from '../Components/CustomAlert';
import { api } from '../Auth/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [units, setUnits] = useState([]);
  const [students, setStudents] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [departmentForm, setDepartmentForm] = useState({
    name: ''
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    departmentId: ''
  });

  const [unitForm, setUnitForm] = useState({
    name: '',
    code: '',
    description: '',
    courseId: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchUnits();
    fetchStudents();
  }, []);


  // Add student form state
  const [studentForm, setStudentForm] = useState({
    studentNumber: '',
    courseCode: '',
    isActive: true
  });


  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error fetching departments', 'error');
    }
  };


  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      // Store the courses with their department information
      console.log('fetched courses ',response.data)
      setCourses(response.data);

    } catch (error) {
      showAlert(error.response?.data?.error || 'Error fetching courses', 'error');
    }
  };



  const handleCourseDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/api/courses/${id}`);
        showAlert('Course deleted successfully', 'success');
        fetchCourses();
        fetchDepartments(); // Also refresh departments since course list changed
      } catch (error) {
        showAlert(error.response?.data?.error || 'Error deleting course', 'error');
      }
    }
  };

  const handleUnitDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await api.delete(`/api/units/${id}`);
        showAlert('Unit deleted successfully', 'success');
        fetchUnits();
        fetchCourses(); // Also refresh courses since unit list changed
      } catch (error) {
        showAlert(error.response?.data?.error || 'Error deleting unit', 'error');
      }
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await api.get('/api/units');
      setUnits(response.data);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error fetching units', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students');
      const data = response.data;
      console.log(data)
      setStudents(data);
    } catch (error) {
      showAlert('Error fetching students', 'error');
    }
  };


  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await api.put(`/api/departments/${editingDepartment._id}`, {
          name: departmentForm.name
        });
        showAlert('Department updated successfully', 'success');
      } else {
        await api.post('/api/departments', {
          name: departmentForm.name
        });
        showAlert('Department added successfully', 'success');
      }
      fetchDepartments();
      setDepartmentForm({ name: '' });
      setEditingDepartment(null);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error with department operation', 'error');
    }
  };

  const handleDepartmentEdit = (department) => {
    setEditingDepartment(department);
    setDepartmentForm({ name: department.name });
  };

  const handleDepartmentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/api/departments/${id}`);
        showAlert('Department deleted successfully', 'success');
        fetchDepartments();
      } catch (error) {
        showAlert(error.response?.data?.error || 'Error deleting department', 'error');
      }
    }
  };


  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await api.post('/api/courses', {
        name: courseForm.name,
        code: courseForm.code,
        departmentId: courseForm.departmentId
      });
      console.log(res.data)
      showAlert('Course added successfully', 'success');
      fetchCourses();
      setCourseForm({ name: '', code: '', departmentId: '' });
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error adding course', 'error');
    }
  };

  const handleUnitSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/units', unitForm);
      showAlert('Unit added successfully', 'success');
      fetchUnits();
      setUnitForm({ name: '', code: '', description: '', courseId: '' });
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error adding unit', 'error');
    }
  };
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update existing student
        await api.put(`/api/students/${editingStudent._id}`, studentForm);
        showAlert('Student updated successfully', 'success');
      } else {
        // Create new student
        await api.post('/api/students', studentForm);
        showAlert('Student added successfully', 'success');
      }
      fetchStudents();
      setStudentForm({ studentNumber: '', courseCode: '', isActive: true });
      setEditingStudent(null);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error with student operation', 'error');
    }
  };

  const handleStudentEdit = (student) => {
    setEditingStudent(student);
    setStudentForm({
      studentNumber: student.studentNumber,
      courseCode: student.courseCode,
      isActive: student.isActive
    });
  };

  const handleStudentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/api/students/${id}`);
        showAlert('Student deleted successfully', 'success');
        fetchStudents();
      } catch (error) {
        showAlert(error.response?.data?.error || 'Error deleting student', 'error');
      }
    }
  };




  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      {alert.show && <CustomAlert message={alert.message} type={alert.type} />}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'departments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('departments')}
            >
              Departments
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('courses')}
            >
              Courses
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'units' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('units')}
            >
              Units
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
          </div>

          {activeTab === 'departments' && (
            <div>
              <form onSubmit={handleDepartmentSubmit} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Department Name</label>
                  <input
                    type="text"
                    value={departmentForm.name}
                    onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingDepartment ? 'Update Department' : 'Add Department'}
                </button>
                {editingDepartment && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDepartment(null);
                      setDepartmentForm({ name: '' });
                    }}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Existing Departments</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departments.map((department) => (
                        <tr key={department._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{department.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{department.courses?.length || 0} courses</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleDepartmentEdit(department)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDepartmentDelete(department._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <form onSubmit={handleCourseSubmit} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select
                    value={courseForm.departmentId}
                    onChange={(e) => setCourseForm({...courseForm, departmentId: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name</label>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter course code"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Course
                </button>
              </form>

              {/* Courses List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Existing Courses</h3>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {courses.map((course) => (
          <tr key={course._id}>
            <td className="px-6 py-4 whitespace-nowrap">{course.code}</td>
            <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {course.departmentName || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{course.units?.length || 0} units</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button 
                onClick={() => handleCourseDelete(course._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              </div>
            </div>
          )}
          {/* Units Tab */}
          {activeTab === 'units' && (
            <div>
              <form onSubmit={handleUnitSubmit} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Name</label>
                  <input
                    type="text"
                    value={unitForm.name}
                    onChange={(e) => setUnitForm({...unitForm, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter unit name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Code</label>
                  <input
                    type="text"
                    value={unitForm.code}
                    onChange={(e) => setUnitForm({...unitForm, code: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter unit code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={unitForm.description}
                    onChange={(e) => setUnitForm({...unitForm, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter unit description"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course</label>
                  <select
                    value={unitForm.courseId}
                    onChange={(e) => setUnitForm({...unitForm, courseId: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Unit
                </button>
              </form>

              {/* Units List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Existing Units</h3>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {units.map((unit) => (
          <tr key={unit._id}>
            <td className="px-6 py-4 whitespace-nowrap">{unit.code}</td>
            <td className="px-6 py-4 whitespace-nowrap">{unit.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{unit.description}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button 
                onClick={() => handleUnitDelete(unit._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              <form onSubmit={handleStudentSubmit} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Student Number</label>
                  <input
                    type="text"
                    value={studentForm.studentNumber}
                    onChange={(e) => setStudentForm({...studentForm, studentNumber: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Enter student number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course</label>
                  <select
                    value={studentForm.courseCode}
                    onChange={(e) => setStudentForm({...studentForm, courseCode: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.code}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={studentForm.isActive}
                    onChange={(e) => setStudentForm({...studentForm, isActive: e.target.value === 'true'})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                  {editingStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudent(null);
                        setStudentForm({ studentNumber: '', courseCode: '', isActive: true });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Students List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Existing Students</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{student.studentNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {courses.find(c => c.code === student.courseCode)?.name || student.courseCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs ${
                              student.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleStudentEdit(student)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleStudentDelete(student._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;