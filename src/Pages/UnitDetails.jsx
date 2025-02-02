import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Book, User, Mail, Clock, FileText } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const UnitDetail = () => {
  const { unitId } = useParams();
  const [unitDetails, setUnitDetails] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = () => {
      const unitData = {
        SIT120: {
          name: 'Programming Methodology',
          description: 'Introduction to programming...',
          assignments: [
            { title: 'Assignment 1', dueDate: '2025-02-01', description: 'Introduction to functions' },
            { title: 'Assignment 2', dueDate: '2025-03-01', description: 'Loops and arrays' }
          ],
          topics: [
            { name: 'Variables and Data Types', notes: 'path/to/notes1.pdf' },
            { name: 'Control Structures', notes: 'path/to/notes2.pdf' }
          ],
          lecturer: { name: 'Dr. John Doe', email: 'johndoe@university.edu' }
        },
      };
      setUnitDetails(unitData[unitId]);
    };

    fetchUnitDetails();
  }, [unitId]);

  if (!unitDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filterAssignments = (assignments) => {
    const currentDate = new Date();
    return assignments.filter(assignment => new Date(assignment.dueDate) > currentDate);
  };

  const getDueStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 7) return 'bg-red-100 text-red-800';
    if (daysUntilDue <= 14) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className=" mx-auto pb-6 min-h-screen flex flex-col">
        <NavBar />
      {/* Header Section */}
      <div className='mx-6 flex-1' style={{}} >
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg mt-8 shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">{unitDetails.name}</h1>
        <p className="text-lg opacity-90">{unitDetails.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assignments Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Assignments
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filterAssignments(unitDetails.assignments).map((assignment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center ${getDueStatus(assignment.dueDate)}`}>
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{assignment.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              Course Topics
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {unitDetails.topics.map((topic, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{topic.name}</h3>
                    <a
                      href={topic.notes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Notes
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lecturer Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Lecturer Information
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="font-semibold">{unitDetails.lecturer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <a
                href={`mailto:${unitDetails.lecturer.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {unitDetails.lecturer.email}
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  )
};

export default UnitDetail;