import { Link } from "react-router-dom";

function Navbar() {

  const token = localStorage.getItem("token");

  const handleLogout = () => {

    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (

    <nav
      style={{
        padding: "10px",
        display: "flex",
        gap: "10px",
        background: "#f0f0f0",
      }}
    >

      <Link to="/">Home</Link>

      {!token ? (
        <>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

        </>
      ) : (

        <button onClick={handleLogout}>
          Logout
        </button>

      )}

    </nav>
  );
}

export default Navbar;