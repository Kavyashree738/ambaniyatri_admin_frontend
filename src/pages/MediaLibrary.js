import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/mediaLibrary.css";

const API_BASE = "https://ambaniyatri-admin.onrender.com";

export default function MediaLibrary() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [youtube, setYoutube] = useState([]);
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
      const yt = [];

      res.data.forEach((item) => {
        if (item.type === "image") img.push(item);
        if (item.type === "video") vid.push(item);
        if (item.type === "youtube") yt.push(item);
      });

      console.log("📸 Images:", img);
      console.log("🎬 Videos:", vid);
      console.log("▶ YouTube:", yt);

      setImages(img);
      setVideos(vid);
      setYoutube(yt);
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

  // ===============================
  // 🔍 EXTRACT YOUTUBE ID
  // ===============================
  const getYoutubeId = (url) => {
    if (!url) return null;

    if (url.includes("<iframe")) {
      const match = url.match(/src="([^"]+)"/);
      if (!match) return null;
      url = match[1];
    }

    if (url.includes("/embed/")) {
      return url.split("/embed/")[1].split("?")[0];
    }

    if (url.includes("v=")) {
      return url.split("v=")[1].split("&")[0];
    }

    if (url.includes("youtu.be")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    return null;
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
        <h2 className="section-title">📸 Images ({images.length})</h2>

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

      {/* ================= YOUTUBE ================= */}
      <section>
        <h2 className="section-title" style={{ marginTop: 40 }}>
          ▶ YouTube ({youtube.length})
        </h2>

        {youtube.length === 0 ? (
          <p className="empty-text">No YouTube videos added</p>
        ) : (
          <div className="media-grid">
            {youtube.map((yt) => {
              const videoId = getYoutubeId(yt.url);

              return (
                <div key={yt._id} className="media-card">
                  {videoId ? (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video"
                      frameBorder="0"
                      allowFullScreen
                    />
                  ) : (
                    <p>Invalid YouTube URL</p>
                  )}

                  <div className="media-info">
                    <span>{yt.title || "Untitled YouTube video"}</span>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteMedia(yt._id, "YouTube video")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
