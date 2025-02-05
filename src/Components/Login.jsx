import { useState } from "react";
import { useAuthApi, api } from "../Auth/api";
import { useAuth } from "../Auth/AuthProvider";


const Login = () => {
  const [role, setRole] = useState("student"); // 'student' or 'lecturer'
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const {loginLecAccount}=useAuthApi()
  const { login } = useAuth();
  const [loading,setLoading]=useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
  
    if(role=="student"){
      try {
        // const response = await api.post(registerEndpoint, formData);
       console.log('studen role')
        const response=await api.post('api/student/loginStudentAccount',formData)
        console.log("Registration successful:", response.data);
        await login(response.data.student)
      } catch (error) {
        if(!error.status){
         alert('check your internet connection and try again')
        }
        alert("Error",error.message)
        console.error("Registration failed:", error.response?.data || error.message);
      }
    }else{
      try {

        const response= await loginLecAccount(formData);
 
      } catch (error) {
        if(!error.status){
          alert('check your internet connection and try again')
        }
        alert("Error",error.message)
        console.error("Registration failed:", error.response?.data || error.message);      }
    }
    setLoading(false)
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
            name="username"
            placeholder={role === "student" ? "username" : "username"}
            value={formData.username}
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
           {loading? <div className="w-full flex items-center py-2 justify-center">
            <i class="fas fa-circle-notch fa-spin" style={{fontSize:27,color:'blue',alignSelf:'center'}}></i>
              </div>:
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Login
            </button>
}
        </form>
      </div>
    </div>
  );
};

export default Login;
