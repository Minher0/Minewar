import { NextResponse } from 'next/server'

const GITHUB_RELEASE_URL = 'https://github.com/Minher0/Minewar/releases/latest/download/MineWar.zip'

export async function GET() {
  // Redirect directly to GitHub for better performance with large files
  return NextResponse.redirect(GITHUB_RELEASE_URL)
}
