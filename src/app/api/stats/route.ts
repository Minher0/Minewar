import { NextResponse } from 'next/server'

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
    // Use mcsrvstat.us API v3 which has better real-time detection
    // Use no-store to always get fresh data
    const response = await fetch(`https://api.mcsrvstat.us/3/${host}:${port}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch server status:', response.status)
      return null
    }
    
    const data = await response.json()
    
    // The mcsrvstat.us API returns `online: true/false` directly
    // Check this first and return offline status if server is not online
    if (data.online !== true) {
      return {
        online: false,
        players: { online: 0, max: 0, list: [] },
        version: { name: 'Unknown', protocol: 0 }
      }
    }
    
    // Server is online, return the data
    return {
      online: true,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
        list: data.players?.list?.map((p: { name: string }) => ({ name: p.name })) || []
      },
      version: {
        name: data.version || 'Fabric 1.20.1',
        protocol: data.protocol?.version || 763
      },
      motd: data.motd?.clean?.join('\n') || data.motd?.raw?.join('\n')
    }
  } catch (error) {
    console.error('Error pinging Minecraft server:', error)
    return null
  }
}

// Default configuration fallback
const DEFAULT_SERVER_IP = 'minewar.ddns.net'

export const dynamic = 'force-dynamic' // Disable caching for this route

export async function GET() {
  try {
    // Get server IP from environment or use default
    const serverIP = process.env.SERVER_IP || DEFAULT_SERVER_IP
    
    const status = await pingMinecraftServer(serverIP)
    
    // Create response with no-cache headers
    const responseData = status ? { ...status, serverIP } : {
      online: false,
      players: { online: 0, max: 0, list: [] },
      version: { name: 'Fabric 1.20.1', protocol: 763 },
      serverIP
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch server stats', online: false },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    )
  }
}
