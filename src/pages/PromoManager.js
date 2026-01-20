import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/promoManager.css";

const API_BASE = "https://ambaniyatri-admin.onrender.com";

export default function PromoManager() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [type, setType] = useState("image");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [promos, setPromos] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  /* ===============================
     📥 LOAD PROMOTIONS
  ================================ */
  const loadPromos = async () => {
    console.log("📥 loadPromos() called");

    try {
      const res = await axios.get(`${API_BASE}/api/promotions`);
      console.log("✅ Promotions fetched:", res.data);

      setPromos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ loadPromos error:", err?.response || err);
      alert("Failed to load promotions");
    }
  };

  useEffect(() => {
    console.log("🟢 PromoManager mounted");
    loadPromos();
  }, []);

  /* ===============================
     📂 FILE PICK
  ================================ */
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    console.log("📂 onFileChange fired:", f);

    if (!f) return;

    if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
      console.error("❌ Invalid file type:", f.type);
      alert("Only image or video allowed");
      return;
    }

    setFile(f);
    setType(f.type.startsWith("video") ? "video" : "image");

    const previewUrl = URL.createObjectURL(f);
    console.log("🖼️ Preview URL created:", previewUrl);
    setPreview(previewUrl);
  };

  /* ===============================
     🚀 UPLOAD FILE PROMO
  ================================ */
  const uploadPromo = async () => {
    console.log("🚀 uploadPromo clicked");

    if (!file) {
      console.error("❌ No file selected");
      alert("Select file");
      return;
    }

    const form = new FormData();
    form.append("media", file);
    form.append("title", title);
    form.append("type", type);

    console.log("📦 FormData prepared:");
    for (let pair of form.entries()) {
      console.log(`   → ${pair[0]}:`, pair[1]);
    }

    setUploading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/promotions/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Upload response:", res.data);

      alert("✅ Uploaded successfully");

      setFile(null);
      setPreview("");
      setTitle("");
      loadPromos();
    } catch (err) {
      console.error("❌ Upload error:", err?.response || err);
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
     ▶ UPLOAD YOUTUBE PROMO
  ================================ */
  const uploadYoutubePromo = async () => {
    console.log("▶ uploadYoutubePromo clicked");

    if (!youtubeUrl) {
      alert("Enter YouTube URL");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/promotions/youtube`, {
        title,
        url: youtubeUrl,
      });

      console.log("✅ YouTube upload response:", res.data);

      alert("✅ YouTube promotion added");

      setYoutubeUrl("");
      setTitle("");
      loadPromos();
    } catch (err) {
      console.error("❌ YouTube upload error:", err?.response || err);
      alert("Failed to upload YouTube promotion");
    }
  };

  /* ===============================
     🔁 TOGGLE ACTIVE
  ================================ */
  const toggleActive = async (id, active) => {
    console.log(`🔁 toggleActive id=${id}, current=${active}`);

    try {
      const res = await axios.patch(
        `${API_BASE}/api/promotions/${id}`,
        { active: !active }
      );

      console.log("✅ toggleActive response:", res.data);
      loadPromos();
    } catch (err) {
      console.error("❌ toggleActive error:", err?.response || err);
      alert("Failed to update status");
    }
  };

  /* ===============================
     🧪 DEBUG RENDER
  ================================ */
  useEffect(() => {
    console.log("🎨 Rendering promos:", promos);
  }, [promos]);

  return (
    <div className="promo-page">
      <h1 className="page-title">🎯 Home Promotions</h1>

      {/* ================= FILE UPLOAD CARD ================= */}
      <div className="upload-card">
        <h3>📤 Upload Image / Video</h3>

        <div
          className={`drop-zone ${preview ? "filled" : ""}`}
          onClick={() => {
            console.log("🖱️ Drop zone clicked");
            fileInputRef.current.click();
          }}
        >
          {preview ? (
            type === "image" ? (
              <img src={preview} alt="preview" />
            ) : (
              <video src={preview} controls />
            )
          ) : (
            <p>Click or Drop Image / Video</p>
          )}

          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*,video/*"
            onChange={onFileChange}
          />
        </div>

        <input
          className="input"
          placeholder="Promotion title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="upload-btn"
          onClick={uploadPromo}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "🚀 Upload Promotion"}
        </button>
      </div>

      {/* ================= YOUTUBE UPLOAD CARD ================= */}
      <div className="upload-card">
        <h3>▶ Add YouTube Promotion</h3>

        <input
          className="input"
          placeholder="Paste YouTube video link"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />

        <input
          className="input"
          placeholder="Promotion title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="upload-btn" onClick={uploadYoutubePromo}>
          ▶ Add YouTube Promotion
        </button>
      </div>

      {/* ================= PROMO LIST ================= */}
      <h2 className="section-title">📋 Active Promotions</h2>

      <div className="promo-grid">
        {promos.map((p) => {
          console.log("🧱 Rendering promo card:", p);

          return (
            <div key={p._id} className="promo-card">
              {p.type === "image" ? (
                <img src={`${API_BASE}/api/media/${p.fileName}`} alt="promo" />
              ) : p.type === "video" ? (
                <video
                  src={`${API_BASE}/api/media/${p.fileName}`}
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <iframe
                  width="100%"
                  height="180"
                  src={`https://www.youtube.com/embed/${p.url.split("v=")[1]}`}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                />
              )}

              <div className="promo-info">
                <span>{p.title || "Untitled"}</span>
                <button
                  className={p.active ? "active-btn" : "inactive-btn"}
                  onClick={() => toggleActive(p._id, p.active)}
                >
                  {p.active ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
