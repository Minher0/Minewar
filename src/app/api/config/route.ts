import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
          serverIP: 'minewar.ddns.net',
          discordUrl: 'https://discord.gg/xHUGYn7ErC',
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
    const { serverIP, discordUrl } = body
    
    const config = await db.siteConfig.upsert({
      where: { id: 'main' },
      update: {
        serverIP: serverIP || undefined,
        discordUrl: discordUrl || undefined,
      },
      create: {
        id: 'main',
        serverIP: serverIP || 'minewar.ddns.net',
        discordUrl: discordUrl || 'https://discord.gg/xHUGYn7ErC',
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
