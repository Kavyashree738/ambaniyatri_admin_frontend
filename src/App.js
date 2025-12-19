import { useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./pages/Header";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("adminToken"));

  const handleLogin = () => setIsAdmin(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  if (!isAdmin) return <AdminLogin onLogin={handleLogin} />;

  return (
    <>
      <Header onLogout={handleLogout} />
      <AdminDashboard />
    </>
  );
}
