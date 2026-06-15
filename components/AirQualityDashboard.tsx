"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import CountryCard from "@/components/CountryCard";
import CountrySearchSelect from "@/components/CountrySearchSelect";
import ComparisonSkeleton from "@/components/ComparisonSkeleton";
import SplashScreen from "@/components/SplashScreen";
import { ComparisonResult } from "@/lib/air-quality";

export default function AirQualityDashboard() {
  const [splashDone, setSplashDone] = useState(false);
  const [countryA, setCountryA] = useState("canada");
  const [countryB, setCountryB] = useState("india");
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
      setError("Please select two different countries to compare.");
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
      setError(err instanceof Error ? err.message : "Something went wrong");
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
    <div className="dashboard-enter mx-auto w-full max-w-4xl">
      <header className="mb-8 text-center sm:text-left">
        <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-[#e8f0fe] px-3 py-1 text-xs font-medium text-[#1a73e8]">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Live global data · Open-Meteo
        </div>
        <h1 className="mt-3 text-2xl font-normal tracking-tight text-[#202124] sm:text-3xl">
          Global Air Quality Comparison
        </h1>
        <p className="mt-1.5 text-sm text-[#5f6368]">
          Compare real-time air quality across 14 countries worldwide
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-[#e8eaed] bg-white p-5 shadow-[0_1px_3px_rgba(60,64,67,0.15)] transition-shadow duration-300 hover:shadow-[0_2px_6px_rgba(60,64,67,0.12)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <CountrySearchSelect
            label="Country A"
            value={countryA}
            onChange={setCountryA}
            exclude={countryB}
          />

          <AnimatedButton
            type="button"
            variant="icon"
            onClick={handleSwap}
            aria-label="Swap countries"
            className={swapping ? "btn-swap-spin" : ""}
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
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </AnimatedButton>

          <CountrySearchSelect
            label="Country B"
            value={countryB}
            onChange={setCountryB}
            exclude={countryA}
          />
        </div>

        <AnimatedButton
          type="button"
          variant="primary"
          onClick={handleCompare}
          disabled={loading}
          className="mt-5 disabled:cursor-not-allowed disabled:opacity-60"
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
      </section>

      {error && (
        <div
          className="content-fade-in mb-4 flex items-start gap-3 rounded-xl border border-[#fce8e6] bg-[#fce8e6] px-4 py-3 text-sm text-[#c5221f]"
          role="alert"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </div>
      )}

      <div className="content-area">
        {fadingOut && displayResult && (
          <div className="content-fade-out">
            <div className="grid gap-4 sm:grid-cols-2">
              <CountryCard
                data={displayResult.countryA}
                isWinner={
                  displayResult.betterCountry === displayResult.countryA.country
                }
                animate={false}
                index={0}
              />
              <CountryCard
                data={displayResult.countryB}
                isWinner={
                  displayResult.betterCountry === displayResult.countryB.country
                }
                animate={false}
                index={1}
              />
            </div>
          </div>
        )}

        {loading && <ComparisonSkeleton />}

        {!loading && !displayResult && !error && (
          <div className="content-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dadce0] bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f0fe]">
              <svg
                className="h-7 w-7 text-[#1a73e8]"
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
              Select two countries to compare
            </h2>
            <p className="mt-1 max-w-sm text-sm text-[#5f6368]">
              Choose any two countries above and click Compare to see live air
              quality data, pollutant breakdowns, and smart insights.
            </p>
          </div>
        )}

        {displayResult && !loading && (
          <div className="content-fade-in">
            <div className="summary-banner mb-4 rounded-xl bg-[#e8f0fe] px-4 py-3 text-center text-sm text-[#174ea6]">
              {displayResult.summary}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CountryCard
                key={`a-${displayResult.countryA.aqi}-${countryA}`}
                data={displayResult.countryA}
                isWinner={
                  displayResult.betterCountry === displayResult.countryA.country
                }
                animate={animate}
                index={0}
              />
              <CountryCard
                key={`b-${displayResult.countryB.aqi}-${countryB}`}
                data={displayResult.countryB}
                isWinner={
                  displayResult.betterCountry === displayResult.countryB.country
                }
                animate={animate}
                index={1}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
