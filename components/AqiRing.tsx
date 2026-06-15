"use client";

import { getAqiRingPercent, getStatusColor, AirQualityStatus } from "@/lib/air-quality";

export default function AqiRing({
  aqi,
  status,
  animate,
}: {
  aqi: number;
  status: AirQualityStatus;
  animate: boolean;
}) {
  const color = getStatusColor(status);
  const percent = getAqiRingPercent(aqi);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="#e8eaed"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? offset : circumference}
          className="aqi-ring-progress"
          style={{ transitionDelay: animate ? "200ms" : "0ms" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-3xl font-normal leading-none tracking-tight"
          style={{ color }}
        >
          {aqi}
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-[#9aa0a6]">
          AQI
        </span>
      </div>
    </div>
  );
}
