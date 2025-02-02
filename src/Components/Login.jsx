import { useState } from "react";
import api from "../Auth/api";

const Login = () => {
  const [role, setRole] = useState("student"); // 'student' or 'lecturer'
  const [formData, setFormData] = useState({
    idNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginEndpoint = role === "student" ? "/api/student/login" : "/api/lecturer/login";
  
    try {
    //   const response = await api.post(loginEndpoint, formData);
      console.log(formData)
      console.log("Login successful:");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-72">
        <h2 className="text-2xl font-semibold mb-4">Login as {role === "student" ? "Student" : "Lecturer"}</h2>
        
        {/* Role Selection */}
        <div className="mb-4">
          <button onClick={() => setRole("student")} className={`px-4 py-2 rounded-l ${role === "student" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
            Student
          </button>
          <button onClick={() => setRole("lecturer")} className={`px-4 py-2 rounded-r ${role === "lecturer" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
            Lecturer
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="idNumber"
            placeholder={role === "student" ? "Student Number" : "Staff Number"}
            value={formData.idNumber}
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
