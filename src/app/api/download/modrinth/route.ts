import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_MODRINTH_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack'

export async function GET() {
  try {
    const config = await db.siteConfig.findUnique({
      where: { id: 'main' }
    })
    
    const downloadUrl = config?.modrinthUrl || DEFAULT_MODRINTH_URL
    return NextResponse.redirect(downloadUrl)
  } catch (error) {
    console.error('Error getting Modrinth URL:', error)
    // Fallback to default URL
    return NextResponse.redirect(DEFAULT_MODRINTH_URL)
  }
}
