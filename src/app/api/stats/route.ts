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
    const response = await fetch(`https://api.mcsrvstat.us/3/${host}:${port}`, {
      next: { revalidate: 10 } // Cache for only 10 seconds for faster updates
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

export async function GET() {
  try {
    // Get server IP from environment or use default
    // Note: In production with database, you'd fetch from config
    const serverIP = process.env.SERVER_IP || DEFAULT_SERVER_IP
    
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
      { error: 'Failed to fetch server stats', online: false },
      { status: 500 }
    )
  }
}
