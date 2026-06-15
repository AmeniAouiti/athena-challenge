export default function PollutantBar({
  label,
  value,
  percent,
  delay,
  animate,
}: {
  label: string;
  value: number;
  percent: number;
  delay: number;
  animate: boolean;
}) {
  const barColor =
    percent <= 60 ? "#34a853" : percent <= 100 ? "#fbbc04" : "#ea4335";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#5f6368]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[#202124]">
            {value} <span className="text-[#9aa0a6]">μg/m³</span>
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: `${barColor}18`,
              color: barColor,
            }}
          >
            {percent}%
          </span>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-[#e8eaed]">
        <div
          className="pollutant-bar-fill h-full rounded-full"
          style={{
            width: animate ? `${percent}%` : "0%",
            backgroundColor: barColor,
            transitionDelay: `${delay + 350}ms`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex justify-between px-0.5">
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="h-full w-px bg-white/60"
              style={{ marginLeft: `${tick}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
