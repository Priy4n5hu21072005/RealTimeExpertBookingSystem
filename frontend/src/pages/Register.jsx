import {useState} from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
function Register(){
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
            alert('Registration successful');
            navigate('/Login');
        }
        catch(error){
            console.log(error.response.data);
            alert('Registration failed');
        }
    };

    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder = "Enter Your Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />
                    <br/>
                    <br/>
                <input
                    type="email"
                    placeholder = "Enter Your Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <br/>
                    <br/>
                <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <br/>
                    <br/>
                <select value={role} onChange ={(e)=>setRole(e.target.value)}>
                    <option value="Customer">Customer</option>
                    <option value="Expert">Expert</option>
                </select>
                <br/>
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
export default Register;
