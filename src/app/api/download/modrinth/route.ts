import { NextResponse } from 'next/server'
import { getConfig } from '@/lib/data-store'

const DEFAULT_MODRINTH_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getConfig()
    return NextResponse.redirect(config.modrinthUrl || DEFAULT_MODRINTH_URL)
  } catch (error) {
    console.error('Error getting Modrinth URL:', error)
    return NextResponse.redirect(DEFAULT_MODRINTH_URL)
  }
}
