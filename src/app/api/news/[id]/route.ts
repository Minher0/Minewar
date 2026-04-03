import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isDatabaseAvailable, updateMemoryNews, deleteMemoryNews } from '@/lib/memory-store'

// PUT - Update news (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
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
      const news = await db.news.update({
        where: { id },
        data: { title, content }
      })
      
      return NextResponse.json(news)
    } else {
      // Update in memory
      const news = updateMemoryNews(id, title, content)
      if (!news) {
        return NextResponse.json(
          { error: 'News not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(news)
    }
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    )
  }
}

// DELETE - Delete news (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    const dbAvailable = await isDatabaseAvailable()
    
    if (dbAvailable) {
      const { db } = await import('@/lib/db')
      await db.news.delete({
        where: { id }
      })
      
      return NextResponse.json({ success: true })
    } else {
      // Delete from memory
      const success = deleteMemoryNews(id)
      if (!success) {
        return NextResponse.json(
          { error: 'News not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}
