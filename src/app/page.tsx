'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function Home() {
  const [copied, setCopied] = useState(false)

  const serverIP = "minewar.ddns.net"

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Stars background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
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
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-lg px-4">
          <Button
            asChild
            className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-[#e94560] to-[#ff6b6b] hover:from-[#e94560]/90 hover:to-[#ff6b6b]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <a href="http://minewar.ddns.net:25624" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              Map 3D
            </a>
          </Button>
          <Button
            asChild
            className="flex-1 h-14 text-lg font-semibold bg-[#5865F2] hover:bg-[#5865F2]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <a href="https://discord.gg/xHUGYn7ErC" target="_blank" rel="noopener noreferrer">
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

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 230px 80px, white, transparent),
            radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 350px 200px, white, transparent),
            radial-gradient(2px 2px at 420px 50px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 500px 180px, white, transparent),
            radial-gradient(2px 2px at 580px 90px, rgba(255,255,255,0.9), transparent);
          background-repeat: repeat;
          background-size: 600px 300px;
          animation: twinkle 8s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
