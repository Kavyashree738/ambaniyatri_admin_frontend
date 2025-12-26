import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import { getAdminToken } from "../utils/getAdminToken";

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [driverDetails, setDriverDetails] = useState({}); // userId → profile
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

//   const token = localStorage.getItem("adminToken");

  // ==================================================
  // 🔥 FETCH SINGLE DRIVER PROFILE (PHONE FROM FIRESTORE)
  // ==================================================
 const fetchDriverDetails = async (userId) => {
  try {
    const token = await getAdminToken();

    const res = await fetch(
      `https://ambaniyatri-admin.onrender.com/api/admin/driver/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) return;

    if (data.profile) {
      setDriverDetails((prev) => ({
        ...prev,
        [userId]: data.profile,
      }));
    }
  } catch (err) {
    console.error("❌ Driver profile fetch error:", err);
  }
};

const isImageFile = (file) => {
  if (!file) return false;
  const ext = file.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(ext);
};



  // ==================================================
  // 🔄 LOAD ALL DRIVERS (MONGODB)
  // ==================================================
useEffect(() => {
  let intervalId;

const loadDrivers = async () => {
  try {
    const token = await getAdminToken();

    const res = await fetch("https://ambaniyatri-admin.onrender.com/api/admin/drivers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) return;

    setDrivers(data);

    data.forEach((driver) => {
      if (!driverDetails[driver.userId]) {
        fetchDriverDetails(driver.userId);
      }
    });
  } catch (err) {
    console.error("❌ Failed to load drivers", err);
  }
};


  // ✅ initial load
  loadDrivers();

  // 🔁 polling every 5 seconds
  intervalId = setInterval(loadDrivers, 5000);

  // 🧹 cleanup
  return () => clearInterval(intervalId);
}, []);


  // ==================================================
  // ✅ APPROVE / ❌ REJECT DRIVER
  // ==================================================
const updateStatus = async (userId, status) => {
  const token = await getAdminToken(true); // force refresh

  await fetch(`https://ambaniyatri-admin.onrender.com/api/documents/verify/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  setDrivers((prev) =>
    prev.map((d) => (d.userId === userId ? { ...d, status } : d))
  );
};


  // ==================================================
  // 🔎 FILTER + SEARCH
  // ==================================================
  const filteredDrivers = Array.isArray(drivers)
    ? drivers.filter((d) => {
        const matchSearch =
          d.fullName.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "all" || d.status === filter;

        return matchSearch && matchFilter;
      })
    : [];

  // ==================================================
  // 🧱 UI
  // ==================================================
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Driver Document Verification</h1>

      {/* 🔎 Search & Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 🚗 Drivers */}
      <div className="drivers-list">
        {filteredDrivers.length === 0 && (
          <p className="empty">No drivers found</p>
        )}

        {filteredDrivers.map((driver) => {
          const profile = driverDetails[driver.userId];

          return (
            <div className="driver-card" key={driver.userId}>
              <div className="driver-header">
                <div className="driver-info">
                  {/* 🖼 Driver Image */}
                  <img
                    src={`https://ambaniyatri-admin.onrender.com/api/documents/file/${driver.files.driver_photo}`}
                    alt={driver.fullName}
                    className="driver-avatar"
                    onError={(e) => (e.target.style.display = "none")}
                  />

                  {/* 📄 Driver Text Info */}
                  <div className="driver-text">
                    <h3>{driver.fullName}</h3>
                    <p>{driver.email}</p>

                    {/* 📱 Phone from Firestore */}
                    {profile?.phone && <p className="phone">{profile.phone}</p>}
                  </div>
                </div>

                <span className={`status ${driver.status}`}>
                  {driver.status}
                </span>
              </div>

              {/* 📄 DOCUMENTS */}
              <div className="documents">
                {Object.entries(driver.files).map(([key, file]) => {
  const fileUrl = `https://ambaniyatri-admin.onrender.com/api/documents/file/${file}`;

  return (
    <div className="doc-row" key={key}>
      <span className="doc-name">
        {key.replace("_", " ").toUpperCase()}
      </span>

      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="file-preview"
      >
        {isImageFile(file) ? (
          <img
            src={fileUrl}
            alt={key}
            className="doc-thumbnail"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <span className="doc-icon">📄</span>
        )}
      </a>
    </div>
  );
})}

              </div>

              {/* 🛠 ACTIONS */}
              {driver.status === "pending" && (
                <div className="actions">
                  <button
                    className="approve"
                    onClick={() => updateStatus(driver.userId, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject"
                    onClick={() => updateStatus(driver.userId, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
