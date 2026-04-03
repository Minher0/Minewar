import { NextResponse } from 'next/server'
import { isDatabaseAvailable, getMemoryConfig } from '@/lib/memory-store'

const DEFAULT_CURSEFORGE_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.zip'

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable()
    
    if (dbAvailable) {
      const { db } = await import('@/lib/db')
      const config = await db.siteConfig.findUnique({
        where: { id: 'main' }
      })
      
      const downloadUrl = config?.curseforgeUrl || DEFAULT_CURSEFORGE_URL
      return NextResponse.redirect(downloadUrl)
    } else {
      // Use memory config
      const config = getMemoryConfig()
      return NextResponse.redirect(config.curseforgeUrl || DEFAULT_CURSEFORGE_URL)
    }
  } catch (error) {
    console.error('Error getting CurseForge URL:', error)
    // Fallback to default URL
    return NextResponse.redirect(DEFAULT_CURSEFORGE_URL)
  }
}
