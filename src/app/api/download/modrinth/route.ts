import { NextResponse } from 'next/server'

const MODRINTH_URL = 'https://download1583.mediafire.com/0lmidg93vd9g1zfiDt2D1LG5NZqcJ0Pn4KwK9gf_CwBJ37YWJPVyqXwx4xcR2MNkfWaZ0bvHX29kDKdwTLIxAIaevDVF9KRhdhM8z8T3fhybtHWOwwlGDBhpyWbLUdrWiyrfTV2tgYmyblKxD3JYputSkWenX1LxMs3xa5a6bW7hlw/y0uit2qk59hqqvm/MineWar+1.0.0.mrpack'

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
