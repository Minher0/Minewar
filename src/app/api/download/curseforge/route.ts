import { NextResponse } from 'next/server'

const CURSEFORGE_URL = 'https://download1478.mediafire.com/hugauk3rrmqgot3c8tfaUefUjPWImsbCtqPGx3M7I4t_hr5Ii1UZNmQCsy-uZYka4NFxKqEIwH9n7tbw4td9OYbBs2qgnHL3XaplP-bvX59-rLW4OVa0drLuWoH6xfr8gtCgkORL_gNhfDwjrr-tPsfv70Iz2HfEYqKYPvuQ3T0hpQ/e7c0yrv283eu6hd/MineWar.zip'

export async function GET() {
  try {
    const response = await fetch(CURSEFORGE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to download file' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')

    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', 'attachment; filename="Minewar.zip"')
    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
