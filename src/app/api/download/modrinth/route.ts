import { NextResponse } from 'next/server'

const GITHUB_RELEASE_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.1.0.0.mrpack'

export async function GET() {
  // Redirect directly to GitHub for better performance with large files
  return NextResponse.redirect(GITHUB_RELEASE_URL)
}
