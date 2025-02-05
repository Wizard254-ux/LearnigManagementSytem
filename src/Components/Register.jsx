import { useState } from "react";
import { useAuthApi, api } from "../Auth/api";
import { useAuth } from "../Auth/AuthProvider";

const Register = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    idNumber: "",
    email: "",
    password: "",
    username: ""
  });
  const [errors, setErrors] = useState({});
  const {createLecAccount}=useAuthApi()
  const {login}=useAuth()
  const [loading,setLoading]=useState(false)


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check each field
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = `Please enter your ${role === "student" ? "student" : "staff"} number`;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Please enter your username";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false)
      return;
    }

    if (role === "student") {
      try {
        // const response = await api.post(registerEndpoint, formData);
        setLoading(true)
        let data = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          studentNumber: formData.idNumber
        };
        const response=await api.post('api/student/createStudentAccount',data)
        console.log("Registration successful:", response.data);
        await login(response.data.student)
      } catch (error) {
        if(!error.status){
          alert('check your internet connection and try again')
        }
        alert('An error occured try again later')
        console.error("Registration failed:", error.response?.data || error.message);
      }
    } else {
      try {
        let data = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          staffNumber: formData.idNumber
        };
        const response = await createLecAccount(data);
        console.log("Registration successful:", response);
      } catch (error) {
        if(!error.status){
          alert('check your internet connection and try again')
        }
        alert('Error ',error.message)
        console.error("Registration failed:", error.response?.data || error.message);
      }
    }
    setLoading(false)
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register as {role === "student" ? "Student" : "Lecturer"}</h2>
      
      {/* Role Selection */}
      <div className="flex mb-4">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`px-4 py-2 rounded-l ${role === "student" ? "bg-green-500 text-white" : "bg-gray-300"}`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("lecturer")}
          className={`px-4 py-2 rounded-r ${role === "lecturer" ? "bg-green-500 text-white" : "bg-gray-300"}`}
        >
          Lecturer
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder={`${role === "student" ? "Student" : "Staff"} Number`}
            className={`w-full p-2 border rounded ${errors.idNumber ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {loading? <div className="w-full flex items-center py-2 justify-center">
            <i class="fas fa-circle-notch fa-spin" style={{fontSize:27,color:'blue',alignSelf:'center'}}></i>
              </div>:

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Register
        </button>
}
      </form>
    </div>
  );
};

export default Register;