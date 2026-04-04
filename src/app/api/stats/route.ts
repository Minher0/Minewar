import { NextResponse } from 'next/server'
import { getConfig } from '@/lib/data-store'

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
    const response = await fetch(`https://api.mcsrvstat.us/3/${host}:${port}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch server status:', response.status)
      return null
    }
    
    const data = await response.json()
    
    if (data.online !== true) {
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
        protocol: data.protocol?.version || 763
      },
      motd: data.motd?.clean?.join('\n') || data.motd?.raw?.join('\n')
    }
  } catch (error) {
    console.error('Error pinging Minecraft server:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getConfig()
    const serverIP = config.serverIP
    
    const status = await pingMinecraftServer(serverIP)
    
    const responseData = status ? { ...status, serverIP } : {
      online: false,
      players: { online: 0, max: 0, list: [] },
      version: { name: 'Fabric 1.20.1', protocol: 763 },
      serverIP
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
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
          'Cache-Control': 'no-store'
        }
      }
    )
  }
}
