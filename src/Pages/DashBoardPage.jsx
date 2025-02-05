import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Calendar, Clock,
  RefreshCw, Award, Book, 
  FileText, BarChart2,
  ChevronRight, Paperclip
} from 'lucide-react';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { api } from '../Auth/api';

const Dashboard = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 hours ago');
  const [courseData, setCourseData] = useState(null); // State to store fetched course data
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch course data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('api/student/getStudentCourseDetails');
        console.log(response.data);
        setCourseData(response.data); // Store the fetched data in state
      } catch (error) {
        console.log(error);
        alert('An error occurred. Please try again.');
      }
    };

    fetchData();
  }, []);

  // Handle sync button click
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync('Just now');
    }, 2000);
  };

  // Handle unit click
  const handleUnitClick = (unitId) => {
    // navigate(`/Units/${unitId}`);
    return
  };

  // Extract registered units from the fetched data
  const registeredUnits = courseData?.units.map((unit) => ({
    code: unit.code, // Use unit ID as the code
    name: unit.name,
    status: 'synced', // Default status (can be updated based on backend data)
    lastUpdated: '1 hour ago' // Default last updated time
  })) || [];

  // Extract upcoming deadlines from the fetched data
  const upcomingDeadlines = courseData?.units.flatMap((unit) =>
    unit.assignments.map((assignment) => ({
      unit: unit.name,
      task: assignment.Title,
      dueDate: assignment.submissionDeadline,
      type: 'assignment',
      fileNames: assignment.fileNames // Include fileNames in the deadlines
    }))
  ) || [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header with Welcome Message */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, {user.username}</h1>
          <p className="opacity-90">Track your academic progress and upcoming deadlines</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">{courseData?.units.length || 0}</p>
                  <p className="text-sm opacity-90">Enrolled Units</p>
                  <p className="text-xs opacity-75">Current Semester</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">75%</p>
                  <p className="text-sm opacity-90">Average Grade</p>
                  <p className="text-xs opacity-75">Across All Units</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BarChart2 className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">45%</p>
                  <p className="text-sm opacity-90">Completion</p>
                  <p className="text-xs opacity-75">Semester Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Sync Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Registered Units</h2>
              <button 
                onClick={handleSync}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Units'}</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last synced: {lastSync}</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {registeredUnits.map((unit) => (
              <div 
                key={unit.code}
                onClick={() => handleUnitClick(unit.code)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600">{unit.name}</h3>
                    <p className="text-gray-500">{unit.code}</p>
                    <p className="text-sm text-gray-500 mt-1">Last updated: {unit.lastUpdated}</p>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Deadlines</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    deadline.type === 'assignment' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {deadline.type === 'assignment' ? <FileText /> : <Book />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{deadline.task}</h3>
                    <p className="text-sm text-gray-500">{deadline.unit}</p>
                    {/* Display file download links */}
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Paperclip className="h-4 w-4 mr-2" />
                      {deadline.fileNames.map((fileName, fileIndex) => (
                        <a
                          key={fileIndex}
                          href={`${api.defaults.baseURL}api/file/download/${fileName}`} // Replace with your backend URL
                          download
                          className="text-indigo-600 hover:underline mr-2"
                        >
                          {fileName}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(deadline.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Dashboard;