import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNews, addNews } from '@/lib/data-store'

export const dynamic = 'force-dynamic'

// GET - List all news
export async function GET() {
  try {
    const news = await getNews()
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json([])
  }
}

// POST - Create news (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { title, content } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    const newsItem = await addNews(title, content)
    return NextResponse.json(newsItem)
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
