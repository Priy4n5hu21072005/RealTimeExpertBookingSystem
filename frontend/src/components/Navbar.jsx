import { Link } from "react-router-dom";

function Navbar({
  search,
  setSearch,
}) {

  const token = localStorage.getItem("token");

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (

    <nav className="bg-black text-white px-8 py-4 flex items-center shadow-lg">

      {/* LEFT LOGO */}

      <div>
        <h1 className="text-2xl font-bold">
          Expert Booking
        </h1>
      </div>

      {/* CENTER SEARCH */}

      <div className="flex-1 flex justify-center mx-10">
        <div className="bg-white px-3 py-2 rounded-full shadow-md w-full max-w-lg">

        <input
          type="text"
          placeholder="Search Experts,Skills..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }

          className="
            w-full
            text-black 
            outline-none
            bg-transparent
          "
        />
        </div>

      </div>

      {/* RIGHT LINKS */}

      <div className="flex gap-6 items-center">

        <Link
          to="/"
          className="hover:text-blue-400 transition"
        >
          Home
        </Link>

        {token ? (

          <>

            <Link
              to="/appointments"
              className="hover:text-blue-400 transition"
            >
              My Appointments
            </Link>

            <Link
              to="/create-profile"
              className="hover:text-blue-400 transition"
            >
              Create Profile
            </Link>

            <button
              onClick={handleLogout}
              className="
                bg-red-500
                px-4
                py-2
                rounded-lg
                hover:bg-red-600
                transition
              "
            >
              Logout
            </button>

          </>

        ) : (

          <>

            <Link
              to="/login"
              className="hover:text-blue-400 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                bg-blue-500
                px-4
                py-2
                rounded-lg
                hover:bg-blue-600
                transition
              "
            >
              Register
            </Link>

          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;