import React from 'react';
import { 
  Users, BookOpen, Clock, Calendar,
  Mail, Phone, Award, GraduationCap,
  MapPin, Building
} from 'lucide-react';
import NavBar from '../Components/NavBar';

const StatsCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-indigo-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-indigo-600" />
    </div>
  </div>
);

const LecturerDashboard = () => {
  const universityInfo = {
    name: "Machakos University",
    department: "School of Communication & Information Technology (CIT)",
    campus: "Melbourne Campus",
    facultyName: "Faculty of Science & Technology"
  };

  const lecturerInfo = {
    name: "Dr. Dickson Esamai",
    staffId: "L1234567",
    position: "Senior Lecturer",
    email: "s.mitchell@aiu.edu",
    phone: "(03) 9123 4567",
    office: "Building BA, Room 5.23",
    consultationHours: "Tuesday & Thursday, 2-4 PM"
  };

  const weeklySchedule = [
    {
      day: "Monday",
      classes: [
        {
          time: "10:00 - 12:00",
          unit: "SIT725",
          type: "Lecture",
          location: "Building BA 2.01"
        },
        {
          time: "14:00 - 16:00",
          unit: "SIT725",
          type: "Lab",
          location: "Computing Lab 3.12"
        }
      ]
    },
    {
      day: "Tuesday",
      classes: [
        {
          time: "13:00 - 15:00",
          unit: "SIT737",
          type: "Lecture",
          location: "Online"
        }
      ]
    },
    {
      day: "Wednesday",
      classes: [
        {
          time: "10:00 - 12:00",
          unit: "SIT780",
          type: "Lecture",
          location: "Building BC 3.02"
        }
      ]
    },
    {
      day: "Thursday",
      classes: [
        {
          time: "09:00 - 11:00",
          unit: "SIT737",
          type: "Tutorial",
          location: "Online"
        }
      ]
    },
    {
      day: "Friday",
      classes: [
        {
          time: "13:00 - 15:00",
          unit: "SIT780",
          type: "Lab",
          location: "Computing Lab 2.10"
        }
      ]
    }
  ];

  const teachingUnits = [
    {
      code: "SIT725",
      name: "Software Engineering",
      students: 120,
      schedule: "Mon 10:00-12:00, Wed 14:00-16:00",
      mode: "In-person & Online",
      campus: "Melbourne Campus",
      nextClass: "2025-02-03 10:00"
    },
    {
      code: "SIT737",
      name: "Cloud Computing",
      students: 85,
      schedule: "Tue 13:00-15:00, Thu 09:00-11:00",
      mode: "Online",
      campus: "Online",
      nextClass: "2025-02-04 13:00"
    },
    {
      code: "SIT780",
      name: "Enterprise Applications Development",
      students: 95,
      schedule: "Wed 10:00-12:00, Fri 13:00-15:00",
      mode: "In-person",
      campus: "Melbourne Campus",
      nextClass: "2025-02-05 10:00"
    }
  ];

  return (
    <div className="min-h-screen bg-indigo-50">
        <NavBar/>
      {/* University Header Banner */}
      {/* <div className="bg-indigo-900 text-white px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
          <p className="text-indigo-200">{universityInfo.campus}</p>
          </div>
          </div>
          </div> */}

      {/* Department & Lecturer Info */}
      <div className="bg-indigo-600 text-white px-6 py-8 mx-5 mt-4 rounded-md">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold">{universityInfo.name}</h2>
          <div className="mb-4">
            {/* <p className="text-indigo-200">{universityInfo.facultyName}</p> */}
            <h3 className="text-xl font-semibold">{universityInfo.department}</h3>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{lecturerInfo.name}</h1>
              <p className="text-indigo-200 mt-1">{lecturerInfo.position}</p>
              <p className="text-indigo-200">Staff ID: {lecturerInfo.staffId}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{lecturerInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{lecturerInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{lecturerInfo.office}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Units" 
            value={teachingUnits.length} 
            icon={BookOpen} 
          />
          <StatsCard 
            title="Total Students" 
            value={teachingUnits.reduce((sum, unit) => sum + unit.students, 0)} 
            icon={Users} 
          />
          <StatsCard 
            title="Consultation Hours" 
            value={lecturerInfo.consultationHours} 
            icon={Clock} 
          />
        </div>

        {/* Weekly Timetable */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Weekly Timetable</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weeklySchedule.map((day) => (
                <div key={day.day} className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 mb-3">{day.day}</h3>
                  <div className="space-y-3">
                    {day.classes.map((session, index) => (
                      <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                        <p className="text-sm font-semibold text-indigo-600">{session.time}</p>
                        <p className="text-sm font-medium text-gray-900">{session.unit}</p>
                        <p className="text-xs text-gray-600">{session.type}</p>
                        <p className="text-xs text-gray-600">{session.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Teaching Units */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Teaching Units</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {teachingUnits.map((unit) => (
                <div 
                  key={unit.code}
                  className="bg-indigo-50 rounded-lg p-6 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {unit.code} - {unit.name}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Schedule:</span> {unit.schedule}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Mode:</span> {unit.mode}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Campus:</span> {unit.campus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm">
                        {unit.students} Students
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Next Class: {new Date(unit.nextClass).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;