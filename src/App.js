import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MediaLibrary from "./pages/MediaLibrary";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PromoManager from "./pages/PromoManager";
import Header from "./pages/Header";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("adminToken", token);
        setIsAdmin(true);
      } else {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {isAdmin && <Header onLogout={() => auth.signOut()} />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route
          path="/login"
          element={isAdmin ? <Navigate to="/" /> : <AdminLogin />}
        />

        {/* ================= PROTECTED ================= */}
        <Route
          path="/"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/promotions"
          element={isAdmin ? <PromoManager /> : <Navigate to="/login" />}
        />

        <Route
          path="/media-library"
          element={isAdmin ? <MediaLibrary /> : <Navigate to="/login" />}
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
