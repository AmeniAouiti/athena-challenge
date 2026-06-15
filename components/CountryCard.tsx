import {
  AirQualityData,
  getStatusColor,
  normalizePollutant,
} from "@/lib/air-quality";
import AqiRing from "@/components/AqiRing";
import PollutantBar from "@/components/PollutantBar";

export default function CountryCard({
  data,
  isWinner,
  isWorst,
  animate,
  index = 0,
}: {
  data: AirQualityData;
  isWinner: boolean;
  isWorst?: boolean;
  animate: boolean;
  index?: number;
}) {
  const statusColor = getStatusColor(data.status);

  return (
    <article
      className={`card-hover relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(60,64,67,0.1),0_2px_6px_rgba(60,64,67,0.08)] sm:p-6 ${
        animate ? "card-stagger" : ""
      } ${
        isWinner
          ? "border-[#34a853] ring-2 ring-[#34a853]/20"
          : isWorst
            ? "border-[#ea4335]/30"
            : "border-[#e8eaed]"
      }`}
      style={animate ? { animationDelay: `${index * 140}ms` } : undefined}
    >
      {isWinner && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-[#e6f4ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#137333]">
          🥇 Best Today
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
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
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <AqiRing aqi={data.aqi} status={data.status} animate={animate} />
        <div className="flex flex-1 flex-col gap-2">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: statusColor }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
            {data.qualityLabel}
          </span>
          <span className="text-xs leading-snug text-[#5f6368]">
            {data.riskInterpretation}
          </span>
          <span className="rounded-lg bg-[#f8f9fa] px-2.5 py-1.5 text-[10px] font-medium text-[#5f6368]">
            Risk level:{" "}
            <span style={{ color: statusColor }}>{data.riskLevel}</span>
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-3.5 border-t border-[#e8eaed] pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
          Pollutant levels
        </p>
        <PollutantBar
          label="PM2.5"
          value={data.pm25}
          percent={normalizePollutant(data.pm25, "pm25")}
          delay={0}
          animate={animate}
        />
        <PollutantBar
          label="PM10"
          value={data.pm10}
          percent={normalizePollutant(data.pm10, "pm10")}
          delay={120}
          animate={animate}
        />
        <PollutantBar
          label="NO₂"
          value={data.no2}
          percent={normalizePollutant(data.no2, "no2")}
          delay={240}
          animate={animate}
        />
      </div>

      <div className="rounded-xl border border-[#e8eaed] bg-[#f8f9fa] px-3.5 py-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
          Insight
        </p>
        <p className="text-xs leading-relaxed text-[#5f6368]">{data.insight}</p>
      </div>
    </article>
  );
}
