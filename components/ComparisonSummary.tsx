import { ComparisonResult } from "@/lib/air-quality";

export default function ComparisonSummary({
  result,
}: {
  result: ComparisonResult;
}) {
  const { countryA, countryB, betterCountry, worstCountry, summary } = result;
  const delta = Math.abs(countryA.aqi - countryB.aqi);

  return (
    <section className="summary-banner overflow-hidden rounded-2xl border border-[#d2e3fc] bg-gradient-to-r from-[#e8f0fe] to-[#f1f8ff] p-4 sm:p-5">
      <p className="text-center text-sm font-medium text-[#174ea6] sm:text-base">
        {summary}
      </p>

      {betterCountry !== "Tie" && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#137333] shadow-sm">
            🥇 {betterCountry} — Best Air Quality Today
          </span>
          <span className="text-xs text-[#5f6368]">
            AQI difference: <strong className="text-[#202124]">{delta}</strong>{" "}
            points
          </span>
          {worstCountry !== "Tie" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fce8e6] px-2.5 py-1 text-xs text-[#c5221f]">
              ⚠ {worstCountry} — highest pollution
            </span>
          )}
        </div>
      )}
    </section>
  );
}
