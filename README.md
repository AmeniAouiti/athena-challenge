# Global Air Quality Comparison Dashboard

Athena AI Interview Challenge — compare real-time air quality across **14 countries worldwide** using [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api).

## Quick start

```bash
npm install
npm run dev
```

- **Dashboard:** http://localhost:3000
- **REST API:** http://localhost:3000/api/mcp?country=France
- **Athena MCP:** http://localhost:8787/mcp

## Supported countries

Tunisia, France, USA, UK, Germany, Japan, China, India, Brazil, Canada, Australia, Egypt, Saudi Arabia, South Africa

## API

### Single country

```
GET /api/mcp?country=Germany
GET /api/mcp?city=Berlin
```

```json
{
  "location": "Berlin",
  "country": "Germany",
  "flag": "🇩🇪",
  "aqi": 42,
  "pm25": 8.1,
  "pm10": 14.2,
  "no2": 12.5,
  "status": "Good",
  "riskLevel": "Low",
  "insight": "Air quality in Germany is Good due to low PM2.5 and moderate NO₂..."
}
```

### Compare two countries

```
GET /api/mcp?countryA=Canada&countryB=India
```

## Features

- Google-style UI (Roboto, #1a73e8 blue, clean cards, shimmer skeletons)
- Searchable country dropdowns with flags
- Swap countries button
- Auto-compare on selection change (after first compare)
- Progress bars for PM2.5, PM10, NO₂ (WHO-normalized)
- Smart insights and comparison summaries
- Athena MCP widget with `compare_air_quality` and `get_air_quality` tools

## Athena setup

1. `ngrok http 8787`
2. Create agent at https://athenachat.bot/chatbot/mybots/create
3. MCP URL: `https://<tunnel>/mcp`
4. Try: *"Compare air quality between Canada and India"*
