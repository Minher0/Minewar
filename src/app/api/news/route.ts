import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isDatabaseAvailable, getMemoryNews, addMemoryNews } from '@/lib/memory-store'

// GET - List all news
export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable()
    
    if (dbAvailable) {
      const { db } = await import('@/lib/db')
      const news = await db.news.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(news)
    } else {
      // Return memory news when database is not available
      return NextResponse.json(getMemoryNews())
    }
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
    
    const dbAvailable = await isDatabaseAvailable()
    
    if (dbAvailable) {
      const { db } = await import('@/lib/db')
      const news = await db.news.create({
        data: { title, content }
      })
      
      return NextResponse.json(news)
    } else {
      // Create in memory
      const newsItem = addMemoryNews(title, content)
      return NextResponse.json(newsItem)
    }
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
