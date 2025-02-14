import React, { useState } from 'react';
import { Lock, User, BookOpen, GraduationCap, Users } from 'lucide-react';
import { api } from '../Auth/api';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import CustomAlert from '../Components/CustomAlert';

const AdminLogin = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
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
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('api/admin/loginAdmin', formData);
            await login(res.data.admin);
            setLoading(false)

        } catch (error) {
            setLoading(false);
            if (!error.status) {
                handleShowAlert("Error","error","check your internet connection and try again")
            } else {
                handleShowAlert("Error","error",error.response.data.message)
            }
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen m-0 p-0 min-w-full bg-gradient-to-br from-blue-50 to-indigo-50">
              <CustomAlert
        show={alertConfigs.show}
        title={alertConfigs.title}
        message={alertConfigs.message}
        status={alertConfigs.status} // or "error"
        onClose={() => setAlertConfigs(prev=>({...prev,['show']:false}))}
      />
            <div className="w-full md:w-2/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    className="h-screen w-full object-cover"
                    src="eLearnignBackground.jpg"
                    alt="Digital Learning Environment"
                />
                <div className="absolute top-0 inset-0 flex flex-col justify-center items-center md:items-start z-20 p-8 pb-[45%] md:p-16">
                    <div className="w-28 h-28 md:h-36 md:w-36 bg-white/20 backdrop-blur-sm rounded-full mb-8 flex items-center justify-center">
                        <img
                            src="mksuLogo.png"
                            alt="Machakos University Logo"
                            className="h-28 w-28 md:h-36 md:w-36 rounded-full shadow-lg"
                        />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center md:text-left">
                        LMS Administration Portal
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 text-center md:text-left">
                        Access the central hub for managing courses, student progress, and academic resources. 
                        Shape the future of education through our comprehensive learning platform.
                    </p>
                    
                    {/* Grid section - now visible on all screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto md:mx-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 transform transition-all hover:scale-105 hover:bg-white/30">
                            <BookOpen className="w-6 h-6 text-white mb-2" />
                            <p className="text-white font-semibold">Course Management</p>
                            <p className="text-white/80 text-sm">Organize and monitor academic content</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 transform transition-all hover:scale-105 hover:bg-white/30">
                            <Users className="w-6 h-6 text-white mb-2" />
                            <p className="text-white font-semibold">User Administration</p>
                            <p className="text-white/80 text-sm">Manage faculty and student accounts</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 transform transition-all hover:scale-105 hover:bg-white/30 sm:col-span-2 md:col-span-1">
                            <Lock className="w-6 h-6 text-white mb-2" />
                            <p className="text-white font-semibold">Secure Access</p>
                            <p className="text-white/80 text-sm">Protected administrative controls</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/3 flex items-center justify-center p-8">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Administrator Access</h2>
                        <p className="text-gray-600 mt-2">
                            Welcome to the Learning Management System control center
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Admin Username"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Admin Password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Access Admin Dashboard'
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Restricted access for authorized personnel only
                        </p>
                        <p className="text-xs text-gray-500">
                            IT Support: support@university.edu
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;