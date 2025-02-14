import React, { useEffect, useState,useRef } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { api, getLecUnits } from '../Auth/api';
import { 
  Users, BookOpen, Clock, Upload, FileText, 
  Mail, Phone, Award, GraduationCap,
  MapPin, Building, Paperclip, Trash2, Eye
} from 'lucide-react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import CustomAlert from '../Components/CustomAlert';

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
  const user=JSON.parse(localStorage.getItem('user'))
  console.log(user)
  const fileInputRef = useRef(null);

  const [categorizedUnits, setCategorizedUnits] = useState([]);
  const [totalUnits,setTotalUnits]=useState(0)
  const [teachingUnits,setTeachingUnits]=useState([])
  const [assignments, setAssignments] = useState({});
  const [submissions, setSubmissions] = useState({
    "SIT725": {},
    "SIT737": {},
    "SIT780": {}
  });
  const [alertConfigs, setAlertConfigs] = useState({
    show:false,
    message:'',
    status:'',
    title:''
  });
  
  const handleShowAlert = (title,status,message) => {
    setAlertConfigs({
      show:true,
      title:title,
      status:status,
      message:message
    })
    // Auto hide after 3 seconds
    // setTimeout(setAlertConfigs(prev=>({...prev,['show']:false})), 3000);
  };


  const [newAssignment, setNewAssignment] = useState({
    unit: "",
    title: "",
    deadline: "",
    file: null
  });

  const [viewSubmissionsModal, setViewSubmissionsModal] = useState({
    isOpen: false,
    unit: "",
    assignmentId: null
  });

  const universityInfo = {
    name: "Machakos University",
    department:user.department,
    campus: "Melbourne Campus",
    facultyName: "Faculty of Science & Technology"
  };

  const lecturerInfo = {
    name: user.name,
    staffId: user.staffNumber,
    position: " Lecturer",
    email: user.email,
    phone: user.phoneNumber,
    // office: "Building BA, Room 5.23",
    consultationHours: "On PhoneCall"
  };




  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await getLecUnits();
        console.log(response);
        setTotalUnits(response.totalUnits)
        setTeachingUnits(response.unitsWithCourses.map((item)=>{
          return item.unit
        }))
        console.log(response.unitsWithCourses)
        // Group units by course
        const groupedData = response.unitsWithCourses.reduce((acc, item) => {
          const courseCode = item.course.code;
          if (!acc[courseCode]) {
            acc[courseCode] = {
              course: item.course,
              units: []
            };
          }
          acc[courseCode].units.push(item.unit);
          console.log(teachingUnits,item.unit)
          return acc;
        }, {});
    
        // Convert the grouped data into an array
        const categorizedUnits = Object.values(groupedData);
    
        // Set the state with the categorized units
        setCategorizedUnits(categorizedUnits);

      }catch (error) {
        console.log(error);
        if(!error.status){
          handleShowAlert("Error","error","check your internet connection and try again")
        }
        handleShowAlert("Error","error",error.response.data.message)
      }
    };
  
    fetchData();
  }, []);
  
  
  const handleAssignmentUpload = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file') {
      // Define allowed file types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
  
      // Convert FileList to Array
      const filesArray = Array.from(files);
  
      // Check if any file is not in allowed types
      const invalidFiles = filesArray.filter(file => !allowedTypes.includes(file.type));
  
      if (invalidFiles.length > 0) {
        alert('Please upload only document files (PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX)');
        // Clear the file input
        e.target.value = '';
        return;
      }
  
      setNewAssignment(prev => ({
        ...prev,
        file: filesArray
      }));
    } else {
      setNewAssignment(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const submitAssignment = async () => {
    if (!newAssignment.unit || !newAssignment.title || !newAssignment.deadline || !newAssignment.file || newAssignment.file.length === 0) {
      alert("Please fill in all assignment details and upload at least one file");
      return;
    }
  
    const formData = new FormData();
    formData.append('unit', newAssignment.unit);
    formData.append('title', newAssignment.title);
    formData.append('deadline', newAssignment.deadline);
    
    // Handle both single and multiple files
    newAssignment.file.forEach(file => {
      formData.append('files', file);
    });
  
    try {
      const response = await api.post('/api/Lec/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Assignment upload response:', response);
  
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  
      // Update the local state with the new assignment
      const newAssignmentEntry = {
        id: Date.now(),
        title: newAssignment.title,
        deadline: newAssignment.deadline,
        fileNames: newAssignment.file.map(file => file.name),
        submissions: 0
      };
  
      setAssignments(prev => ({
        ...prev,
        [newAssignment.unit]: [...(prev[newAssignment.unit] || []), newAssignmentEntry]
      }));
  
      // Reset the form
      setNewAssignment({
        unit: "",
        title: "",
        deadline: "",
        file: null
      });
  
      // Show success message
      alert('Assignment uploaded successfully!');
  
    }catch (error) {
      console.log(error);
      if(!error.status){
        handleShowAlert("Error","error","check your internet connection and try again")
      }
      handleShowAlert("Error","error",error.response.data.message)
      setLoading(false)
    }
  };


  const deleteAssignment = async (unit, assignmentId) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this assignment?');
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      // Make API call to delete the assignment
      await api.delete(`/api/Lec/assignments/${assignmentId}`);
  
      // Safely update assignments state

      setAssignments(prevAssignments => {
        const updatedAssignments = { ...prevAssignments };
        
        if (updatedAssignments[unit] && Array.isArray(updatedAssignments[unit])) {
          // Log before deletion for debugging
          console.log('Before deletion:', updatedAssignments[unit]);
          console.log('Deleting assignment with ID:', assignmentId);
          
          // Filter out the deleted assignment using the id property
          updatedAssignments[unit] = updatedAssignments[unit].filter(
            assignment => assignment.id !== assignmentId
          );
          
          // Log after deletion for debugging
          console.log('After deletion:', updatedAssignments[unit]);
        }
        
        return updatedAssignments;
      });
      // Safely update submissions state
      setSubmissions(prev => {
        const updatedSubmissions = { ...prev };
        // Check if the unit and assignmentId exist before trying to delete
        if (updatedSubmissions[unit] && updatedSubmissions[unit][assignmentId]) {
          const { [assignmentId]: _, ...remainingAssignments } = updatedSubmissions[unit];
          updatedSubmissions[unit] = remainingAssignments;
        }
        return updatedSubmissions;
      });
  
      // Show success message
      alert('Assignment deleted successfully!');
      
    } catch (error) {
      console.log(error);
      if(!error.status){
        handleShowAlert("Error","error","check your internet connection and try again")
      }
      handleShowAlert("Error","error",error.response.data.message)
    }
  };
  const openSubmissionsModal = (unit, assignmentId) => {
    setViewSubmissionsModal({
      isOpen: true,
      unit,
      assignmentId
    });
  };

  const closeSubmissionsModal = () => {
    setViewSubmissionsModal({
      isOpen: false,
      unit: "",
      assignmentId: null
    });
  };

  const addMockSubmission = (unit, assignmentId) => {
    const studentNames = [
      "John Doe", "Jane Smith", "Mike Johnson", 
      "Emily Brown", "Alex Lee", "Sarah Wilson"
    ];

    const randomStudent = studentNames[Math.floor(Math.random() * studentNames.length)];

    setSubmissions(prev => {
      const currentSubmissions = prev[unit][assignmentId] || [];
      return {
        ...prev,
        [unit]: {
          ...prev[unit],
          [assignmentId]: [
            ...currentSubmissions,
            {
              id: Date.now(),
              studentName: randomStudent,
              submissionTime: new Date().toLocaleString(),
              fileName: `submission_${Math.floor(Math.random() * 1000)}.pdf`
            }
          ]
        }
      };
    });

    // Update submissions count in assignments
    setAssignments(prev => ({
      ...prev,
      [unit]: prev[unit].map(assignment => 
        assignment.id === assignmentId 
          ? {...assignment, submissions: assignment.submissions + 1} 
          : assignment
      )
    }));
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get('api/Lec/assignments');
        console.log('fetched assignments', response.data.data);
        
        // Organize assignments by unit code
        const assignmentsByUnit = {};
        const { assignments: fetchedAssignments } = response.data.data;
        
        // Convert the assignments object into our desired format
        Object.keys(fetchedAssignments).forEach(unitCode => {
          assignmentsByUnit[unitCode] = fetchedAssignments[unitCode].map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            deadline: assignment.deadline,
            fileNames: assignment.fileNames,
            submissions: 0, // You can update this if you have submission data
            _id: assignment._id // Keep the MongoDB ID for future operations
          }));
        });
        
        setAssignments(assignmentsByUnit);
      } catch (error) {
        console.log(error);
        if(!error.status){
          handleShowAlert("Error","error","check your internet connection and try again")
        }
        handleShowAlert("Error","error",error.response.data.message)
      }
    };
    
    fetchAssignments();
  }, []);

  const [notes, setNotes] = useState({});
const [newNote, setNewNote] = useState({
  unit: "",
  title: "",
  file: null
});

// Add this function after your existing useEffect hooks
useEffect(() => {
  const fetchNotes = async () => {
    try {
      const response = await api.get('api/lecNotes/getNotes');
      console.log('notes get response ',response.data)
      const notesByUnit = {};
      const { notes: fetchedNotes } = response.data.data;
      const fetchedGroupedNotes = response.data.data.assignments;
      
      // Object.keys(fetchedNotes).forEach(unitCode => {
      //   notesByUnit[unitCode] = fetchedNotes[unitCode].map(note => ({
      //     id: note.id,
      //     title: note.Title,
      //     fileNames: note.fileNames,
      //     _id: note._id
      //   }));
      // });
      
      setNotes(fetchedGroupedNotes);
    } catch (error) {
      console.log(error);
      if(!error.status){
        handleShowAlert("Error","error","check your internet connection and try again")
      }
      handleShowAlert("Error","error",error.response.data.message)
    }
  };
  
  fetchNotes();
}, []);

// Add these handler functions
const handleNoteUpload = (e) => {
  const { name, value, files } = e.target;
  
  if (name === 'file') {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    const filesArray = Array.from(files);
    const invalidFiles = filesArray.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Please upload only document files (PDF, DOC, DOCX, TXT, PPT, PPTX)');
      e.target.value = '';
      return;
    }

    setNewNote(prev => ({
      ...prev,
      file: filesArray
    }));
  } else {
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const submitNote = async () => {
  if (!newNote.unit || !newNote.title || !newNote.file || newNote.file.length === 0) {
    alert("Please fill in all note details and upload at least one file");
    return;
  }

  const formData = new FormData();
  formData.append('unit', newNote.unit);
  formData.append('title', newNote.title);
  
  newNote.file.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/api/lecNotes/postNotes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
   console.log('repsonse ',response.data)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    const newNoteEntry = {
      id:response.data.notes.id,
      title:newNote.title,
      fileNames: newNote.file.map(file => file.name)
    };

    setNotes(prev => ({
      ...prev,
      [newNote.unit]: [...(prev[newNote.unit] || []), newNoteEntry]
    }));

    setNewNote({
      unit: "",
      title: "",
      file: null
    });

    handleShowAlert("Success", "success", "Note uploaded successfully!");

  } catch (error) {
    console.log(error.response);
    handleShowAlert("Error", "error", error.response?.data?.message || "Failed to upload note");
  }
};

const deleteNote = async (unit, noteId) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this note?');
  
  if (!confirmDelete) {
    return;
  }

  try {
    // Log the noteId being sent
    console.log('Deleting note with ID:', noteId);
    
    await api.delete(`/api/lecNotes/deleteNotes/${noteId}`);

    // Update local state only after successful deletion
    setNotes(prevNotes => {
      const updatedNotes = { ...prevNotes };
      if (updatedNotes[unit] && Array.isArray(updatedNotes[unit])) {
        console.log('Before deletion:', updatedNotes[unit]);
        updatedNotes[unit] = updatedNotes[unit].filter(
          note => note.id !== noteId
        );
        console.log('After deletion:', updatedNotes[unit]);
      }
      return updatedNotes;
    });

    handleShowAlert("Success", "success", "Note deleted successfully!");
    
  } catch (error) {
    console.error('Delete error:', error);
    handleShowAlert(
      "Error", 
      "error", 
      error.response?.data?.message || "Failed to delete note"
    );
  }
};
  
  

  console.log('teaching Units',teachingUnits)

  return (
    <div className="min-h-screen bg-indigo-50 w-screen flex flex-col">
      <NavBar/>
      <CustomAlert
        show={alertConfigs.show}
        title={alertConfigs.title}
        message={alertConfigs.message}
        status={alertConfigs.status} // or "error"
        onClose={() => setAlertConfigs(prev=>({...prev,['show']:false}))}
      />

      {/* Department & Lecturer Info */}
      <div className="bg-indigo-600 text-white px-6 py-8 mx-5 mt-4 rounded-md flex-1">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-3">{universityInfo.name}</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{universityInfo.department} Department</h3>
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

      <div className="max-w-7xl mx-auto px-6 py-8 flex-1">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-full">
          <StatsCard 
            title="Total Units" 
            value={totalUnits} 
            icon={BookOpen} 
          />
          <StatsCard 
            title="Total Students" 
            value={300} 
            icon={Users} 
          />
          <StatsCard 
            title="Consultation Hours" 
            value={lecturerInfo.consultationHours} 
            icon={Clock} 
          />
        </div>

        {/* Notes Management */}
<div className="bg-white rounded-xl shadow-md mb-8 max-w-full">
  <div className="p-6 border-b border-gray-200">
    <div className="flex items-center">
      <FileText className="h-6 w-6 text-indigo-600 mr-2" />
      <h2 className="text-xl font-bold text-gray-900">Upload Course Notes</h2>
    </div>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Unit</label>
        <select
          name="unit"
          value={newNote.unit}
          onChange={handleNoteUpload}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select Unit</option>
          {teachingUnits.map((unit) => (
            <option key={`${unit.code}-${unit._id}`} value={unit.code}>
              {unit.code} - {unit.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Note Title</label>
        <input
          type="text"
          name="title"
          value={newNote.title}
          onChange={handleNoteUpload}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Enter note title"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Upload Note Files</label>
        <input
          type="file"
          name="file"
          onChange={handleNoteUpload}
          multiple={true}
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-indigo-100"
        />
      </div>
      <div className="col-span-2">
        <button
          onClick={submitNote}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Upload Notes
        </button>
      </div>
    </div>
  </div>
</div>



        {/* Assignment Management */}
        <div className="bg-white rounded-xl shadow-md mb-8 max-w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Upload className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Assign Assignments</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <select
                  name="unit"
                  value={newAssignment.unit}
                  onChange={handleAssignmentUpload}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">Select Unit</option>
                  {teachingUnits.length !== 0 &&
  teachingUnits.map((unit) => (
    <option 
      key={`${unit.code}-${unit._id}`} // Combine unit.code and unit._id for uniqueness
      value={unit.code}
    >
      {unit.code} - {unit.name}
    </option>
  ))
}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  value={newAssignment.title}
                  onChange={handleAssignmentUpload}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={newAssignment.deadline}
                  onChange={handleAssignmentUpload}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Assignment Document</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleAssignmentUpload}
                  ref={fileInputRef}
                  multiple={true}
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-indigo-100"
                />
              </div>
              <div className="col-span-full">
                <button
                  onClick={submitAssignment}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Post Assignment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Units with Assignments */}
<div className="bg-white rounded-xl shadow-md max-w-full">
  <div className="p-6 border-b border-gray-200">
    <div className="flex items-center">
      <GraduationCap className="h-6 w-6 text-indigo-600 mr-2" />
      <h2 className="text-xl font-bold text-gray-900">Teaching Units & Assignments</h2>
    </div>
  </div>
  <div className="p-6">
    {categorizedUnits.map((category) => (
      <div key={category.course._id} className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
          {category.course.code} - {category.course.name}
        </h3>
        {category.units.map((unit) => (
          <div 
          key={`${unit.code}-${unit._id}`} // Unique key
          className="bg-indigo-50 rounded-lg p-6 hover:bg-indigo-100 transition-colors mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {unit.code} - {unit.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {unit.description}
                </p>
              </div>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm">
                {assignments[unit.code]?.length || 0} Assignments
              </div>
            </div>
            
            {/* Assignments for this unit */}
            {assignments[unit.code]?.length > 0 ? (
  <div className="space-y-4">
    {assignments[unit.code].map((assignment) => (
      <div 
        key={assignment.id} 
        className="bg-white rounded-md p-4 shadow-sm flex justify-between items-center"
      >
        <div>
          <h4 className="font-semibold text-indigo-600">{assignment.title}</h4>
          <p className="text-sm text-gray-600">
            Deadline: {new Date(assignment.deadline).toLocaleString()}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Paperclip className="h-4 w-4 mr-2" />
            {assignment.fileNames.join(', ')} {/* Display all file names */}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openSubmissionsModal(unit.code, assignment.id)}
            className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full"
            title="View Submissions"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={() => deleteAssignment(unit.code, assignment.id)}
            className="text-red-600 hover:bg-red-100 p-2 rounded-full"
            title="Delete Assignment"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">
            {assignment.submissions} Submissions
          </span>
        </div>
      </div>
    ))}
  </div>
            ) : (
              <p className="text-sm text-gray-500">No assignments posted for this unit</p>
            )}

            {/* Notes for this unit */}
<div className="mt-4">
  <h4 className="font-semibold text-gray-700 mb-2">Course Notes</h4>
  {notes[unit.code]?.length > 0 ? (
    <div className="space-y-4">
      {notes[unit.code].map((note) => (
        <div 
          key={note.id} 
          className="bg-white rounded-md p-4 shadow-sm flex justify-between items-center"
        >
          <div>
            <h4 className="font-semibold text-indigo-600">{note.title}</h4>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Paperclip className="h-4 w-4 mr-2" />
              {note.fileNames.join(', ')}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => deleteNote(unit.code, note.id)}
              className="text-red-600 hover:bg-red-100 p-2 rounded-full"
              title="Delete Note"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">No notes uploaded for this unit</p>
  )}
</div>
          </div>
          
        ))}
      </div>
    ))}
  </div>
</div>
      </div>

      {/* Submissions Modal */}
      {viewSubmissionsModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Assignment Submissions
              </h2>
              <button 
                onClick={closeSubmissionsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <button 
                onClick={() => addMockSubmission(viewSubmissionsModal.unit, viewSubmissionsModal.assignmentId)}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Mock Submission
              </button>
              {submissions[viewSubmissionsModal.unit][viewSubmissionsModal.assignmentId] ? (
                <div className="space-y-4">
                  {submissions[viewSubmissionsModal.unit][viewSubmissionsModal.assignmentId].map((submission) => (
                    <div 
                      key={submission.id} 
                      className="bg-indigo-50 rounded-md p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-indigo-600">{submission.studentName}</p>
                        <p className="text-sm text-gray-600">
                          Submitted: {submission.submissionTime}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Paperclip className="h-4 w-4 mr-2" />
                          {submission.fileName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No submissions yet</p>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default LecturerDashboard;