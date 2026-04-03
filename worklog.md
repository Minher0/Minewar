# MineWar Website Development Worklog

---
## Task ID: minewar-website-dev - Main Agent
### Work Task
Complete development of the MineWar Minecraft server website with all requested features.

### Work Summary
Successfully implemented a comprehensive MineWar Minecraft server website with the following features:

#### 1. Database Schema (Prisma)
- Added `SiteConfig` model for storing server configuration (serverIP, discordUrl, map3dUrl)
- Added `News` model for announcements/notifications
- Successfully pushed schema to SQLite database

#### 2. Authentication System (NextAuth.js)
- Implemented credentials-based authentication
- Hardcoded admin credentials (username: "admin", password: "31122010")
- Hidden login button (very subtle, top-right corner) that opens a login dialog
- Session management with JWT tokens

#### 3. Server Statistics Feature
- Created `/api/stats` route that fetches Minecraft server stats
- Uses mcsrvstat.us API to ping the server
- Displays: online status, player count, player list (if available), server version
- Auto-refreshes every 30 seconds

#### 4. News System
- Created `/api/news` routes for CRUD operations
- News displayed on homepage between hero and download sections
- Each news shows: title, content (expandable), date
- Admin can add/edit/delete news through the admin panel

#### 5. Admin Panel
- Accessible via a Settings button (only visible when logged in)
- Full configuration management:
  - Edit Server IP
  - Edit Discord URL
  - Edit Map 3D URL
- News management with create/edit/delete functionality
- GitHub sync button (simulated - prepares data for sync)

#### 6. GitHub Sync API
- Created `/api/admin/sync` route
- Stores credentials (token, email, repo) as specified
- Simulates GitHub sync by preparing data (would actually push in production)

#### 7. UI/UX
- Copied and enhanced the dark theme with stars animation
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Custom scrollbar styling
- All existing features preserved (server IP copy, download buttons, rules section)

### Files Created/Modified
- `/home/z/my-project/prisma/schema.prisma` - Added SiteConfig and News models
- `/home/z/my-project/src/lib/db.ts` - Prisma client (already existed)
- `/home/z/my-project/src/lib/auth.ts` - NextAuth configuration
- `/home/z/my-project/src/app/api/auth/[...nextauth]/route.ts` - Auth API route
- `/home/z/my-project/src/app/api/stats/route.ts` - Server stats API
- `/home/z/my-project/src/app/api/news/route.ts` - News CRUD API
- `/home/z/my-project/src/app/api/news/[id]/route.ts` - Single news operations
- `/home/z/my-project/src/app/api/config/route.ts` - Config CRUD API
- `/home/z/my-project/src/app/api/admin/sync/route.ts` - GitHub sync API
- `/home/z/my-project/src/app/api/download/modrinth/route.ts` - Modrinth download
- `/home/z/my-project/src/app/api/download/curseforge/route.ts` - CurseForge download
- `/home/z/my-project/src/app/page.tsx` - Main page with all features
- `/home/z/my-project/src/app/layout.tsx` - Layout with providers
- `/home/z/my-project/src/app/globals.css` - Global styles with animations
- `/home/z/my-project/src/components/providers.tsx` - Session and Query providers
- `/home/z/my-project/.env` - Environment variables for NextAuth

### Technical Stack Used
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS 4
- shadcn/ui components (Button, Card, Dialog, Sheet, Input, Label, Textarea, Badge, ScrollArea, Separator)
- Prisma ORM with SQLite
- NextAuth.js v4 for authentication
- TanStack Query for data fetching
- Lucide icons

### How to Use
1. Visit the homepage at `/`
2. Click the very subtle shield icon in top-right corner to login
3. Login with admin/31122010
4. After login, a Settings button appears in the same location
5. Click Settings to open the admin panel
6. Configure site settings, manage news, and sync to GitHub
