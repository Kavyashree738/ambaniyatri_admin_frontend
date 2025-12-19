import "../styles/Header.css";
import { FiLogOut } from "react-icons/fi";

export default function Header({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    // ✅ safe call (won't crash if prop missing)
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      // fallback: reload to go back to login page
      window.location.href = "/";
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h3 className="company-name">MokshAmbani tech service PVT LTD</h3>
        {/* <span className="panel-tag">Admin Panel</span> */}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut size={20} />
        <span>Logout</span>
      </button>
    </header>
  );
}
