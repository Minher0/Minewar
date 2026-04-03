import { NextResponse } from 'next/server'
import { isDatabaseAvailable, getMemoryConfig } from '@/lib/memory-store'

const DEFAULT_MODRINTH_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack'

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable()
    
    if (dbAvailable) {
      const { db } = await import('@/lib/db')
      const config = await db.siteConfig.findUnique({
        where: { id: 'main' }
      })
      
      const downloadUrl = config?.modrinthUrl || DEFAULT_MODRINTH_URL
      return NextResponse.redirect(downloadUrl)
    } else {
      // Use memory config
      const config = getMemoryConfig()
      return NextResponse.redirect(config.modrinthUrl || DEFAULT_MODRINTH_URL)
    }
  } catch (error) {
    console.error('Error getting Modrinth URL:', error)
    // Fallback to default URL
    return NextResponse.redirect(DEFAULT_MODRINTH_URL)
  }
}
