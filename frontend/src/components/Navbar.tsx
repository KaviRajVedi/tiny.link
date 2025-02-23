import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="top-0 left-0 w-full bg-gradient-to-br  from-purple-600 to-blue-700 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="pacifico-regular text-white font-extrabold text-2xl tracking-wide hover:opacity-90 transition"
        >
          ti.ny
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {token ? (
            <>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Link to="/system-design" className="nav-link">
                System Design
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/system-design" className="nav-link">
                System Design
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-blue-700 text-white py-4 px-6 space-y-4 transition-all duration-300 ${
          isOpen
            ? "block opacity-100 translate-y-0"
            : "hidden opacity-0 -translate-y-4"
        }`}
      >
        {token ? (
          <>
            <Link
              to="/profile"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/system-design"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              System Design
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
            <Link
              to="/system-design"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              System Design
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
