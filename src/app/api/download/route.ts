import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkWeather } from "@/lib/weather"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get("fileId")

  if (!fileId) {
    return new NextResponse("File ID required", { status: 400 })
  }

  // 1. Auth check
  const session = await auth()
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // 2. Ownership check
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: { user: true }
  })

  if (!file || file.user.email !== session.user.email) {
    return new NextResponse("File not found or access denied", { status: 404 })
  }

  // 3. Weather check
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined
  const lon = searchParams.get("lon") ? Number(searchParams.get("lon")) : undefined
  
  const weatherStatus = await checkWeather(lat, lon)

  if (weatherStatus !== "RAINING") {
    return new NextResponse("O tempo está seco. A nuvem evaporou. Volte quando chover.", { status: 403 })
  }

  // 4. Redirect to storage
  return NextResponse.redirect(file.storageUrl)
}
