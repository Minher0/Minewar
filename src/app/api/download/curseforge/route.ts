import { NextResponse } from 'next/server'

const CURSEFORGE_URL = 'https://download1478.mediafire.com/worqu87q3rdglcrgTm1T5G9roTdmZHnyUWYmgnbjwFExo6cgnOM2179ACuQPELO6nAavH_7yRstfArDTrhgMCQs56p5orsr_sg3qqTmCun1KgbDr81-bZm-KVgq5fC6unKqQWuKBnSH7aJdk7-6Jt9mVREx24J26_tekeWICWaO1/e7c0yrv283eu6hd/MineWar.zip'

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
