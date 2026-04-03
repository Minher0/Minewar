import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Default configuration values
const DEFAULT_CONFIG = {
  serverIP: 'minewar.ddns.net',
  discordUrl: 'https://discord.gg/xHUGYn7ErC',
  modrinthUrl: 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack',
  curseforgeUrl: 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.zip'
}

// GET - Get site config
export async function GET() {
  try {
    let config = await db.siteConfig.findUnique({
      where: { id: 'main' }
    })
    
    // Create default config if not exists
    if (!config) {
      config = await db.siteConfig.create({
        data: {
          id: 'main',
          ...DEFAULT_CONFIG
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

// PUT - Update config (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { serverIP, discordUrl, modrinthUrl, curseforgeUrl } = body
    
    const config = await db.siteConfig.upsert({
      where: { id: 'main' },
      update: {
        serverIP: serverIP ?? undefined,
        discordUrl: discordUrl ?? undefined,
        modrinthUrl: modrinthUrl ?? undefined,
        curseforgeUrl: curseforgeUrl ?? undefined,
      },
      create: {
        id: 'main',
        serverIP: serverIP || DEFAULT_CONFIG.serverIP,
        discordUrl: discordUrl || DEFAULT_CONFIG.discordUrl,
        modrinthUrl: modrinthUrl || DEFAULT_CONFIG.modrinthUrl,
        curseforgeUrl: curseforgeUrl || DEFAULT_CONFIG.curseforgeUrl,
      }
    })
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    )
  }
}

// DELETE - Reset config to defaults (admin only)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const config = await db.siteConfig.upsert({
      where: { id: 'main' },
      update: DEFAULT_CONFIG,
      create: {
        id: 'main',
        ...DEFAULT_CONFIG
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Configuration reset to defaults',
      config
    })
  } catch (error) {
    console.error('Error resetting config:', error)
    return NextResponse.json(
      { error: 'Failed to reset config' },
      { status: 500 }
    )
  }
}
