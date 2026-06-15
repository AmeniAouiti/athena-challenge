"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import ComparisonSummary from "@/components/ComparisonSummary";
import CountryCard from "@/components/CountryCard";
import CountrySearchSelect from "@/components/CountrySearchSelect";
import ComparisonSkeleton from "@/components/ComparisonSkeleton";
import SplashScreen from "@/components/SplashScreen";
import { ComparisonResult } from "@/lib/air-quality";

function CompareButton({
  loading,
  onClick,
  className = "",
}: {
  loading: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <AnimatedButton
      type="button"
      variant="primary"
      onClick={onClick}
      disabled={loading}
      className={`disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Fetching live data…
        </span>
      ) : (
        "Compare Air Quality"
      )}
    </AnimatedButton>
  );
}

export default function AirQualityDashboard() {
  const [splashDone, setSplashDone] = useState(false);
  const [countryA, setCountryA] = useState("tunisia");
  const [countryB, setCountryB] = useState("france");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayResult, setDisplayResult] = useState<ComparisonResult | null>(
    null
  );
  const [fadingOut, setFadingOut] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const hasCompared = useRef(false);
  const compareId = useRef(0);

  const handleCompare = useCallback(async () => {
    if (countryA === countryB) {
      setError("Please select two different locations to compare.");
      return;
    }

    const id = ++compareId.current;

    if (displayResult) {
      setFadingOut(true);
      await new Promise((r) => setTimeout(r, 250));
      if (id !== compareId.current) return;
      setFadingOut(false);
    }

    setLoading(true);
    setError(null);
    setAnimate(false);
    setDisplayResult(null);

    try {
      const params = new URLSearchParams({ countryA, countryB });
      const response = await fetch(`/api/mcp?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch air quality data");
      }

      if (id !== compareId.current) return;

      setDisplayResult(data);
      hasCompared.current = true;
      requestAnimationFrame(() => setAnimate(true));
    } catch (err) {
      if (id !== compareId.current) return;
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load air quality data. Please try again."
      );
      setDisplayResult(null);
    } finally {
      if (id === compareId.current) setLoading(false);
    }
  }, [countryA, countryB, displayResult]);

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => setSwapping(false), 350);
    setCountryA(countryB);
    setCountryB(countryA);
  };

  useEffect(() => {
    if (!hasCompared.current) return;
    const timer = setTimeout(() => handleCompare(), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryA, countryB]);

  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <>
      <div className="dashboard-enter mx-auto w-full max-w-5xl pb-24 sm:pb-8">
        <header className="mb-6 text-center sm:mb-8 sm:text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d2e3fc] bg-white px-3 py-1 text-xs font-medium text-[#1a73e8] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34a853] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34a853]" />
            </span>
            Live · Open-Meteo · 14 countries
          </div>
          <h1 className="text-2xl font-normal tracking-tight text-[#202124] sm:text-[2rem]">
            Global Air Quality Comparison
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#5f6368]">
            Compare real-time air quality worldwide — AQI, pollutants, and smart
            health insights in one view.
          </p>
        </header>

        <div className="dashboard-grid gap-6">
          <section className="controls-panel min-w-0 overflow-visible rounded-2xl border border-[#e8eaed] bg-white p-5 shadow-[0_1px_2px_rgba(60,64,67,0.1),0_1px_3px_rgba(60,64,67,0.08)] sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9aa0a6]">
              Select locations
            </h2>
            <div className="flex flex-col gap-3">
              <CountrySearchSelect
                label="Location A"
                value={countryA}
                onChange={setCountryA}
                exclude={countryB}
              />

              <div className="flex justify-center py-0.5">
                <AnimatedButton
                  type="button"
                  variant="icon"
                  onClick={handleSwap}
                  aria-label="Swap locations"
                  className={`!mx-0 ${swapping ? "btn-swap-spin" : ""}`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l-4-4"
                    />
                  </svg>
                </AnimatedButton>
              </div>

              <CountrySearchSelect
                label="Location B"
                value={countryB}
                onChange={setCountryB}
                exclude={countryA}
              />
            </div>

            <CompareButton
              loading={loading}
              onClick={handleCompare}
              className="mt-5 hidden sm:block"
            />
          </section>

          <section className="results-panel">
            {error && (
              <div
                className="content-fade-in mb-4 flex items-start gap-3 rounded-2xl border border-[#fce8e6] bg-[#fce8e6] px-4 py-3.5 text-sm text-[#c5221f]"
                role="alert"
              >
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="mt-0.5 text-[#c5221f]/90">{error}</p>
                </div>
              </div>
            )}

            <div className="content-area">
              {fadingOut && displayResult && (
                <div className="content-fade-out">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <CountryCard
                      data={displayResult.countryA}
                      isWinner={
                        displayResult.betterCountry ===
                        displayResult.countryA.country
                      }
                      isWorst={
                        displayResult.worstCountry ===
                        displayResult.countryA.country
                      }
                      animate={false}
                      index={0}
                    />
                    <CountryCard
                      data={displayResult.countryB}
                      isWinner={
                        displayResult.betterCountry ===
                        displayResult.countryB.country
                      }
                      isWorst={
                        displayResult.worstCountry ===
                        displayResult.countryB.country
                      }
                      animate={false}
                      index={1}
                    />
                  </div>
                </div>
              )}

              {loading && <ComparisonSkeleton />}

              {!loading && !displayResult && !error && (
                <div className="content-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dadce0] bg-white px-6 py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f0fe]">
                    <svg
                      className="h-8 w-8 text-[#1a73e8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                      />
                    </svg>
                  </div>
                  <h2 className="text-base font-medium text-[#202124]">
                    Select two locations to compare air quality
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#5f6368]">
                    Default: Tunisia vs France. Click Compare to load live data,
                    pollutant charts, and health insights.
                  </p>
                </div>
              )}

              {displayResult && !loading && (
                <div className="content-fade-in space-y-4">
                  <ComparisonSummary result={displayResult} />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <CountryCard
                      key={`a-${displayResult.countryA.aqi}-${countryA}`}
                      data={displayResult.countryA}
                      isWinner={
                        displayResult.betterCountry ===
                        displayResult.countryA.country
                      }
                      isWorst={
                        displayResult.worstCountry ===
                        displayResult.countryA.country
                      }
                      animate={animate}
                      index={0}
                    />
                    <CountryCard
                      key={`b-${displayResult.countryB.aqi}-${countryB}`}
                      data={displayResult.countryB}
                      isWinner={
                        displayResult.betterCountry ===
                        displayResult.countryB.country
                      }
                      isWorst={
                        displayResult.worstCountry ===
                        displayResult.countryB.country
                      }
                      animate={animate}
                      index={1}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="sticky-compare-bar sm:hidden">
        <CompareButton loading={loading} onClick={handleCompare} />
      </div>
    </>
  );
}
