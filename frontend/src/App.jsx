import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {useEffect, useState} from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointments from "./pages/Appointments";
import CreateExpertProfile from "./pages/CreateExpertProfile";
import { ToastProvider } from "./context/ToastContext";

function LoadingPopup() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
      <div className="flex w-[min(90vw,320px)] flex-col items-center gap-4 rounded-2xl bg-white px-8 py-7 text-center shadow-2xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

        <div>
          <p className="text-lg font-bold text-black">
            Loading
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please wait...
          </p>
        </div>
      </div>
    </div>
  );
}

function AppRoutes({ search }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] =
    useState(location);
  const isLoading =
    location.pathname !== displayLocation.pathname;

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setDisplayLocation(location);
    }, 550);

    return () => clearTimeout(timer);
  }, [location, isLoading]);

  return (
    <>
      {isLoading && <LoadingPopup />}

      <Routes location={displayLocation}>

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
    </>
  );
}

function App() {
  const [ search,setSearch ] = useState("");
  return (
    <ToastProvider>
      <BrowserRouter>

        <Navbar search={search} setSearch={setSearch} />

        <AppRoutes search={search} />

      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
