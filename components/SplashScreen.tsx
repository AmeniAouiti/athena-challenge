"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setExiting(true), 1200);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const exitTimer = setTimeout(onComplete, 450);
    return () => clearTimeout(exitTimer);
  }, [exiting, onComplete]);

  return (
    <div
      className={`splash-screen ${exiting ? "splash-exit" : ""}`}
      role="status"
      aria-label="Loading Air Quality Dashboard"
    >
      <div className="splash-content">
        <div className="splash-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
            <circle cx="24" cy="24" r="20" stroke="#e8f0fe" strokeWidth="4" />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#1a73e8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="80 126"
              className="splash-spinner-arc"
            />
          </svg>
        </div>
        <h1 className="splash-title">Air Quality Dashboard</h1>
        <p className="splash-subtitle">Loading global data…</p>
      </div>
    </div>
  );
}
