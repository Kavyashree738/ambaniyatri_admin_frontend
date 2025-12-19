import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import logo from "../assets/logo.jpg";
import "../styles/AdminLogin.css";

function AdminLogin({ onLogin }) {
const loginWithGoogle = async () => {
  try {
    console.log("🔵 Step 1: Opening Google popup...");
    const result = await signInWithPopup(auth, googleProvider);

    console.log("🟢 Step 2: Google sign-in success");
    console.log("📧 Logged-in email:", result.user.email);

    console.log("🔵 Step 3: Fetching Firebase ID token...");
    const idToken = await result.user.getIdToken(true);

    console.log("🟢 Step 4: Firebase ID token received");
    console.log("🧾 Token length:", idToken.length);

    console.log("🔵 Step 5: Calling backend /api/admin/login...");
    const res = await fetch(
      "https://ambaniyatri-admin.onrender.com/api/admin/login",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    console.log("📡 Backend response status:", res.status);

    const data = await res.json();
    console.log("📦 Backend response body:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Login failed");
    }

    console.log("✅ Step 6: Admin verified successfully");
    onLogin();
  } catch (err) {
    console.error("❌ ADMIN LOGIN FAILED");
    console.error("🧨 Error object:", err);
    alert("Admin login failed. Check console logs.");
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
