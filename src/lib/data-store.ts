// Data storage using GitHub as a database
// This persists data across Vercel serverless function invocations

const GITHUB_REPO = 'Minher0/Minewar'
const DATA_FILE_PATH = 'data/site-data.json'
const GITHUB_BRANCH = 'main'

interface SiteData {
  config: {
    serverIP: string
    discordUrl: string
    modrinthUrl: string
    curseforgeUrl: string
  }
  news: Array<{
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
  }>
}

const DEFAULT_DATA: SiteData = {
  config: {
    serverIP: 'minewar.ddns.net',
    discordUrl: 'https://discord.gg/xHUGYn7ErC',
    modrinthUrl: 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack',
    curseforgeUrl: 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.zip'
  },
  news: []
}

// In-memory cache with timestamp
let cachedData: SiteData | null = null
let lastFetch = 0
const CACHE_TTL = 5000 // 5 seconds cache

async function getGitHubToken(): Promise<string | null> {
  // Try environment variable first
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN
  }
  // Fallback - no token available
  return null
}

async function fetchFromGitHub(): Promise<SiteData> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${DATA_FILE_PATH}`,
      { cache: 'no-store' }
    )
    
    if (response.ok) {
      const data = await response.json()
      return {
        config: { ...DEFAULT_DATA.config, ...data.config },
        news: data.news || []
      }
    }
  } catch (error) {
    console.error('Error fetching from GitHub:', error)
  }
  
  return { ...DEFAULT_DATA }
}

async function saveToGitHub(data: SiteData): Promise<boolean> {
  const token = await getGitHubToken()
  
  if (!token) {
    console.warn('No GitHub token available, data will not persist')
    return false
  }
  
  try {
    // Get current file SHA
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    )
    
    let sha: string | undefined
    if (getResponse.ok) {
      const fileData = await getResponse.json()
      sha = fileData.sha
    }
    
    // Create or update file
    const body: Record<string, unknown> = {
      message: 'Update site data',
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
      branch: GITHUB_BRANCH
    }
    
    if (sha) {
      body.sha = sha
    }
    
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )
    
    return updateResponse.ok
  } catch (error) {
    console.error('Error saving to GitHub:', error)
    return false
  }
}

export async function getData(): Promise<SiteData> {
  const now = Date.now()
  
  // Return cached data if still fresh
  if (cachedData && (now - lastFetch) < CACHE_TTL) {
    return cachedData
  }
  
  // Fetch fresh data
  cachedData = await fetchFromGitHub()
  lastFetch = now
  
  return cachedData
}

export async function getConfig(): Promise<SiteData['config']> {
  const data = await getData()
  return data.config
}

export async function updateConfig(updates: Partial<SiteData['config']>): Promise<SiteData['config']> {
  const data = await getData()
  
  data.config = { ...data.config, ...updates }
  
  // Update cache immediately
  cachedData = data
  lastFetch = Date.now()
  
  // Save to GitHub in background
  saveToGitHub(data).catch(console.error)
  
  return data.config
}

export async function resetConfig(): Promise<SiteData['config']> {
  const data = await getData()
  
  data.config = { ...DEFAULT_DATA.config }
  cachedData = data
  lastFetch = Date.now()
  
  saveToGitHub(data).catch(console.error)
  
  return data.config
}

export async function getNews(): Promise<SiteData['news']> {
  const data = await getData()
  return data.news
}

export async function addNews(title: string, content: string): Promise<SiteData['news'][0]> {
  const data = await getData()
  
  const now = new Date().toISOString()
  const item = {
    id: Math.random().toString(36).substring(2, 15),
    title,
    content,
    createdAt: now,
    updatedAt: now
  }
  
  data.news.unshift(item)
  
  cachedData = data
  lastFetch = Date.now()
  
  saveToGitHub(data).catch(console.error)
  
  return item
}

export async function updateNews(id: string, title: string, content: string): Promise<SiteData['news'][0] | null> {
  const data = await getData()
  
  const index = data.news.findIndex(n => n.id === id)
  if (index === -1) return null
  
  data.news[index] = {
    ...data.news[index],
    title,
    content,
    updatedAt: new Date().toISOString()
  }
  
  cachedData = data
  lastFetch = Date.now()
  
  saveToGitHub(data).catch(console.error)
  
  return data.news[index]
}

export async function deleteNews(id: string): Promise<boolean> {
  const data = await getData()
  
  const index = data.news.findIndex(n => n.id === id)
  if (index === -1) return false
  
  data.news.splice(index, 1)
  
  cachedData = data
  lastFetch = Date.now()
  
  saveToGitHub(data).catch(console.error)
  
  return true
}
