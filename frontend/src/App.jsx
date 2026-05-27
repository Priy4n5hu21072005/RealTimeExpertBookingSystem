import {BrowserRouter,Router,Routes,Route}from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import CreateExpertProfile from './pages/CreateExpertProfile';
function App(){
  return(
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/create-expert-profile" element={<CreateExpertProfile/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes></BrowserRouter>
  );
}
export default App;