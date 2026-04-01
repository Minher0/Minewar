import { NextResponse } from 'next/server'

const MODRINTH_URL = 'https://download1351.mediafire.com/ru162rhp4atg99M275APtoGudoXPDAqcGLU3K6IkxcLkdJSQemCg3aUoKU6U30geEhtZgv_KP5IlgeS80jRpH5sNCv0H_aerDr3LC9keVeeYk9ZFEwEri0y4725_PD9ELSNS2qWKIiKEliBwQS2KF7cff8qLA9qfAmlcP2GIkw/cuv942u8lguhlrc/MineWar+1.0.0.mrpack'

export async function GET() {
  try {
    const response = await fetch(MODRINTH_URL, {
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
    headers.set('Content-Disposition', 'attachment; filename="MineWar-1.0.0.mrpack"')
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
