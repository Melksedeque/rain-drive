import { NextResponse } from "next/server"
import { checkWeather } from "@/lib/weather"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined
  const lon = searchParams.get("lon") ? Number(searchParams.get("lon")) : undefined

  const status = await checkWeather(lat, lon)
  
  return NextResponse.json({ status })
}
