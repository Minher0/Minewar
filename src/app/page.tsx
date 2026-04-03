'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { 
  Copy, Check, Users, Activity, Shield, Plus, Pencil, Trash2, 
  Settings, LogOut, Github, X, ChevronDown, ChevronUp
} from 'lucide-react'

// Types
interface ServerStats {
  online: boolean
  players: {
    online: number
    max: number
    list?: { name: string }[]
  }
  version: {
    name: string
    protocol: number
  }
  serverIP: string
}

interface NewsItem {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface SiteConfig {
  id: string
  serverIP: string
  discordUrl: string
  updatedAt: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [expandedNews, setExpandedNews] = useState<string[]>([])
  
  // Edit states
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [newsForm, setNewsForm] = useState({ title: '', content: '' })
  const [configForm, setConfigForm] = useState({ serverIP: '', discordUrl: '' })

  // Fetch server stats
  const { data: stats, refetch: refetchStats } = useQuery<ServerStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats')
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Fetch config
  const { data: config } = useQuery<SiteConfig>({
    queryKey: ['config'],
    queryFn: async () => {
      const res = await fetch('/api/config')
      return res.json()
    },
  })

  // Fetch news
  const { data: news } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch('/api/news')
      return res.json()
    },
  })

  // Update config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (data: Partial<SiteConfig>) => {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      toast({ title: 'Configuration updated!' })
    },
    onError: () => {
      toast({ title: 'Failed to update configuration', variant: 'destructive' })
    },
  })

  // Create news mutation
  const createNewsMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      setNewsForm({ title: '', content: '' })
      toast({ title: 'News created!' })
    },
    onError: () => {
      toast({ title: 'Failed to create news', variant: 'destructive' })
    },
  })

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title: string; content: string } }) => {
      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      setEditingNews(null)
      setNewsForm({ title: '', content: '' })
      toast({ title: 'News updated!' })
    },
    onError: () => {
      toast({ title: 'Failed to update news', variant: 'destructive' })
    },
  })

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast({ title: 'News deleted!' })
    },
    onError: () => {
      toast({ title: 'Failed to delete news', variant: 'destructive' })
    },
  })

  // GitHub sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/sync', { method: 'POST' })
      return res.json()
    },
    onSuccess: (data) => {
      toast({ 
        title: 'Sync prepared!', 
        description: data.message 
      })
    },
    onError: () => {
      toast({ title: 'Failed to sync', variant: 'destructive' })
    },
  })

  // Initialize config form with default values, will be updated when admin edits
  // The form uses the config values as initial state when the admin panel opens

  const serverIP = config?.serverIP || 'minewar.ddns.net'
  const discordUrl = config?.discordUrl || 'https://discord.gg/xHUGYn7ErC'

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP)
      setCopied(true)
      toast({
        title: "IP copiée !",
        description: "L'adresse du serveur a été copiée dans votre presse-papiers.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier l'IP. Veuillez la copier manuellement.",
        variant: "destructive",
      })
    }
  }

  const handleLogin = async () => {
    const result = await signIn('credentials', {
      username: loginForm.username,
      password: loginForm.password,
      redirect: false,
    })
    
    if (result?.error) {
      toast({ title: 'Invalid credentials', variant: 'destructive' })
    } else {
      setLoginDialogOpen(false)
      setLoginForm({ username: '', password: '' })
      toast({ title: 'Logged in successfully!' })
    }
  }

  const handleLogout = () => {
    signOut()
    setAdminPanelOpen(false)
    toast({ title: 'Logged out' })
  }

  const toggleNewsExpand = (id: string) => {
    setExpandedNews(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Stars background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
      </div>

      {/* Hidden Admin Login Button */}
      <div className="fixed top-2 right-2 z-50">
        {status === 'authenticated' ? (
          <div className="flex gap-2">
            <Sheet open={adminPanelOpen} onOpenChange={(open) => {
              setAdminPanelOpen(open)
              if (open && config) {
                setConfigForm({
                  serverIP: config.serverIP,
                  discordUrl: config.discordUrl,
                })
              }
            }}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 opacity-30 hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#1a1a2e] border-white/10 text-white w-[400px] sm:max-w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#e94560]" />
                    Admin Panel
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4 custom-scrollbar">
                  <div className="space-y-6">
                    {/* Config Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#feca57]">Site Configuration</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="serverIP" className="text-gray-300">Server IP</Label>
                          <Input
                            id="serverIP"
                            value={configForm.serverIP}
                            onChange={(e) => setConfigForm(prev => ({ ...prev, serverIP: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="discordUrl" className="text-gray-300">Discord URL</Label>
                          <Input
                            id="discordUrl"
                            value={configForm.discordUrl}
                            onChange={(e) => setConfigForm(prev => ({ ...prev, discordUrl: e.target.value }))}
                            className="bg-white/5 border-white/10 text-white mt-1"
                          />
                        </div>
                        
                        <Button 
                          onClick={() => updateConfigMutation.mutate(configForm)}
                          disabled={updateConfigMutation.isPending}
                          className="w-full bg-[#e94560] hover:bg-[#e94560]/80"
                        >
                          {updateConfigMutation.isPending ? 'Saving...' : 'Save Configuration'}
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* News Management */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#feca57]">News Management</h3>
                      
                      {/* Add/Edit News Form */}
                      <div className="space-y-3 bg-white/5 p-4 rounded-lg">
                        <Input
                          placeholder="News title"
                          value={newsForm.title}
                          onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Textarea
                          placeholder="News content"
                          value={newsForm.content}
                          onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              if (editingNews) {
                                updateNewsMutation.mutate({ id: editingNews.id, data: newsForm })
                              } else {
                                createNewsMutation.mutate(newsForm)
                              }
                            }}
                            disabled={createNewsMutation.isPending || updateNewsMutation.isPending || !newsForm.title || !newsForm.content}
                            className="flex-1 bg-[#1bd96a] hover:bg-[#1bd96a]/80 text-black"
                          >
                            {editingNews ? 'Update' : 'Add'} News
                          </Button>
                          {editingNews && (
                            <Button 
                              onClick={() => {
                                setEditingNews(null)
                                setNewsForm({ title: '', content: '' })
                              }}
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* News List */}
                      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {news?.map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                          >
                            <div className="flex-1 min-w-0 mr-2">
                              <p className="text-white font-medium truncate">{item.title}</p>
                              <p className="text-gray-400 text-xs">{formatDate(item.createdAt)}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                                onClick={() => {
                                  setEditingNews(item)
                                  setNewsForm({ title: item.title, content: item.content })
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-white/10"
                                onClick={() => deleteNewsMutation.mutate(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {news?.length === 0 && (
                          <p className="text-gray-400 text-center py-4">No news yet</p>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* GitHub Sync */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-[#feca57] flex items-center gap-2">
                        <Github className="h-5 w-5" />
                        GitHub Sync
                      </h3>
                      <Button 
                        onClick={() => syncMutation.mutate()}
                        disabled={syncMutation.isPending}
                        className="w-full bg-[#5865F2] hover:bg-[#5865F2]/80"
                      >
                        {syncMutation.isPending ? 'Syncing...' : 'Push to GitHub'}
                      </Button>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Logout */}
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-white/10 text-white hover:bg-white/5"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 opacity-20 hover:opacity-50 transition-opacity bg-transparent hover:bg-transparent text-gray-500"
              >
                <Shield className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a2e] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Admin Login</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <Input
                    id="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleLogin}
                  className="bg-[#e94560] hover:bg-[#e94560]/80"
                >
                  Login
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-4">
        <nav className="max-w-6xl mx-auto flex justify-center">
          <div className="flex items-center gap-2">
            <img 
              src="/logo-minewar.png" 
              alt="MineWar Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-wider">MineWar</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8 animate-float">
            <img 
              src="/logo-minewar.png" 
              alt="MineWar Logo" 
              className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-[#e94560] via-[#ff6b6b] to-[#feca57] bg-clip-text text-transparent">
              MineWar
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Serveur Minecraft <span className="text-[#e94560] font-semibold">Fabric 1.20.1</span>
          </p>
          <p className="text-lg text-gray-400">
            Un NationGlory mais c&apos;est que entre nous !
          </p>
        </div>

        {/* Server Stats Card */}
        <Card className="w-full max-w-md mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#e94560]" />
                Server Status
              </h3>
              <Badge 
                variant={stats?.online ? "default" : "destructive"}
                className={stats?.online ? "bg-[#1bd96a] hover:bg-[#1bd96a]" : ""}
              >
                {stats?.online ? 'Online' : 'Offline'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-[#feca57]" />
                <p className="text-2xl font-bold text-white">
                  {stats?.players?.online ?? 0}/{stats?.players?.max ?? 0}
                </p>
                <p className="text-xs text-gray-400">Players</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Shield className="h-5 w-5 mx-auto mb-1 text-[#1bd96a]" />
                <p className="text-sm font-bold text-white">
                  {stats?.version?.name ?? 'Fabric 1.20.1'}
                </p>
                <p className="text-xs text-gray-400">Version</p>
              </div>
            </div>
            
            {stats?.players?.list && stats.players.list.length > 0 && (
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">Online Players:</p>
                <div className="flex flex-wrap gap-1">
                  {stats.players.list.slice(0, 10).map((player, i) => (
                    <Badge key={i} variant="outline" className="border-white/20 text-gray-300 text-xs">
                      {player.name}
                    </Badge>
                  ))}
                  {stats.players.list.length > 10 && (
                    <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
                      +{stats.players.list.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Server IP Card */}
        <Card className="w-full max-w-md mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Adresse du serveur</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl md:text-3xl font-mono font-bold text-white bg-black/30 px-4 py-2 rounded-lg">
                  {serverIP}
                </code>
                <Button 
                  onClick={copyIP}
                  variant="outline"
                  size="icon"
                  className="bg-[#e94560] hover:bg-[#e94560]/80 border-none text-white"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Section */}
        {news && news.length > 0 && (
          <div className="w-full max-w-2xl px-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              <span className="text-[#feca57]">📢 Annonces</span>
            </h2>
            <div className="space-y-4">
              {news.slice(0, 5).map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleNewsExpand(item.id)}
                    >
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      {expandedNews.includes(item.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                    {expandedNews.includes(item.id) && (
                      <p className="text-gray-300 mt-3 whitespace-pre-wrap">{item.content}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center mb-12 w-full max-w-lg px-4">
          <Button
            asChild
            className="h-14 text-lg font-semibold bg-[#5865F2] hover:bg-[#5865F2]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8"
          >
            <a href={discordUrl} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              Discord
            </a>
          </Button>
        </div>

        {/* Modpack Downloads Section */}
        <div className="w-full max-w-2xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Télécharger le Modpack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modrinth */}
            <Card className="group bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-[#1bd96a]/30 hover:border-[#1bd96a] transition-all duration-300 hover:shadow-lg hover:shadow-[#1bd96a]/20 cursor-pointer">
              <CardContent className="p-0">
                <a 
                  href="/api/download/modrinth"
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#1bd96a]/20 flex items-center justify-center group-hover:bg-[#1bd96a]/30 transition-colors overflow-hidden">
                    <img 
                      src="/modrinth-logo.png" 
                      alt="Modrinth" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#1bd96a] transition-colors">Modrinth</h3>
                    <p className="text-gray-400 text-sm">Format .mrpack</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
              </CardContent>
            </Card>

            {/* CurseForge */}
            <Card className="group bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-[#f16436]/30 hover:border-[#f16436] transition-all duration-300 hover:shadow-lg hover:shadow-[#f16436]/20 cursor-pointer">
              <CardContent className="p-0">
                <a 
                  href="/api/download/curseforge"
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#f16436]/20 flex items-center justify-center group-hover:bg-[#f16436]/30 transition-colors overflow-hidden">
                    <img 
                      src="/curseforge-logo.png" 
                      alt="CurseForge" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#f16436] transition-colors">CurseForge</h3>
                    <p className="text-gray-400 text-sm">Format .zip</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Server Rules Section */}
        <div className="w-full max-w-3xl px-4 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            <span className="text-[#feca57]">⚔️ Règles du Serveur</span>
          </h2>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">1. Respect</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Respect obligatoire entre tous les joueurs</li>
                    <li>- Aucune insulte, harcèlement ou discrimination</li>
                    <li>- Le staff doit être respecté</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">2. Triche & Exploits</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Interdiction totale des cheats (x-ray, fly, kill aura, etc.)</li>
                    <li>- Les bugs/exploits doivent être signalés, pas utilisés</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">3. PvP & Combat</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Interdiction de spawnkill ou d&apos;acharnement</li>
                    <li>- Déconnexion en combat interdite</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">4. Grief & Guerre</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Interdiction de grief ou de vol sur un terrain</li>
                    <li>- Exception : en cas de guerre déclarée entre 2 nations après 24h</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">5. Construction</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Constructions interdites : lag machines</li>
                    <li>- Le staff peut supprimer toute construction problématique</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">6. Sanctions</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Jail ou ban selon la gravité</li>
                    <li>- S&apos;échapper de prison sans autorisation entraînera un ban</li>
                    <li>- Les décisions du staff sont finales</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#feca57] mb-2">7. Règle générale</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>- Le bon sens est obligatoire</li>
                    <li>- Tout comportement nuisible peut être sanctionné</li>
                    <li>- En jouant ici, vous acceptez ces règles</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <h3 className="text-lg font-bold text-[#1bd96a] mb-3">📝 Commandes utiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                    <div><code className="text-[#e94560]">/openpac-parties</code> - Gérer ou rejoindre une faction</div>
                    <div><code className="text-[#e94560]">/shop</code> - Ouvrir le shop</div>
                    <div><code className="text-[#e94560]">/spawn</code> - Retourner au spawn</div>
                    <div><code className="text-[#e94560]">/home set</code> - Définir un home</div>
                    <div><code className="text-[#e94560]">/home tp</code> - Se téléporter à son home</div>
                    <div><code className="text-[#e94560]">/tpa</code> - Demander une téléportation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/logo-minewar.png" 
              alt="MineWar Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-semibold text-white">MineWar</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Serveur Minecraft Fabric 1.20.1 - Un NationGlory mais c&apos;est que entre nous !
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <span>Version 1.20.1</span>
            <span>•</span>
            <span>Fabric</span>
            <span>•</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
