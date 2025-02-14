import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book, User, Mail, Phone, Building, FileText } from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { api } from '../Auth/api';

const UnitDetail = () => {
  const { unitId } = useParams();
  const [unitDetails, setUnitDetails] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const response = await api.get(`api/student/unitInfo/${unitId}`);
        setUnitDetails(response.data);
      } catch (error) {
        console.error('Error fetching unit details:', error);
      }
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Unit Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{unitDetails.unit.name}</h1>
          <div className="text-white opacity-90">
            <p className="text-xl mb-2">Code: {unitDetails.unit.code}</p>
            <p className="text-lg">{unitDetails.unit.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lecturers Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b p-6 bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Lecturers
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {unitDetails.lecturers.map((lecturer) => (
                  <div key={lecturer.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">{lecturer.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800">
                          {lecturer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{lecturer.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{lecturer.department}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b p-6 bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Book className="h-5 w-5 text-blue-600" />
                Unit Notes Materials
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {unitDetails.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold">{note.title}</h3>
                      <div className="flex gap-2">
                        {note.fileNames.map((fileName, index) => (
                          <a
                            key={index}
                            // href="#"
                            href={`${api.defaults.baseURL}api/file/downloadNotes/${fileName}`} // Replace with your backend URL
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Uploaded by: {note.lecturers.map(lec => lec.name).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UnitDetail;