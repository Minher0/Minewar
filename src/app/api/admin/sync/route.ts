import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GitHub credentials from environment variables
const GITHUB_CONFIG = {
  token: process.env.GITHUB_TOKEN || '',
  email: process.env.GITHUB_EMAIL || 'minhero@outlook.fr',
  repo: process.env.GITHUB_REPO || 'https://github.com/Minher0/Minewar'
}

interface SyncData {
  config: {
    serverIP: string
    discordUrl: string
  } | null
  news: Array<{
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
  }>
  syncTimestamp: string
}

// POST - Sync to GitHub (admin only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get current config and news data
    const config = await db.siteConfig.findUnique({
      where: { id: 'main' }
    })
    
    const news = await db.news.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // Prepare sync data
    const syncData: SyncData = {
      config: config ? {
        serverIP: config.serverIP,
        discordUrl: config.discordUrl
      } : null,
      news: news.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt
      })),
      syncTimestamp: new Date().toISOString()
    }
    
    // In a real implementation, we would:
    // 1. Clone the repo
    // 2. Update the necessary files
    // 3. Commit and push changes
    
    // For this sandbox environment, we'll simulate the sync
    // and return what would be pushed
    
    // Log what would be synced
    console.log('GitHub Sync Data:', JSON.stringify(syncData, null, 2))
    console.log('GitHub Config:', {
      repo: GITHUB_CONFIG.repo,
      email: GITHUB_CONFIG.email,
      hasToken: !!GITHUB_CONFIG.token
    })
    
    // Simulate a successful sync
    return NextResponse.json({
      success: true,
      message: 'Changes prepared for GitHub sync',
      syncData: {
        configUpdated: !!config,
        newsCount: news.length,
        timestamp: syncData.syncTimestamp
      },
      // Note: In production, this would actually push to GitHub
      note: 'This is a simulated sync. In production, changes would be pushed to the repository.',
      repo: GITHUB_CONFIG.repo
    })
  } catch (error) {
    console.error('Error syncing to GitHub:', error)
    return NextResponse.json(
      { error: 'Failed to sync to GitHub' },
      { status: 500 }
    )
  }
}
