import { NextResponse } from 'next/server'

const CURSEFORGE_URL = 'https://download944.mediafire.com/fypr8pue42kgQG1S8djndvdVi0UK4ZBRVr0DHjDsuMDqvwGh8jfdL7RtU_wQ3zphpdcltHUQxiSyN4r_j6k4HKdvYiw7halha5qQcoqubq4bTL2RzfgQwOuWTU368F82FnFUNccTSyazAg0cUFvC1j1xYicFZgRfZGhHGzkv909mqg/s87megu7nauejf1/Minewar.zip'

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
