import { useState, useEffect, useRef } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Slider } from "./components/ui/slider"
import { ImagePlus, Music, Image, Type, Layout, RotateCcw, ChevronUp, Menu, X, ArrowRight, Check, Mail, Share2, Twitter, Instagram, Facebook, Link as LinkIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { Link } from "react-router-dom"
import html2canvas from 'html2canvas'

// Définition des polices disponibles
const FONTS = [
  { name: "SF Pro Display", value: "-apple-system" },
  { name: "Inter", value: "Inter" },
  { name: "Playfair Display", value: "'Playfair Display'" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Roboto", value: "Roboto" },
]

// Définition des effets de texte
const TEXT_EFFECTS = [
  { name: "None", value: "none" },
  { name: "Soft shadow", value: "shadow-sm" },
  { name: "Medium shadow", value: "shadow-md" },
  { name: "Strong shadow", value: "shadow-lg" },
  { name: "White outline", value: "text-stroke-light" },
  { name: "Black outline", value: "text-stroke-dark" },
]

function App() {
  const [background, setBackground] = useState(null)
  const [text, setText] = useState("My Playlist")
  const [fontSize, setFontSize] = useState(31)
  const [verticalPosition, setVerticalPosition] = useState("bottom")
  const [horizontalPosition, setHorizontalPosition] = useState("center")
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value)
  const [textEffect, setTextEffect] = useState(TEXT_EFFECTS[0].value)
  const [rotation, setRotation] = useState(0)
  const [textColor, setTextColor] = useState("#FFFFFF")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const previewRef = useRef(null)
  const [activeSection, setActiveSection] = useState('home')

  // Gestion du scroll pour la navbar et le bouton scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 500)

      // Détection de la section active
      const sections = ['generator', 'how-it-works', 'features']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      }) || 'home'

      setActiveSection(currentSection)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackground(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getTextPosition = () => {
    const vertical = verticalPosition === "top" ? "top-12" : 
                    verticalPosition === "center" ? "top-1/2 -translate-y-1/2" : 
                    "bottom-12"
    const horizontal = horizontalPosition === "left" ? "text-left px-12" :
                      horizontalPosition === "right" ? "text-right px-12" :
                      "text-center px-12"
    return `${vertical} ${horizontal}`
  }

  const getGradientOverlay = () => {
    if (verticalPosition === "top") {
      return "bg-gradient-to-b from-black/60 via-transparent to-transparent"
    } else if (verticalPosition === "center") {
      return "bg-black/30"
    } else {
      return "bg-gradient-to-t from-black/60 via-transparent to-transparent"
    }
  }

  const getTextStyles = () => {
    return {
      fontSize: `${fontSize}px`,
      fontFamily: selectedFont,
      transform: `rotate(${rotation}deg)`,
      color: textColor,
      textShadow: textEffect === 'shadow-sm' ? '0 1px 2px rgba(0,0,0,0.3)' :
                  textEffect === 'shadow-md' ? '0 2px 4px rgba(0,0,0,0.4)' :
                  textEffect === 'shadow-lg' ? '0 4px 8px rgba(0,0,0,0.5)' :
                  textEffect === 'text-stroke-light' ? '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' :
                  textEffect === 'text-stroke-dark' ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' :
                  'none',
    }
  }

  const handleShare = async (platform) => {
    const shareUrl = window.location.href
    const text = "Create your playlist covers with PlaylistCover ✨"

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
        break
      case 'instagram':
        // Instagram ne permet pas le partage direct via URL, on copie le lien
        await navigator.clipboard.writeText(shareUrl)
        alert('Lien copied! Paste it in your Instagram story')
        break
      case 'copy':
        await navigator.clipboard.writeText(shareUrl)
        alert('Lien copied!')
        break
    }
  }

  const handleDownload = async () => {
    if (!background) {
      alert("Please upload an image first")
      return
    }

    try {
      const element = previewRef.current
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      })

      const link = document.createElement('a')
      link.download = 'playlist-cover.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      // Afficher le popup après le téléchargement
      setShowSuccessPopup(true)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      alert('An error occurred during download')
    }
  }

  // Dans la partie navigation, modifions l'ordre et ajoutons les styles actifs
  const navItems = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'features', label: 'Features' },
    { id: 'generator', label: 'Generator' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/20" : ""
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              PlaylistCover
            </a>
            
            {/* Navigation centrale style iPadOS */}
            <div className="hidden md:flex items-center">
              <div className="bg-slate-100/80 backdrop-blur-xl rounded-full p-1.5 shadow-sm">
                <div className="flex items-center gap-1">
                  {navItems.map(item => (
                    <a 
                      key={item.id}
                      href={`#${item.id}`}
                      className={`
                        px-4 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-300
                        ${activeSection === item.id 
                          ? 'bg-white text-indigo-600 shadow-sm' 
                          : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                        }
                      `}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-600/90 backdrop-blur-xl text-white hover:bg-indigo-600 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                Create now
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://donate.stripe.com/7sIdU9fLK0wE5moeUU', '_blank')}
                className="border-slate-200/50 bg-white/50 backdrop-blur-xl text-slate-600 hover:bg-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
              >
                <span>☕️</span> Support me
              </Button>
            </div>

            {/* Menu mobile */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-slate-100/80 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-600" />
              ) : (
                <Menu className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/80 backdrop-blur-xl border-t border-slate-200/20">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className={`
                    block px-4 py-2 text-sm rounded-full transition-colors
                    ${activeSection === item.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100/80'
                    }
                  `}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 space-y-2">
                <Button 
                  onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-indigo-600/90 text-white hover:bg-indigo-600 rounded-full py-2 text-sm font-medium"
                >
                  Create now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://donate.stripe.com/7sIdU9fLK0wE5moeUU', '_blank')}
                  className="w-full border-slate-200/50 bg-white/50 text-slate-600 hover:bg-white rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>☕️</span> Support me
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Popup de succès */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl border border-slate-200/20">
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Cover downloaded!</h3>
              <p className="text-slate-600 mb-6">
                Your playlist cover has been successfully created. If you enjoy this tool, you can:
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => window.open('https://donate.stripe.com/7sIdU9fLK0wE5moeUU', '_blank')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                >
                  <span className="text-lg mr-2">☕️</span>
                  Buy me a coffee
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Lien copied!')
                  }}
                  className="w-full border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share the tool
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-8 overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Texte */}
          <div className="text-center md:text-left relative z-10">
            <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-50 rounded-full">
              <p className="text-sm font-medium text-indigo-600">
                New! Playlist Cover Generator
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 leading-tight">
              Bring your Playlists to Life
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
              Create unique and professional covers for your playlists in just a few clicks.
              Customize every aspect and stand out.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button 
                onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-500 text-white hover:bg-indigo-600 text-lg px-10 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
              >
                Create my cover
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-6 rounded-full"
              >
                Learn more
              </Button>
            </div>
          </div>

          {/* Image iPhone */}
          <div className="relative w-full max-w-[320px] mx-auto mt-8">
            <div className="relative">
              <img 
                src="/demo-iphone-4.png"
                alt="Démonstration sur iPhone" 
                className="w-full"
              />
            </div>
            
            {/* Nouvelle section promo playlist */}
            <div className="mt-6 text-center">
              <a 
                href="https://music.apple.com/fr/playlist/no-fucking-problem/pl.u-Ymb0ELgtg8ygdyq?l=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20 backdrop-blur-sm rounded-full shadow-sm hover:shadow transition-all duration-300 group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                  <Music className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                  Listen to "No Fucking Problem"
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Create your playlist cover in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "1",
                title: "Import your image",
                description: "Choose an image that represents your playlist's mood"
              },
              {
                step: "2",
                title: "Customize",
                description: "Add your text and adjust the style to your preferences"
              },
              {
                step: "3",
                title: "Download",
                description: "Get your cover and use it for your playlist"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {step.step}
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 pt-12 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 mt-8 sm:mt-12 px-4 sm:px-8 bg-gradient-to-b from-white to-slate-50/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
              Everything you need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful and intuitive tools to create covers that look like you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Type,
                title: "Complete customization",
                description: "Fonts, sizes, colors and effects. Adjust every detail to your preferences."
              },
              {
                icon: Layout,
                title: "Flexible layout",
                description: "Position and rotate your texts freely. Create unique and creative designs."
              },
              {
                icon: Image,
                title: "Image import",
                description: "Use your own images or photos to create personalized covers."
              },
              {
                icon: Share2,
                title: "Easy sharing",
                description: "Download and share your covers instantly. No account needed, completely free."
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900">
              Cover Generator
            </h2>
            <p className="text-slate-600 text-lg">Create your personalized playlist cover</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Prévisualisation */}
            <div className="w-full">
              <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-xl bg-white">
                {background ? (
                  <div className="relative w-full h-full" ref={previewRef}>
                    <img 
                      src={background} 
                      alt="Background" 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className={`absolute inset-0 ${getGradientOverlay()}`}>
                      <h2 
                        className={`text-white font-bold absolute w-full ${getTextPosition()}`}
                        style={getTextStyles()}
                      >
                        {text}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                        <ImagePlus className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600">Import image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contrôles */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl space-y-7 shadow-xl border border-slate-200/80">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-base font-medium text-slate-900">Background image</Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => document.getElementById('image').click()}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 border-2 border-slate-200 flex items-center justify-center gap-2 py-6 transition-colors duration-200"
                  >
                    <ImagePlus className="w-5 h-5" />
                    Import image
                  </Button>
                </div>
                <div className="text-sm text-slate-500 space-y-1 mt-2">
                  <p>Image recommendations:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    <li>Square format (1:1)</li>
                    <li>Minimum recommended size: 1000 x 1000 pixels</li>
                    <li>Maximum size: 4000 x 4000 pixels</li>
                    <li>Accepted formats: JPG, PNG</li>
                  </ul>
                </div>
              </div>

              <div>
                <Label htmlFor="text" className="text-base font-medium text-slate-900">Text</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <Label className="text-base font-medium text-slate-900">
                  Text size: {fontSize}px
                </Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={([value]) => setFontSize(value)}
                  min={16}
                  max={72}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium text-slate-900">Vertical position</Label>
                  <Select value={verticalPosition} onValueChange={setVerticalPosition}>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium text-slate-900">Horizontal position</Label>
                  <Select value={horizontalPosition} onValueChange={setHorizontalPosition}>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sélection de la police */}
              <div>
                <Label className="text-base font-medium text-slate-900">Font</Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {FONTS.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Effets de texte */}
              <div>
                <Label className="text-base font-medium text-slate-900">Text effect</Label>
                <Select value={textEffect} onValueChange={setTextEffect}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {TEXT_EFFECTS.map((effect) => (
                      <SelectItem key={effect.value} value={effect.value}>
                        {effect.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Couleur du texte */}
              <div>
                <Label className="text-base font-medium text-slate-900">Text color</Label>
                <div className="flex gap-4">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-20 h-10 p-1 bg-slate-50 border-slate-200"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 bg-slate-50 border-slate-200"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Rotation du texte */}
              <div>
                <Label className="text-base font-medium text-slate-900">
                  Rotation: {rotation}°
                </Label>
                <div className="flex gap-4 items-center">
                  <Slider
                    value={[rotation]}
                    onValueChange={([value]) => setRotation(value)}
                    min={-180}
                    max={180}
                    step={1}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => setRotation(0)}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-lg py-6 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Download
              </Button>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://donate.stripe.com/7sIdU9fLK0wE5moeUU', '_blank')}
                  className="w-full flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
                >
                  <span className="text-lg">☕️</span>
                  Buy me a coffee to support me
                </Button>
              </div>

              {/* Section Partage */}
              <div className="pt-8 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50"
                  onClick={() => {
                    const shareUrl = window.location.href
                    navigator.clipboard.writeText(shareUrl)
                    alert('Lien copied!')
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share the tool
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
                PlaylistCover
              </h3>
              <p className="text-slate-400">
                Create unique covers for your music playlists. A simple and free tool to customize your playlists.
              </p>
              <a 
                href="https://matteorbdr.substack.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                ✍️ Support the creator on Substack
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How it works</a></li>
                <li><a href="#generator" className="text-slate-400 hover:text-white transition-colors">Generator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact & Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:contact@matteorbdr.com" 
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Support
                  </a>
                </li>
                <li>
                  <Link 
                    to="/mentions-legales" 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Legal Notice
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} PlaylistCover. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Bouton Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default App 