import {useState} from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
function Register(){
    const { showToast } = useToast();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [role,setRole]=useState("Customer");
    const navigate = useNavigate();
    const handleRegister = async(e)=>{
        e.preventDefault();
        try{
            const response = await API.post('/auth/register',{name,email,password,role});
            console.log(response.data);
            showToast('Registration successful!', 'success');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
        catch(error){
            console.log(error.response?.data || error.message);
            showToast(error.response?.data?.message || 'Registration failed', 'error');
        }
    };

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-8 shadow-md max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-black">Create Account</h1>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder = "Enter Your Name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder = "Enter Your Email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            I am registering as an:
                        </label>
                        <select 
                            value={role} 
                            onChange ={(e)=>setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                        >
                            <option value="Customer">Customer</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold mt-2">
                        Register
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline font-semibold">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
export default Register;
