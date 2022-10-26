import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  // useLocation hook ka use hum location ko pta krne me krte hain
  // agr about page pr hain hum to yeh (/about) show krega
  // mtlb hamara (href aur to) ka jo location hai whi location hoga
  let location = useLocation();
  // useEffect(() => {
  //   console.log(`current location is ${location.pathname}`);
  // }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="nav-link text-light" to="#">
            iNotebook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>

            {localStorage.getItem("token") && (
              <button
                className="btn btn-primary"
                onClick={handleLogout}
              >
                Log out
              </button>
            )}

            {!localStorage.getItem("token") && (
              <Link className="btn btn-primary mx-1" to="/login" role="button">
                Login
              </Link>
            )}

            {!localStorage.getItem("token") && (
              <Link className="btn btn-primary mx-1" to="/signup" role="button">
                Signup
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
