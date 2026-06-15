import {
  AirQualityData,
  getStatusColor,
  normalizePollutant,
} from "@/lib/air-quality";

function PollutantBar({
  label,
  value,
  unit,
  percent,
  delay,
  animate,
}: {
  label: string;
  value: number;
  unit: string;
  percent: number;
  delay: number;
  animate: boolean;
}) {
  const barColor =
    percent <= 60 ? "#34a853" : percent <= 100 ? "#fbbc04" : "#ea4335";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#5f6368]">{label}</span>
        <span className="text-[#202124]">
          {value} <span className="text-[#9aa0a6]">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#e8eaed]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animate ? `${percent}%` : "0%",
            backgroundColor: barColor,
            transitionDelay: `${delay + 300}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function CountryCard({
  data,
  isWinner,
  animate,
  index = 0,
}: {
  data: AirQualityData;
  isWinner: boolean;
  animate: boolean;
  index?: number;
}) {
  const statusColor = getStatusColor(data.status);

  return (
    <article
      className={`card-hover rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(60,64,67,0.15),0_4px_8px_rgba(60,64,67,0.08)] ${
        animate ? "card-stagger" : ""
      } ${
        isWinner
          ? "border-[#34a853] ring-2 ring-[#34a853]/15"
          : "border-[#e8eaed]"
      }`}
      style={
        animate ? { animationDelay: `${index * 120}ms` } : undefined
      }
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-3xl leading-none"
            role="img"
            aria-label={data.country}
          >
            {data.flag}
          </span>
          <div>
            <h3 className="text-base font-medium text-[#202124]">
              {data.country}
            </h3>
            <p className="text-xs text-[#5f6368]">{data.location}</p>
          </div>
        </div>
        {isWinner && (
          <span className="badge-winner-glow shrink-0 rounded-full bg-[#e6f4ea] px-2.5 py-1 text-xs font-medium text-[#137333]">
            Best Air Quality 🥇
          </span>
        )}
      </div>

      <div className="mb-3 flex items-end gap-2">
        <span
          className="text-5xl font-normal leading-none tracking-tight transition-colors duration-500"
          style={{ color: statusColor }}
        >
          {data.aqi}
        </span>
        <span className="mb-1 text-sm text-[#5f6368]">AQI</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: statusColor }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          {data.status}
        </span>
        <span className="rounded-full bg-[#f1f3f4] px-2.5 py-1 text-xs font-medium text-[#5f6368]">
          Risk: {data.riskLevel}
        </span>
      </div>

      <div className="mb-4 space-y-3 border-t border-[#e8eaed] pt-4">
        <PollutantBar
          label="PM2.5"
          value={data.pm25}
          unit="μg/m³"
          percent={normalizePollutant(data.pm25, "pm25")}
          delay={0}
          animate={animate}
        />
        <PollutantBar
          label="PM10"
          value={data.pm10}
          unit="μg/m³"
          percent={normalizePollutant(data.pm10, "pm10")}
          delay={100}
          animate={animate}
        />
        <PollutantBar
          label="NO₂"
          value={data.no2}
          unit="μg/m³"
          percent={normalizePollutant(data.no2, "no2")}
          delay={200}
          animate={animate}
        />
      </div>

      <p className="rounded-xl bg-[#f8f9fa] px-3 py-2.5 text-xs leading-relaxed text-[#5f6368]">
        {data.insight}
      </p>
    </article>
  );
}
