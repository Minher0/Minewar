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
            Entre potes, pour s'amuser !
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
                <path d="M3 12h4l3 8l4 -16l3 8h4"></path>
              </svg>
              Map 3D
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
                  href="https://download1583.mediafire.com/0lmidg93vd9g1zfiDt2D1LG5NZqcJ0Pn4KwK9gf_CwBJ37YWJPVyqXwx4xcR2MNkfWaZ0bvHX29kDKdwTLIxAIaevDVF9KRhdhM8z8T3fhybtHWOwwlGDBhpyWbLUdrWiyrfTV2tgYmyblKxD3JYputSkWenX1LxMs3xa5a6bW7hlw/y0uit2qk59hqqvm/MineWar+1.0.0.mrpack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#1bd96a]/20 flex items-center justify-center group-hover:bg-[#1bd96a]/30 transition-colors">
                    <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M503.16 323.56C514.55 281.47 515.32 235.91 503.2 190.76C466.59 54.23 326.04 -26.8 189.33 9.78C83.81 38.03 11.39 128.07 4.09 230.47H35.7H57.21H87.21C94.41 170.06 134.39 116.39 195.44 99.8C283.13 76.03 373.19 128.65 396.96 216.33C403.35 240.13 404.18 264.38 400.15 287.33L440.12 306.58L503.16 323.56Z" fill="#1BD96A"/>
                      <path d="M399.15 313.26C370.27 369.38 306.97 401.69 240.67 388.63C179.63 376.65 133.02 327.93 120.94 269.47H57.29H34.91H4.98C5.31 275.88 5.97 282.32 6.98 288.77C8.39001 297.41 10.35 306.01 12.89 314.52C13.46 316.52 14.08 318.51 14.72 320.49C17.7 329.55 21.27 338.44 25.43 347.09C26.42 349.02 27.43 350.94 28.49 352.84C33.72 362.28 39.68 371.38 46.37 380.04C46.83 380.63 47.29 381.21 47.76 381.79C56.64 392.53 66.58 402.5 77.51 411.53C78.47 412.33 79.43 413.12 80.41 413.9C89.89 421.65 100.16 428.69 111.15 434.91C111.95 435.36 112.75 435.8 113.55 436.24C125.59 442.87 138.33 448.56 151.7 453.19C152.52 453.48 153.35 453.76 154.18 454.04C167.5 458.39 181.47 461.66 195.98 463.76C196.72 463.87 197.47 463.98 198.22 464.08C213.21 466.06 228.73 466.83 244.64 466.23C244.98 466.22 245.32 466.21 245.66 466.2C262.34 465.48 279.28 463.38 296.28 459.73C296.85 459.61 297.41 459.48 297.98 459.35C314.23 455.75 330.33 450.87 346.07 444.67C347.34 444.17 348.6 443.66 349.86 443.14C364.65 437.08 378.95 429.85 392.57 421.55C394.08 420.6 395.58 419.63 397.07 418.66C409.94 410.3 422.1 400.88 433.4 390.52C434.88 389.16 436.34 387.78 437.78 386.39C448.02 376.37 457.29 365.48 465.44 353.87C466.76 352.01 468.04 350.13 469.3 348.23C476.35 337.56 482.48 326.32 487.59 314.6L399.15 313.26Z" fill="#1BD96A"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#1bd96a] transition-colors">Modrinth</h3>
                    <p className="text-gray-400 text-sm">Format .mrpack</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </CardContent>
            </Card>

            {/* CurseForge */}
            <Card className="group bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-[#f16436]/30 hover:border-[#f16436] transition-all duration-300 hover:shadow-lg hover:shadow-[#f16436]/20 cursor-pointer">
              <CardContent className="p-0">
                <a 
                  href="https://download944.mediafire.com/fypr8pue42kgQG1S8djndvdVi0UK4ZBRVr0DHjDsuMDqvwGh8jfdL7RtU_wQ3zphpdcltHUQxiSyN4r_j6k4HKdvYiw7halha5qQcoqubq4bTL2RzfgQwOuWTU368F82FnFUNccTSyazAg0cUFvC1j1xYicFZgRfZGhHGzkv909mqg/s87megu7nauejf1/Minewar.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#f16436]/20 flex items-center justify-center group-hover:bg-[#f16436]/30 transition-colors">
                    <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M459.86 273.57C459.86 273.57 455.51 298.68 430.76 339.34C423.35 351.49 425.24 357.72 437.29 358.77C467.34 361.35 480.51 377.28 472.83 406.3C466.02 431.84 447.93 441.95 418.89 437.15C393.39 432.93 378.24 441.13 370.84 467.32C361.28 501.43 340.2 512.42 308.38 502.03C282.23 493.5 262.85 501.07 244.85 522.38C209.01 564.72 152.1 553.8 127.01 503.12C115.85 480.64 100.65 469.38 75.55 468.46C44.5 467.32 25.21 448.55 19.32 417.94C14.51 392.92 26.33 371.8 51.63 361.71C76.21 351.92 79.38 339.79 64.37 317.33C40.47 281.52 47.1 246.72 81.37 224.03C102.77 209.88 107.72 191.42 95.05 166.34C72.84 122.31 95.89 79.5 144.15 71.03C169.81 66.52 183.64 53.1 189.18 28.18C198.32 -12.79 245.4 -31.77 281.11 -8.89C303.16 5.25 325.24 5.61 347.32 -8.49C382.43 -31.07 429.29 -11.79 438.64 29.17C444.21 53.62 457.42 67.34 483.13 71.29C531.63 78.72 555.21 121.49 533.07 165.65C520.12 191.27 525.21 210.01 547.25 224.5C582.11 247.51 588.15 282.5 563.42 317.66C547.72 340.03 550.45 352.11 575.03 362.46C600.33 373.13 612.44 394.39 607.14 419.35C600.79 449.54 580.88 468.17 549.64 468.52C524.5 468.8 509.4 480.26 498.49 502.8C473.65 554.03 416.52 564.48 381.09 521.68C363.37 500.25 344.07 492.98 317.97 501.74C286.17 512.42 265.13 501.59 255.95 467.45C248.88 440.92 233.31 432.67 207.61 437.18C178.58 442.3 160.35 432.58 153.19 406.88C145.12 377.96 157.95 362.14 188.13 359.21C200.27 358.03 202.47 351.75 195.21 339.54C170.89 298.66 166.32 273.57 166.32 273.57C166.32 273.57 168.08 297.18 181.96 326.21C186.11 334.84 192.09 337.61 200.91 334.54C220.81 327.6 241.08 327.4 261.29 333.81C273.36 337.63 283.11 333.54 289.03 322.7C304.92 293.62 328.32 273.57 328.32 273.57C328.32 273.57 306.64 293.14 292.15 320.7C286.38 331.71 289.03 341.26 300.37 347.21C319.73 357.37 331.72 373.9 336.04 395.05C340.11 414.77 335.83 434.12 323.39 450.73C306.4 473.44 312.51 498.93 337.75 512.17C361.07 524.43 388.97 515.15 401.29 490.17C406.01 480.58 406.85 470.1 405.91 459.33C404.27 440.62 408.76 423.97 421.41 409.81C438.99 389.98 439.21 370.83 422.51 350.33C409.35 334.2 404.53 315.43 408.68 294.76C414.72 264.64 439.48 242.88 469.55 242.21C499.19 241.55 523.87 262.73 529.87 293.04C531.41 300.83 531.19 308.79 530.41 316.68L459.86 273.57Z" fill="#F16436"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#f16436] transition-colors">CurseForge</h3>
                    <p className="text-gray-400 text-sm">Format .zip</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-4xl px-4 mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Pourquoi nous rejoindre ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#e94560]/20 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Serveur Semi-Privé</h3>
                <p className="text-gray-400 text-sm">Un serveur entre potes pour jouer tranquillement sans les problèmes des serveurs publics</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#1bd96a]/20 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1bd96a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Modpack Optimisé</h3>
                <p className="text-gray-400 text-sm">Des mods soigneusement sélectionnés pour une expérience de jeu unique et fluide</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#feca57]/20 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#feca57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Map 3D Interactive</h3>
                <p className="text-gray-400 text-sm">Explorez notre monde via la carte 3D en temps réel depuis votre navigateur</p>
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
            Serveur Minecraft Fabric 1.20.1 - Entre potes
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
