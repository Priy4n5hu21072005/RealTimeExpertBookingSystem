import {useState} from 'react'
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
function Login(){
    const { showToast } = useToast();
    const [email,setEmail]=useState("");
    const[password,setpassword]=useState("");
    const navigate =useNavigate();
    const handleLogin = async (e)=>{e.preventDefault();
        try{
            const response = await API.post('/auth/login',{email,password});
            console.log(response.data);
            localStorage.setItem('token',response.data.token);
            showToast("Login Successful", "success");
            // Delay redirection slightly so the user sees the success toast
            setTimeout(() => {
                window.location.href='/';
            }, 1000);
        }
        catch(error){
            console.log(error.response?.data || error.message);
            showToast(error.response?.data?.message || "Login Failed", "error");
        }
    };
    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-8 shadow-md max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-black">Login to Account</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder ="Enter Your Email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e)=>setpassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold">
                        Login
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline font-semibold">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
};
export default Login;