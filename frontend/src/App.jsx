import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {useState} from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointments from "./pages/Appointments";
import CreateExpertProfile from "./pages/CreateExpertProfile";

function App() {
  const [ search,setSearch ] = useState("");
  return (
    <BrowserRouter>

      <Navbar search={search} setSearch={setSearch} />

      <Routes>

        <Route
          path="/"
          element={<Home search={search} />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/appointments"
          element={<Appointments />}
        />

        <Route
          path="/create-profile"
          element={<CreateExpertProfile />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;