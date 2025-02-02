import { useState } from "react";

const courses = ["Computer Science", "Engineering", "Mathematics", "Physics"];
const schools = ["School of Engineering", "School of Business", "School of Arts"];

const Register = () => {
  const [role, setRole] = useState("student"); // 'student' or 'lecturer'
  const [formData, setFormData] = useState({
    idNumber: "",
    email: "",
    password: "",
    extraField: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerEndpoint = role === "student" ? "/api/student/register" : "/api/lecturer/register";

    try {
    //   const response = await api.post(registerEndpoint, formData);

      console.log("Registration successful:",formData);
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Register as {role === "student" ? "Student" : "Lecturer"}</h2>
        
        {/* Role Selection */}
        <div className="mb-4">
          <button onClick={() => setRole("student")} className={`px-4 py-2 rounded-l ${role === "student" ? "bg-green-500 text-white" : "bg-gray-300"}`}>
            Student
          </button>
          <button onClick={() => setRole("lecturer")} className={`px-4 py-2 rounded-r ${role === "lecturer" ? "bg-green-500 text-white" : "bg-gray-300"}`}>
            Lecturer
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="idNumber"
            placeholder={role === "student" ? "Student Number" : "Staff Number"}
            value={formData.idNumber}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          {role === "student" ? (
            <select name="extraField" value={formData.extraField} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          ) : (
            <select name="extraField" value={formData.extraField} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
              <option value="">Select School</option>
              {schools.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
