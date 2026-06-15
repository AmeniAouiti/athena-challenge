import AirQualityDashboard from "@/components/AirQualityDashboard";

export default function Home() {
  return (
    <div className="bg-animated-gradient flex min-h-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
      <AirQualityDashboard />
      <footer className="dashboard-enter mx-auto mt-10 w-full max-w-4xl text-center text-xs text-[#9aa0a6]">
        Data from{" "}
        <a
          href="https://open-meteo.com/en/docs/air-quality-api"
          className="text-[#1a73e8] transition-colors hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open-Meteo Air Quality API
        </a>
        {" · "}Built for Athena AI Interview Challenge
      </footer>
    </div>
  );
}
