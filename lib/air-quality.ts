export type AirQualityStatus = "Good" | "Moderate" | "Bad";
export type RiskLevel = "Low" | "Medium" | "High";

export interface LocationEntry {
  id: string;
  country: string;
  location: string;
  flag: string;
  lat: number;
  lon: number;
  aliases: string[];
}

export interface AirQualityData {
  location: string;
  country: string;
  flag: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  status: AirQualityStatus;
  riskLevel: RiskLevel;
  insight: string;
}

export interface ComparisonResult {
  countryA: AirQualityData;
  countryB: AirQualityData;
  betterCountry: string;
  summary: string;
}

export const LOCATIONS: LocationEntry[] = [
  {
    id: "tunisia",
    country: "Tunisia",
    location: "Tunis",
    flag: "🇹🇳",
    lat: 36.8065,
    lon: 10.1815,
    aliases: ["tunisia", "tunis", "tn"],
  },
  {
    id: "france",
    country: "France",
    location: "Paris",
    flag: "🇫🇷",
    lat: 48.8566,
    lon: 2.3522,
    aliases: ["france", "paris", "fr"],
  },
  {
    id: "usa",
    country: "USA",
    location: "New York",
    flag: "🇺🇸",
    lat: 40.7128,
    lon: -74.006,
    aliases: ["usa", "us", "united states", "america", "new york", "nyc"],
  },
  {
    id: "uk",
    country: "UK",
    location: "London",
    flag: "🇬🇧",
    lat: 51.5074,
    lon: -0.1278,
    aliases: ["uk", "united kingdom", "britain", "london", "gb"],
  },
  {
    id: "germany",
    country: "Germany",
    location: "Berlin",
    flag: "🇩🇪",
    lat: 52.52,
    lon: 13.405,
    aliases: ["germany", "berlin", "de"],
  },
  {
    id: "japan",
    country: "Japan",
    location: "Tokyo",
    flag: "🇯🇵",
    lat: 35.6762,
    lon: 139.6503,
    aliases: ["japan", "tokyo", "jp"],
  },
  {
    id: "china",
    country: "China",
    location: "Beijing",
    flag: "🇨🇳",
    lat: 39.9042,
    lon: 116.4074,
    aliases: ["china", "beijing", "cn"],
  },
  {
    id: "india",
    country: "India",
    location: "Delhi",
    flag: "🇮🇳",
    lat: 28.6139,
    lon: 77.209,
    aliases: ["india", "delhi", "new delhi", "in"],
  },
  {
    id: "brazil",
    country: "Brazil",
    location: "São Paulo",
    flag: "🇧🇷",
    lat: -23.5505,
    lon: -46.6333,
    aliases: ["brazil", "sao paulo", "são paulo", "br"],
  },
  {
    id: "canada",
    country: "Canada",
    location: "Toronto",
    flag: "🇨🇦",
    lat: 43.6532,
    lon: -79.3832,
    aliases: ["canada", "toronto", "ca"],
  },
  {
    id: "australia",
    country: "Australia",
    location: "Sydney",
    flag: "🇦🇺",
    lat: -33.8688,
    lon: 151.2093,
    aliases: ["australia", "sydney", "au"],
  },
  {
    id: "egypt",
    country: "Egypt",
    location: "Cairo",
    flag: "🇪🇬",
    lat: 30.0444,
    lon: 31.2357,
    aliases: ["egypt", "cairo", "eg"],
  },
  {
    id: "saudi-arabia",
    country: "Saudi Arabia",
    location: "Riyadh",
    flag: "🇸🇦",
    lat: 24.7136,
    lon: 46.6753,
    aliases: ["saudi arabia", "saudi", "riyadh", "sa"],
  },
  {
    id: "south-africa",
    country: "South Africa",
    location: "Johannesburg",
    flag: "🇿🇦",
    lat: -26.2041,
    lon: 28.0473,
    aliases: ["south africa", "johannesburg", "za"],
  },
];

export const COUNTRY_OPTIONS = LOCATIONS.map((l) => ({
  value: l.id,
  label: l.country,
  flag: l.flag,
  location: l.location,
}));

const WHO_LIMITS = { pm25: 15, pm10: 45, no2: 25 };

const aliasMap = new Map<string, LocationEntry>();
for (const entry of LOCATIONS) {
  aliasMap.set(entry.id, entry);
  for (const alias of entry.aliases) {
    aliasMap.set(alias.toLowerCase(), entry);
  }
  aliasMap.set(entry.country.toLowerCase(), entry);
  aliasMap.set(entry.location.toLowerCase(), entry);
}

export function resolveLocation(input: string): LocationEntry | null {
  const key = input.trim().toLowerCase();
  return aliasMap.get(key) ?? null;
}

export function getStatusFromAqi(aqi: number): AirQualityStatus {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  return "Bad";
}

export function getRiskLevel(aqi: number, status: AirQualityStatus): RiskLevel {
  if (status === "Good" && aqi <= 50) return "Low";
  if (status === "Bad" || aqi > 100) return "High";
  return "Medium";
}

export function getStatusColor(status: AirQualityStatus): string {
  switch (status) {
    case "Good":
      return "#34a853";
    case "Moderate":
      return "#fbbc04";
    case "Bad":
      return "#ea4335";
  }
}

export function getGoogleBlue(): string {
  return "#1a73e8";
}

export function normalizePollutant(
  value: number,
  pollutant: keyof typeof WHO_LIMITS
): number {
  return Math.min(100, Math.round((value / WHO_LIMITS[pollutant]) * 100));
}

function describePollutant(
  name: string,
  value: number,
  limit: number
): string | null {
  if (value <= limit * 0.6) return `low ${name}`;
  if (value <= limit) return `moderate ${name}`;
  return `elevated ${name}`;
}

export function generateInsight(
  entry: LocationEntry,
  status: AirQualityStatus,
  pm25: number,
  pm10: number,
  no2: number
): string {
  const parts = [
    describePollutant("PM2.5", pm25, WHO_LIMITS.pm25),
    describePollutant("PM10", pm10, WHO_LIMITS.pm10),
    describePollutant("NO₂", no2, WHO_LIMITS.no2),
  ].filter(Boolean) as string[];

  const pollutantNote =
    parts.length > 0
      ? ` due to ${parts.slice(0, 2).join(" and ")}`
      : "";

  if (status === "Good") {
    return `Air quality in ${entry.country} is Good${pollutantNote}. Conditions are healthy for most people.`;
  }
  if (status === "Moderate") {
    return `Air quality in ${entry.country} is Moderate${pollutantNote}. Sensitive groups may want to limit prolonged outdoor activity.`;
  }
  return `Air quality in ${entry.country} is Poor${pollutantNote}. Consider reducing outdoor exposure, especially for sensitive groups.`;
}

export function generateComparisonSummary(
  a: AirQualityData,
  b: AirQualityData,
  betterCountry: string
): string {
  if (betterCountry === "Tie") {
    return `${a.country} and ${b.country} have similar air quality today (AQI ${a.aqi} vs ${b.aqi}).`;
  }
  const winner = betterCountry === a.country ? a : b;
  const loser = betterCountry === a.country ? b : a;
  const delta = Math.abs(a.aqi - b.aqi);
  return `${winner.country} has better air quality than ${loser.country} today — AQI ${winner.aqi} vs ${loser.aqi} (${delta} point${delta === 1 ? "" : "s"} lower).`;
}

interface OpenMeteoCurrent {
  us_aqi?: number;
  pm2_5?: number;
  pm10?: number;
  nitrogen_dioxide?: number;
}

interface OpenMeteoResponse {
  current?: OpenMeteoCurrent;
  error?: boolean;
  reason?: string;
}

export async function fetchAirQuality(input: string): Promise<AirQualityData> {
  const entry = resolveLocation(input);
  if (!entry) {
    const supported = LOCATIONS.map((l) => l.country).join(", ");
    throw new Error(`Unknown location "${input}". Supported countries: ${supported}.`);
  }

  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(entry.lat));
  url.searchParams.set("longitude", String(entry.lon));
  url.searchParams.set("current", "us_aqi,pm2_5,pm10,nitrogen_dioxide");

  const response = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  if (data.error) {
    throw new Error(data.reason ?? "Failed to fetch air quality data");
  }

  const current = data.current ?? {};
  const pm25 = Math.round((current.pm2_5 ?? 0) * 10) / 10;
  const pm10 = Math.round((current.pm10 ?? 0) * 10) / 10;
  const no2 = Math.round((current.nitrogen_dioxide ?? 0) * 10) / 10;

  let aqi = Math.round(current.us_aqi ?? 0);
  if (!aqi || aqi <= 0) {
    aqi = Math.round(pm25 * 2.5 + pm10 * 0.6 + no2 * 0.15);
  }

  const status = getStatusFromAqi(aqi);
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

export async function compareAirQuality(
  inputA: string,
  inputB: string
): Promise<ComparisonResult> {
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
