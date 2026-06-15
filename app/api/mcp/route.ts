import { NextRequest, NextResponse } from "next/server";
import {
  compareAirQuality,
  fetchAirQuality,
  LOCATIONS,
} from "@/lib/air-quality";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const country = searchParams.get("country");
  const city = searchParams.get("city");
  const countryA = searchParams.get("countryA");
  const countryB = searchParams.get("countryB");
  const cityA = searchParams.get("cityA");
  const cityB = searchParams.get("cityB");

  const cors = { "Access-Control-Allow-Origin": "*" };

  try {
    const compareA = countryA ?? cityA;
    const compareB = countryB ?? cityB;

    if (compareA && compareB) {
      const comparison = await compareAirQuality(compareA, compareB);
      return NextResponse.json(comparison, { headers: cors });
    }

    const single = country ?? city;
    if (single) {
      const data = await fetchAirQuality(single);
      return NextResponse.json(data, { headers: cors });
    }

    return NextResponse.json(
      {
        error:
          "Missing query parameter. Use ?country=France or ?countryA=Canada&countryB=India",
        supportedCountries: LOCATIONS.map((l) => l.country),
      },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}
