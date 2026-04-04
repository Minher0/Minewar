import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getConfig, updateConfig, resetConfig } from '@/lib/data-store'

// GET - Get site config
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getConfig()
    
    return NextResponse.json({
      id: 'main',
      ...config,
      updatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
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
    
    const config = await updateConfig({
      serverIP: serverIP || undefined,
      discordUrl: discordUrl || undefined,
      modrinthUrl: modrinthUrl || undefined,
      curseforgeUrl: curseforgeUrl || undefined,
    })
    
    return NextResponse.json({
      id: 'main',
      ...config,
      updatedAt: new Date().toISOString()
    })
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
    
    const config = await resetConfig()
    
    return NextResponse.json({
      success: true,
      message: 'Configuration reset to defaults',
      config: {
        id: 'main',
        ...config,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error resetting config:', error)
    return NextResponse.json(
      { error: 'Failed to reset config' },
      { status: 500 }
    )
  }
}
