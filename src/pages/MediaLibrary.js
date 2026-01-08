import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/mediaLibrary.css";

const API_BASE = "http://localhost:5000";

export default function MediaLibrary() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 📥 LOAD MEDIA
  // ===============================
  const loadMedia = async () => {
    console.log("📥 Loading media library...");
    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/api/promotions`);
      console.log("✅ Promotions response:", res.data);

      const img = [];
      const vid = [];

      res.data.forEach((item) => {
        if (item.type === "image") img.push(item);
        if (item.type === "video") vid.push(item);
      });

      console.log("📸 Images:", img);
      console.log("🎬 Videos:", vid);

      setImages(img);
      setVideos(vid);
    } catch (err) {
      console.error("❌ Failed to load media:", err);
      alert("Failed to load media library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🟢 MediaLibrary mounted");
    loadMedia();
  }, []);

  // ===============================
  // 🗑️ DELETE MEDIA
  // ===============================
  const deleteMedia = async (id, fileName) => {
    console.log("🗑️ Delete clicked:", id, fileName);

    const ok = window.confirm(
      "Are you sure you want to delete this media permanently?"
    );
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/api/promotions/${id}`);
      console.log("✅ Deleted successfully:", fileName);
      loadMedia();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed. Check backend logs.");
    }
  };

  if (loading) {
    return (
      <div className="media-page">
        <h2>Loading media...</h2>
      </div>
    );
  }

  return (
    <div className="media-page">
      <h1 className="page-title">📂 Media Library</h1>

      {/* ================= IMAGES ================= */}
      <section>
        <h2 className="section-title">
          📸 Images ({images.length})
        </h2>

        {images.length === 0 ? (
          <p className="empty-text">No images uploaded</p>
        ) : (
          <div className="media-grid">
            {images.map((img) => (
              <div key={img._id} className="media-card">
                <img
                  src={`${API_BASE}/api/media/${img.fileName}`}
                  alt="uploaded"
                  onLoad={() =>
                    console.log("🖼️ Image loaded:", img.fileName)
                  }
                  onError={() =>
                    console.error("❌ Image error:", img.fileName)
                  }
                />

                <div className="media-info">
                  <span>{img.title || "Untitled image"}</span>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteMedia(img._id, img.fileName)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= VIDEOS ================= */}
      <section>
        <h2 className="section-title" style={{ marginTop: 40 }}>
          🎬 Videos ({videos.length})
        </h2>

        {videos.length === 0 ? (
          <p className="empty-text">No videos uploaded</p>
        ) : (
          <div className="media-grid">
            {videos.map((vid) => (
              <div key={vid._id} className="media-card">
                <video
                  src={`${API_BASE}/api/media/${vid.fileName}`}
                  controls
                  muted
                  onLoadedData={() =>
                    console.log("🎬 Video loaded:", vid.fileName)
                  }
                  onError={() =>
                    console.error("❌ Video error:", vid.fileName)
                  }
                />

                <div className="media-info">
                  <span>{vid.title || "Untitled video"}</span>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteMedia(vid._id, vid.fileName)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
