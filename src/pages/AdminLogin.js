import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import logo from "../assets/logo.jpg";
import "../styles/AdminLogin.css";

function AdminLogin({ onLogin }) {
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // 🔥 Get token ONLY to verify admin once
    const idToken = await result.user.getIdToken(true);

    const res = await fetch("https://ambaniyatri-admin.onrender.com/api/admin/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) throw new Error();

    // ❌ do NOT store token
    onLogin();
  } catch {
    alert("You are not authorized as admin");
  }
};


  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo */}
        <img src={logo} alt="AmbaniYatri Logo" className="admin-logo" />

        {/* Title */}
        <h1 className="admin-title">AmbaniYatri Admin Panel</h1>
        <p className="admin-subtitle">
          Secure dashboard for driver & document verification
        </p>

        {/* Info Section */}
        {/* <div className="admin-info">
          <div>🚖 Manage taxi driver onboarding</div>
          <div>📄 Review uploaded KYC documents</div>
          <div>✅ Approve or ❌ Reject drivers</div>
          <div>🔐 Google-secured admin access</div>
        </div> */}

        {/* Login Button */}
        <button className="google-login-btn" onClick={loginWithGoogle}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="secure-note">
          🔒 Secured using Firebase Authentication
        </p>

        <p className="company">
          Built & Managed by <br />
          <strong>MokshAmbani Tech Services Pvt Ltd</strong>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
