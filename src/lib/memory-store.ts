// Shared in-memory storage for when database is not available
// This is used for Vercel deployment when database is not configured

interface NewsItem {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface SiteConfig {
  serverIP: string
  discordUrl: string
  modrinthUrl: string
  curseforgeUrl: string
}

const DEFAULT_CONFIG: SiteConfig = {
  serverIP: 'minewar.ddns.net',
  discordUrl: 'https://discord.gg/xHUGYn7ErC',
  modrinthUrl: 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack',
  curseforgeUrl: 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.zip'
}

// In-memory storage
let memoryNews: NewsItem[] = []
let memoryConfig: SiteConfig = { ...DEFAULT_CONFIG }

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// News operations
export function getMemoryNews(): NewsItem[] {
  return memoryNews
}

export function addMemoryNews(title: string, content: string): NewsItem {
  const now = new Date().toISOString()
  const item: NewsItem = {
    id: generateId(),
    title,
    content,
    createdAt: now,
    updatedAt: now
  }
  memoryNews.unshift(item)
  return item
}

export function updateMemoryNews(id: string, title: string, content: string): NewsItem | null {
  const index = memoryNews.findIndex(n => n.id === id)
  if (index === -1) return null
  
  memoryNews[index] = {
    ...memoryNews[index],
    title,
    content,
    updatedAt: new Date().toISOString()
  }
  return memoryNews[index]
}

export function deleteMemoryNews(id: string): boolean {
  const index = memoryNews.findIndex(n => n.id === id)
  if (index === -1) return false
  memoryNews.splice(index, 1)
  return true
}

// Config operations
export function getMemoryConfig(): SiteConfig {
  return memoryConfig
}

export function updateMemoryConfig(updates: Partial<SiteConfig>): SiteConfig {
  memoryConfig = { ...memoryConfig, ...updates }
  return memoryConfig
}

export function resetMemoryConfig(): SiteConfig {
  memoryConfig = { ...DEFAULT_CONFIG }
  return memoryConfig
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const { db } = await import('@/lib/db')
    await db.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
