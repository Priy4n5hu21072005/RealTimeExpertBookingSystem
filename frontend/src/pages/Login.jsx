import {useState} from 'react'
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
function Login(){
    const [email,setEmail]=useState("");
    const[password,setpassword]=useState("");
    const navigate =useNavigate();
    const handleLogin = async (e)=>{e.preventDefault();
        try{
            const response = await API.post('/auth/Login',{email,password});
            console.log(response.data);
            localStorage.setItem('token',response.data.token);
            alert("Login Successful");
            window.location.href='/';
        }
        catch(error){
            console.log(error.response.data);
            alert(error.response.data.message || "Login Failed");
        }
    };
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder ="Enter Your Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <br/>
                    <br/>
                <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e)=>setpassword(e.target.value)}
                    />
                    <br/>
                    <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
};
export default Login;