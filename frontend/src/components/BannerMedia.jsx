"use client";
import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function BannerMedia({ placement = "all", className = "", style = {} }) {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await api.getBanner(placement);
        if (!mounted) return;
        setBanner(resp?.data || null);
      } catch (e) {
        if (!mounted) return;
        setBanner(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [placement]);

  if (loading || !banner) return null;

  const commonProps = {
    className: `w-full rounded-lg shadow-lg ${className}`,
    style,
  };

  if (banner.type === "video") {
    const videoEl = (
      <video
        src={banner.url}
        className="w-full h-32 md:h-40 lg:h-44 xl:h-48 object-cover rounded-lg"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
    );
    if (banner.link) {
      return (
        <a href={banner.link} target="_blank" rel="noopener noreferrer" {...commonProps}>
          {videoEl}
        </a>
      );
    }
    return <div {...commonProps}>{videoEl}</div>;
  }

  // default image
  const imgEl = (
    <img
      src={banner.url}
      alt={banner.title || "Advertisement"}
      className={`w-full h-32 md:h-40 lg:h-44 xl:h-48 object-cover rounded-lg shadow-lg ${className}`}
      style={style}
    />
  );
  if (banner.link) {
    return (
      <a href={banner.link} target="_blank" rel="noopener noreferrer" className={`block ${className}`} style={style}>
        {imgEl}
      </a>
    );
  }
  return imgEl;
}
