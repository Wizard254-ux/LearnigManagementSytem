import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { api } from '../Auth/api';
import { useAuth } from '../Auth/AuthProvider';

const AdminLogin = () => {
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [loading, setLoading] = useState(false); // FIX: Set loading to false initially

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('api/admin/loginAdmin', formData);
            console.log(res.data.admin);
            await login(res.data.admin);
        } catch (error) {
            if (!error.response) {
                alert("Error: Check your internet connection");
            } else {
                alert("Error: " + error.message);
            }
            console.log(error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                <div className="text-center mb-8">
                    {/* University Logo Placeholder */}
                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-gray-600">MKSU</span>
                    </div>
                    <h2 className="text-2xl font-bold">Admin Login</h2>
                    <p className="text-gray-500 mt-2">Machakos University Admin Portal</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* FIX: Show loading icon properly */}
                    {loading ? (
                        <div className="w-full flex items-center py-2 justify-center">
                            <i className="fas fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
                        </div>
                    ) : (
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                            Login
                        </button>
                    )}
                </form>
                
                <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
                    <p>© 2025 Machakos University. All rights reserved.</p>
                    <p>Contact IT Support: support@mksu.ac.ke</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
