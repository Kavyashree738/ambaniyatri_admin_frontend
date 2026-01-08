import "../styles/Header.css";
import { FiLogOut, FiHome, FiImage, FiGrid } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Header({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    if (typeof onLogout === "function") onLogout();
  };

  return (
    <>
      {/* TOP HEADER (DESKTOP) */}
      <header className="admin-header">
        <div className="header-left">
          <h3 className="company-name">MokshAmbani Tech Service</h3>

          <nav className="admin-nav desktop-nav">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/promotions">
              Promotions
            </NavLink>
            <NavLink to="/media-library">
              Media Library
            </NavLink>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </header>

      {/* BOTTOM NAV (MOBILE) */}
      <nav className="bottom-nav">
        <NavLink to="/" end>
          <FiHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/promotions">
          <FiGrid />
          <span>Promo</span>
        </NavLink>

        <NavLink to="/media-library">
          <FiImage />
          <span>Media</span>
        </NavLink>
      </nav>
    </>
  );
}
