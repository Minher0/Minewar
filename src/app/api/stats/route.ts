import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface MinecraftServerStatus {
  online: boolean
  players: {
    online: number
    max: number
    list?: { name: string }[]
  }
  version: {
    name: string
    protocol: number
  }
  motd?: string
}

async function pingMinecraftServer(host: string, port: number = 25565): Promise<MinecraftServerStatus | null> {
  try {
    // Use mcsrvstat.us API which is free and reliable
    const response = await fetch(`https://api.mcsrvstat.us/2/${host}:${port}`, {
      next: { revalidate: 30 } // Cache for 30 seconds
    })
    
    if (!response.ok) {
      console.error('Failed to fetch server status:', response.status)
      return null
    }
    
    const data = await response.json()
    
    // Check if server is actually online based on API response
    if (!data.online) {
      return {
        online: false,
        players: { online: 0, max: 0, list: [] },
        version: { name: 'Unknown', protocol: 0 }
      }
    }
    
    return {
      online: true,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
        list: data.players?.list?.map((p: { name: string }) => ({ name: p.name })) || []
      },
      version: {
        name: data.version || 'Fabric 1.20.1',
        protocol: data.protocol || 763
      },
      motd: data.motd?.clean?.join('\n') || data.motd?.raw?.join('\n')
    }
  } catch (error) {
    console.error('Error pinging Minecraft server:', error)
    return null
  }
}

export async function GET() {
  try {
    // Get server IP from config
    let serverIP = 'minewar.ddns.net'
    
    try {
      const config = await db.siteConfig.findUnique({
        where: { id: 'main' }
      })
      if (config?.serverIP) {
        serverIP = config.serverIP
      }
    } catch {
      // Use default IP if config not found
    }
    
    const status = await pingMinecraftServer(serverIP)
    
    // If status is null (API error), return offline status
    if (!status) {
      return NextResponse.json({
        online: false,
        players: { online: 0, max: 0, list: [] },
        version: { name: 'Fabric 1.20.1', protocol: 763 },
        serverIP
      })
    }
    
    return NextResponse.json({
      ...status,
      serverIP
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch server stats' },
      { status: 500 }
    )
  }
}
