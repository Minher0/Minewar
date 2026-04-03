import { NextResponse } from 'next/server'
import { getConfig } from '@/lib/data-store'

const DEFAULT_CURSEFORGE_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.zip'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getConfig()
    return NextResponse.redirect(config.curseforgeUrl || DEFAULT_CURSEFORGE_URL)
  } catch (error) {
    console.error('Error getting CurseForge URL:', error)
    return NextResponse.redirect(DEFAULT_CURSEFORGE_URL)
  }
}
