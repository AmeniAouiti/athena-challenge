import locations from "../data/locations.json" with { type: "json" };

const WHO_LIMITS = { pm25: 15, pm10: 45, no2: 25 };

const aliasMap = new Map();
for (const entry of locations) {
  aliasMap.set(entry.id, entry);
  for (const alias of entry.aliases) {
    aliasMap.set(alias.toLowerCase(), entry);
  }
  aliasMap.set(entry.country.toLowerCase(), entry);
  aliasMap.set(entry.location.toLowerCase(), entry);
}

export function resolveLocation(input) {
  return aliasMap.get(input.trim().toLowerCase()) ?? null;
}

function getStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  return "Bad";
}

function getRiskLevel(aqi, status) {
  if (status === "Good" && aqi <= 50) return "Low";
  if (status === "Bad" || aqi > 100) return "High";
  return "Medium";
}

function describePollutant(name, value, limit) {
  if (value <= limit * 0.6) return `low ${name}`;
  if (value <= limit) return `moderate ${name}`;
  return `elevated ${name}`;
}

function generateInsight(entry, status, pm25, pm10, no2) {
  const parts = [
    describePollutant("PM2.5", pm25, WHO_LIMITS.pm25),
    describePollutant("PM10", pm10, WHO_LIMITS.pm10),
    describePollutant("NO₂", no2, WHO_LIMITS.no2),
  ].filter(Boolean);

  const pollutantNote =
    parts.length > 0 ? ` due to ${parts.slice(0, 2).join(" and ")}` : "";

  if (status === "Good") {
    return `Air quality in ${entry.country} is Good${pollutantNote}. Conditions are healthy for most people.`;
  }
  if (status === "Moderate") {
    return `Air quality in ${entry.country} is Moderate${pollutantNote}. Sensitive groups may want to limit prolonged outdoor activity.`;
  }
  return `Air quality in ${entry.country} is Poor${pollutantNote}. Consider reducing outdoor exposure, especially for sensitive groups.`;
}

function generateComparisonSummary(a, b, betterCountry) {
  if (betterCountry === "Tie") {
    return `${a.country} and ${b.country} have similar air quality today (AQI ${a.aqi} vs ${b.aqi}).`;
  }
  const winner = betterCountry === a.country ? a : b;
  const loser = betterCountry === a.country ? b : a;
  const delta = Math.abs(a.aqi - b.aqi);
  return `${winner.country} has better air quality than ${loser.country} today — AQI ${winner.aqi} vs ${loser.aqi} (${delta} point${delta === 1 ? "" : "s"} lower).`;
}

export async function fetchAirQuality(input) {
  const entry = resolveLocation(input);
  if (!entry) {
    const supported = locations.map((l) => l.country).join(", ");
    throw new Error(`Unknown location "${input}". Supported countries: ${supported}.`);
  }

  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(entry.lat));
  url.searchParams.set("longitude", String(entry.lon));
  url.searchParams.set("current", "us_aqi,pm2_5,pm10,nitrogen_dioxide");

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Open-Meteo API error: ${response.status}`);

  const data = await response.json();
  if (data.error) throw new Error(data.reason ?? "API error");

  const current = data.current ?? {};
  const pm25 = Math.round((current.pm2_5 ?? 0) * 10) / 10;
  const pm10 = Math.round((current.pm10 ?? 0) * 10) / 10;
  const no2 = Math.round((current.nitrogen_dioxide ?? 0) * 10) / 10;

  let aqi = Math.round(current.us_aqi ?? 0);
  if (!aqi || aqi <= 0) {
    aqi = Math.round(pm25 * 2.5 + pm10 * 0.6 + no2 * 0.15);
  }

  const status = getStatus(aqi);
  const riskLevel = getRiskLevel(aqi, status);

  return {
    location: entry.location,
    country: entry.country,
    flag: entry.flag,
    aqi,
    pm25,
    pm10,
    no2,
    status,
    riskLevel,
    insight: generateInsight(entry, status, pm25, pm10, no2),
  };
}

export async function compareAirQuality(inputA, inputB) {
  const [countryA, countryB] = await Promise.all([
    fetchAirQuality(inputA),
    fetchAirQuality(inputB),
  ]);

  const betterCountry =
    countryA.aqi < countryB.aqi
      ? countryA.country
      : countryB.aqi < countryA.aqi
        ? countryB.country
        : "Tie";

  return {
    countryA,
    countryB,
    betterCountry,
    summary: generateComparisonSummary(countryA, countryB, betterCountry),
  };
}

export { locations };
