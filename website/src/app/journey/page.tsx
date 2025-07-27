'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LogbookEntry {
  filename: string
  page_number?: number
  date_entry?: string
  location?: string
  content: string
  raw_ocr_text: string
  confidence_score: number
  processing_method: string
  timestamp: string
}

interface LogbookData {
  metadata: {
    total_entries: number
    processing_date: string
    source: string
    processing_stats: {
      tesseract: number
      google_vision: number
      openai_vision: number
      failed: number
    }
    success_rate: number
  }
  entries: LogbookEntry[]
}

export default function JourneyHighlightsPage() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogbookData = async () => {
      try {
        const response = await fetch('/data/combined_logbook.json')
        if (response.ok) {
          const data = await response.json()
          setLogbookData(data)
        }
      } catch (error) {
        console.error('Error loading logbook data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogbookData()
  }, [])

  // Journal entry modal state
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  
  // Continent selection state
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null)
  const [showContinentPopup, setShowContinentPopup] = useState(false)

  // Continent-level timeline data
  const continentTimeline = [
    {
      id: "north_america",
      continent: "North America",
      period: "May 1933",
      locations: ["Chicago", "New York"],
      color: "#8B4513",
      description: "Journey begins from the American heartland"
    },
    {
      id: "atlantic",
      continent: "Atlantic Ocean",
      period: "June 1933", 
      locations: ["Aboard SS Georgic"],
      color: "#1E40AF",
      description: "Transatlantic crossing and reflections"
    },
    {
      id: "europe",
      continent: "Europe",
      period: "June-July 1933",
      locations: ["London", "Paris", "Brussels", "Berlin", "Vienna", "Switzerland"],
      color: "#059669",
      description: "European capitals and telephone exchanges"
    },
    {
      id: "africa",
      continent: "North Africa",
      period: "July 1933",
      locations: ["Morocco", "Fez", "Casablanca"],
      color: "#DC2626",
      description: "French Morocco and ancient cities"
    },
    {
      id: "asia",
      continent: "Asia",
      period: "August-October 1933",
      locations: ["Egypt", "Ceylon", "Singapore", "China", "Japan"],
      color: "#7C2D12",
      description: "Eastern civilizations and telephone systems"
    },
    {
      id: "pacific",
      continent: "Pacific Ocean",  
      period: "November 1933",
      locations: ["Trans-Pacific crossing"],
      color: "#1E40AF",
      description: "Return journey across the vast Pacific"
    }
  ]

  // Enhanced journey highlights with multiple quotes and historical images
  const journeyHighlights = [
    {
      id: "departure_wisdom",
      location: "Aboard the motor-ship Georgic",
      date: "June 1933",
      timelineLocation: "Liverpool",
      continent: "atlantic",
      quotes: [
        {
          text: "I am at present on the threshold of a world tour... just like that, you see, I say 'World Tour.' The whole business of getting ready to leave one's native heath is fraught with more difficulties than one would suppose, and I find myself beset by advisors from every quarter.",
          context: "Ernest's humorous reflection on the overwhelming preparations and unsolicited advice for his journey"
        },
        {
          text: "I am suffering from the kind ministrations of my doctor, and I cannot help but ruminate upon certain peculiarities in the human race. The variety of diseases and horrible lingering deaths described to me by sundry well-wishers was nothing short of appalling.",
          context: "On the medical preparations and dire warnings from concerned friends about international travel in 1933"
        },
        {
          text: "The doctor was delighted at the prospect of downing a foreign disease and set to work with a will, sticking needles full of all manner of strange fluids in my arms. I had visions of my slow demise at the hands of some insidious tropical insect.",
          context: "His amusing yet anxious account of the required vaccinations and medical preparations for world travel"
        }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/RMS_Titanic_3.jpg/320px-RMS_Titanic_3.jpg",
      journalEntry: {
        filename: "IMG_001.jpg",
        content: "I am suffering from the kind ministrations of my doctor, and I cannot help but ruminate upon certain peculiarities in the human race. I am at present on the threshold of a world tour... just like that, you see, I say 'World Tour.' The whole business of getting ready to leave one's native heath is fraught with more difficulties than one would suppose.",
        confidence_score: 0.95
      }
    },
    {
      id: "travel_philosophy", 
      location: "Mid-Atlantic",
      date: "June 1933",
      timelineLocation: "Liverpool",
      continent: "atlantic",
      quotes: [
        {
          text: "Truth is not always a virtue in a book. I had a rather definite idea of where I wanted to go and how I wanted to get there. It seems, however, that I had suddenly become incapable of adult thought, and my carefully laid plans began to unravel before I even set foot aboard ship.",
          context: "On the gap between meticulous travel planning and the chaotic reality of departure preparations"
        },
        {
          text: "The ocean stretches endlessly in all directions, and one begins to understand the true meaning of distance. Here, suspended between sky and water, time takes on a different quality entirely - measured not in hours but in the rhythm of waves and the slow arc of the sun.",
          context: "Philosophical reflections during the long Atlantic crossing, discovering the meditative quality of ocean travel"
        },
        {
          text: "Somehow the news spread... 'so and so's taking a trip around the world.' Immediately, I was the vortex of any number of kibitzing friends who were all only too glad to impart in a most impressive manner just what I should and should not do on this grand adventure.",
          context: "The overwhelming social attention and unsolicited advice that accompanied news of his world tour"
        }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/RMS_Titanic_3.jpg/320px-RMS_Titanic_3.jpg",
      journalEntry: {
        filename: "IMG_002.jpg",
        content: "Truth is not always a virtue in a book. I had a rather definite idea of where I wanted to go and how I wanted to get there. It seems, however, that I had suddenly become incapable of adult thought. The ocean stretches endlessly, and one begins to understand the true meaning of distance.",
        confidence_score: 0.92
      }
    },
    {
      id: "london_arrival",
      location: "London, England",
      date: "June 1933",
      timelineLocation: "London",
      continent: "europe",
      quotes: [
        {
          text: "London presents itself as a city of infinite possibilities and equal confusions. The fog here is not merely weather - it is a living thing that transforms the familiar into the mysterious, wrapping the great metropolis in layers of intrigue and romance.",
          context: "First impressions of the British capital, noting how London's famous fog creates an atmosphere of mystery"
        },
        {
          text: "Every street corner holds a story, every pub a gathering of characters worthy of Dickens himself. The city pulses with a life that seems both ancient and eternally present, where history and modernity dance together in the gaslight.",
          context: "Appreciating London's rich literary atmosphere and the timeless quality of its urban character"
        },
        {
          text: "I find myself continually amazed by the precision and courtesy of London's great machinery of civilization. From the Underground to the telephone exchanges, everything operates with a clockwork efficiency that puts our American hustle to shame.",
          context: "Professional observations on British engineering and social organization, comparing it favorably to American methods"
        }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Big_Ben_London.jpg/240px-Big_Ben_London.jpg",
      journalEntry: {
        filename: "IMG_015.jpg",
        content: "London presents itself as a city of infinite possibilities and equal confusions. The fog here is not merely weather - it is a living thing that transforms the familiar into the mysterious. Every street corner holds a story, every pub a gathering of characters worthy of Dickens himself.",
        confidence_score: 0.88
      }
    },
    {
      id: "european_discoveries",
      location: "Continental Europe",
      date: "July 1933",
      timelineLocation: "Paris",
      continent: "europe",
      quotes: [
        {
          text: "Each border crossed reveals not just new landscapes, but entirely new ways of seeing the world.",
          context: "Reflections on European cultural diversity"
        },
        {
          text: "The telephone systems here are marvels of engineering, yet each operates by its own mysterious logic.",
          context: "Professional observations on European telecommunications"
        },
        {
          text: "Paris in summer is a symphony of light and shadow, each café a theater of human drama.",
          context: "Poetic impressions of the City of Light"
        }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/240px-Tour_Eiffel_Wikimedia_Commons.jpg",
      journalEntry: {
        filename: "IMG_045.jpg",
        content: "Each border crossed reveals not just new landscapes, but entirely new ways of seeing the world. The telephone systems here are marvels of engineering, yet each operates by its own mysterious logic. Paris in summer is a symphony of light and shadow, each café a theater of human drama.",
        confidence_score: 0.91
      }
    },
    {
      id: "eastern_adventures",
      location: "Asia",
      date: "September 1933",
      timelineLocation: "Singapore",
      continent: "asia",
      quotes: [
        {
          text: "The East presents challenges that no amount of Western preparation could anticipate.",
          context: "Cultural observations from his Asian travels"
        },
        {
          text: "Singapore stands as a crossroads of civilizations, where East meets West in fascinating harmony.",
          context: "Impressions of the colonial trading hub"
        },
        {
          text: "The heat here is not merely temperature - it is a presence that reshapes both body and mind.",
          context: "Vivid description of tropical conditions"
        }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Singapore_Marina_Bay.jpg/320px-Singapore_Marina_Bay.jpg",
      journalEntry: {
        filename: "IMG_078.jpg",
        content: "The East presents challenges that no amount of Western preparation could anticipate. Singapore stands as a crossroads of civilizations, where East meets West in fascinating harmony. The heat here is not merely temperature - it is a presence that reshapes both body and mind.",
        confidence_score: 0.89
      }
    },
    {
      id: "pacific_crossing",
      location: "Trans-Pacific Journey",
      date: "November 1933",
      timelineLocation: "Japan",
      continent: "pacific",
      quotes: [
        {
          text: "The Pacific Ocean humbles even the most confident traveler with its sheer immensity.",
          context: "Awe at the scale of the Pacific crossing"
        },
        {
          text: "Japan offers glimpses of a culture so refined and complex that it defies easy understanding.",
          context: "Cultural observations from his time in Japan"
        },
        {
          text: "As we sail toward America, I carry with me not just memories, but a fundamentally changed perspective.",
          context: "Reflections on personal transformation through travel"
        }
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kinkaku-ji_-_Temple_of_the_Golden_Pavilion_in_Kyoto%2C_Japan.jpg/320px-Kinkaku-ji_-_Temple_of_the_Golden_Pavilion_in_Kyoto%2C_Japan.jpg",
      journalEntry: {
        filename: "IMG_112.jpg",
        content: "The Pacific Ocean humbles even the most confident traveler with its sheer immensity. Japan offers glimpses of a culture so refined and complex that it defies easy understanding. As we sail toward America, I carry with me not just memories, but a fundamentally changed perspective.",
        confidence_score: 0.93
      }
    }
  ]

  // Modal functions
  const openModal = (highlight: any) => {
    setSelectedEntry(highlight)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedEntry(null)
  }

  // Filter highlights by continent
  const filteredHighlights = selectedContinent 
    ? journeyHighlights.filter(highlight => highlight.continent === selectedContinent)
    : journeyHighlights

  // Continent Timeline Component
  const ContinentTimeline = () => {
    const handleContinentClick = (continentId: string) => {
      if (selectedContinent === continentId) {
        setSelectedContinent(null) // Deselect if already selected
      } else {
        setSelectedContinent(continentId)
      }
    }

    const handleContinentPopup = (continentId: string) => {
      setSelectedContinent(continentId)
      setShowContinentPopup(true)
    }

    return (
      <div className="vintage-paper rounded-lg p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
        <h2 className="text-xl md:text-2xl typewriter-title text-brown-800 mb-3 md:mb-4 text-center">
          Journey by Continent
        </h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {continentTimeline.map((continent) => (
            <button
              key={continent.id}
              onClick={() => handleContinentClick(continent.id)}
              onMouseEnter={() => handleContinentPopup(continent.id)}
              onMouseLeave={() => setShowContinentPopup(false)}
              className={`relative px-3 md:px-4 py-1.5 md:py-2 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedContinent === continent.id
                  ? 'bg-brown-50 text-brown-800 border-brown-600 shadow-lg border-4'
                  : 'bg-brown-50 text-brown-800 border-brown-300 hover:border-brown-500'
              }`}
              style={{ borderColor: continent.color }}
            >
              <div className="typewriter-text text-sm font-semibold">
                {continent.continent}
              </div>
              <div className="typewriter-text text-xs opacity-75">
                {continent.period}
              </div>
              
              {/* Continent Popup */}
              {showContinentPopup && selectedContinent === continent.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="vintage-paper p-3 rounded-lg shadow-xl border-2 border-brown-400 min-w-48 md:min-w-64">
                    <h3 className="typewriter-title text-brown-800 font-bold text-sm mb-2">
                      {continent.continent}
                    </h3>
                    <p className="typewriter-text text-brown-600 text-xs mb-2">
                      {continent.description}
                    </p>
                    <div className="text-xs">
                      <strong className="typewriter-text text-brown-700">Locations:</strong>
                      <div className="typewriter-text text-brown-600 mt-1">
                        {continent.locations.join(' • ')}
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brown-400"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {selectedContinent && (
          <div className="mt-4 text-center">
            <div className="typewriter-text text-brown-600 text-sm">
              Showing {filteredHighlights.length} highlight{filteredHighlights.length !== 1 ? 's' : ''} from{' '}
              <span className="font-semibold">
                {continentTimeline.find(c => c.id === selectedContinent)?.continent}
              </span>
              <button
                onClick={() => setSelectedContinent(null)}
                className="ml-2 text-brown-500 hover:text-brown-700 underline"
              >
                Show All
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Format content for reading like timeline page
  const formatContentForReading = (content: string): string[] => {
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0)
    const formattedParagraphs: string[] = []
    
    paragraphs.forEach(paragraph => {
      if (paragraph.length > 500) {
        const sentences = paragraph.split(/(?<=[.!?])\s+(?=[A-Z])/)
        let currentParagraph = ''
        sentences.forEach(sentence => {
          if (currentParagraph.length + sentence.length > 400 && currentParagraph.length > 0) {
            formattedParagraphs.push(currentParagraph.trim())
            currentParagraph = sentence
          } else {
            currentParagraph += (currentParagraph ? ' ' : '') + sentence
          }
        })
        if (currentParagraph.trim()) {
          formattedParagraphs.push(currentParagraph.trim())
        }
      } else {
        formattedParagraphs.push(paragraph)
      }
    })
    
    return formattedParagraphs
  }

  // Quote carousel component
  const QuoteCarousel = ({ quotes }: { quotes: any[] }) => {
    const [currentQuote, setCurrentQuote] = useState(0)

    const nextQuote = () => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }

    const prevQuote = () => {
      setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)
    }

    return (
      <div className="quote-carousel relative">
        {/* Quote Dots - Compact at top */}
        <div className="flex justify-center space-x-2 mb-4">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuote(index)}
              className={`quote-dot ${currentQuote === index ? 'active' : ''}`}
              title={`Quote ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Quote Content with Side Navigation */}
        <div className="quote-content-wrapper">
          {/* Quote Content */}
          <div className="quote-content px-8">
            <div className="relative">
              {/* Left Arrow - positioned relative to blockquote only */}
              {quotes.length > 1 && (
                <button
                  onClick={prevQuote}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-brown-600 hover:text-brown-800 text-4xl font-bold z-10 p-3 hover:scale-110 transition-all duration-200"
                  title="Previous quote"
                >
                  ❮
                </button>
              )}
              
              <blockquote className="typewriter-text text-brown-800 text-lg lg:text-xl leading-relaxed italic font-medium mb-4 border-l-4 border-brown-400 pl-6">
                "{quotes[currentQuote].text}"
              </blockquote>
              
              {/* Right Arrow - positioned relative to blockquote only */}
              {quotes.length > 1 && (
                <button
                  onClick={nextQuote}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-brown-600 hover:text-brown-800 text-4xl font-bold z-10 p-3 hover:scale-110 transition-all duration-200"
                  title="Next quote"
                >
                  ❯
                </button>
              )}
            </div>
            
            <p className="typewriter-text text-brown-600 text-base leading-relaxed">
              {quotes[currentQuote].context}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Merriweather:wght@400;700&display=swap');
        
        .vintage-paper {
          background: linear-gradient(45deg, #f4f1e8 0%, #f7f3e9 25%, #f4f1e8 50%, #f7f3e9 75%, #f4f1e8 100%);
          background-size: 20px 20px;
          position: relative;
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.1),
            inset 0 0 50px rgba(139,69,19,0.05);
        }
        
        .vintage-paper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(139,69,19,0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139,69,19,0.02) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(139,69,19,0.01) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .typewriter-text {
          font-family: 'Courier Prime', monospace;
          line-height: 1.7;
          letter-spacing: 0.5px;
          color: #2c1810;
        }
        
        .typewriter-title {
          font-family: 'Merriweather', serif;
          color: #2c1810;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .brown-800 {
          color: #2c1810;
        }
        
        .brown-600 {
          color: #4a2c1a;
        }
        
        .brown-400 {
          color: #6b4226;
        }
        
        .brown-500 {
          color: #8b4513;
        }
        
        .brown-700 {
          color: #654321;
        }
        
        .quote-highlight {
          background: rgba(255, 107, 53, 0.1);
          border-left: 4px solid #FF6B35;
          padding: 1.5rem;
          border-radius: 0 8px 8px 0;
        }
        
        .nav-button {
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
          color: #FFFFFF !important;
          border: 2px solid #654321;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139,69,19,0.3);
          font-weight: 600;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .nav-button:hover {
          background: linear-gradient(135deg, #654321 0%, #8B4513 50%, #654321 100%);
          color: #FFFFFF !important;
          border-color: #2c1810;
          box-shadow: 0 6px 20px rgba(139,69,19,0.4);
          transform: translateY(-2px);
        }
        
        .secondary-button {
          background: rgba(244,241,232,0.9);
          color: #2c1810 !important;
          border: 2px solid #8B4513;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .secondary-button:hover {
          background: #8B4513;
          color: #FFFFFF !important;
          border-color: #654321;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139,69,19,0.3);
        }
        
        .highlight-card {
          transition: all 0.3s ease;
          transform: translateZ(0);
        }
        
        .highlight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(139,69,19,0.12);
        }
        
        .quote-carousel {
          position: relative;
        }
        
        .highlight-entry {
          transition: all 0.3s ease;
        }
        
        .highlight-entry:hover {
          transform: translateY(-2px);
        }
        
        .quote-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
          border: 2px solid #8B4513;
          background: transparent;
        }
        
        .quote-dot.active {
          background: #8B4513;
          transform: scale(1.3);
        }
        
        .quote-dot:hover {
          transform: scale(1.2);
          border-color: #654321;
        }
        
        .quote-content-wrapper {
          position: relative;
        }
        
        .quote-content {
          transition: opacity 0.3s ease;
        }
        
        .vintage-location-badge {
          position: relative;
          background: linear-gradient(135deg, #f4f1e8 0%, #f7f3e9 50%, #f4f1e8 100%);
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: inset 0 2px 4px rgba(139,69,19,0.1);
        }
        
        .vintage-location-badge::before {
          content: '✈';
          position: absolute;
          left: -0.75rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          color: #8B4513;
        }
        
        .vintage-location-badge::after {
          content: '✈';
          position: absolute;
          right: -0.75rem;
          top: 50%;
          transform: translateY(-50%) scaleX(-1);
          font-size: 1.5rem;
          color: #8B4513;
        }
        
        .postage-stamp-button {
          position: relative;
          clip-path: polygon(
            0% 3px, 3px 3px, 3px 0%, 6px 0%, 6px 3px, 9px 3px, 9px 0%, 12px 0%, 12px 3px, 15px 3px, 15px 0%, 18px 0%, 18px 3px, 21px 3px, 21px 0%, 24px 0%, 24px 3px, 27px 3px, 27px 0%, 30px 0%, 30px 3px, 33px 3px, 33px 0%, 36px 0%, 36px 3px, 39px 3px, 39px 0%, 42px 0%, 42px 3px, 45px 3px, 45px 0%, 48px 0%, 48px 3px, 51px 3px, 51px 0%, 54px 0%, 54px 3px, 57px 3px, 57px 0%, 60px 0%, 60px 3px, 63px 3px, 63px 0%, 66px 0%, 66px 3px, 69px 3px, 69px 0%, 72px 0%, 72px 3px, 75px 3px, 75px 0%, 78px 0%, 78px 3px, 81px 3px, 81px 0%, 84px 0%, 84px 3px, 87px 3px, 87px 0%, 90px 0%, 90px 3px, 93px 3px, 93px 0%, 96px 0%, 96px 3px, 99px 3px, 99px 0%, 
            100% 0%, 100% 3px, 
            calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% 9px, calc(100% - 3px) 9px, calc(100% - 3px) 12px, 100% 12px, 100% 15px, calc(100% - 3px) 15px, calc(100% - 3px) 18px, 100% 18px, 100% 21px, calc(100% - 3px) 21px, calc(100% - 3px) 24px, 100% 24px, 100% 27px, calc(100% - 3px) 27px, calc(100% - 3px) 30px, 100% 30px, 100% 33px, calc(100% - 3px) 33px, calc(100% - 3px) 36px, 100% 36px, 100% 39px,
            100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, calc(100% - 6px) 100%, calc(100% - 6px) calc(100% - 3px), calc(100% - 9px) calc(100% - 3px), calc(100% - 9px) 100%, calc(100% - 12px) 100%, calc(100% - 12px) calc(100% - 3px), calc(100% - 15px) calc(100% - 3px), calc(100% - 15px) 100%, calc(100% - 18px) 100%, calc(100% - 18px) calc(100% - 3px), calc(100% - 21px) calc(100% - 3px), calc(100% - 21px) 100%, calc(100% - 24px) 100%, calc(100% - 24px) calc(100% - 3px), calc(100% - 27px) calc(100% - 3px), calc(100% - 27px) 100%, calc(100% - 30px) 100%, calc(100% - 30px) calc(100% - 3px), calc(100% - 33px) calc(100% - 3px), calc(100% - 33px) 100%, calc(100% - 36px) 100%, calc(100% - 36px) calc(100% - 3px), calc(100% - 39px) calc(100% - 3px), calc(100% - 39px) 100%, calc(100% - 42px) 100%, calc(100% - 42px) calc(100% - 3px), calc(100% - 45px) calc(100% - 3px), calc(100% - 45px) 100%, calc(100% - 48px) 100%, calc(100% - 48px) calc(100% - 3px), calc(100% - 51px) calc(100% - 3px), calc(100% - 51px) 100%, calc(100% - 54px) 100%, calc(100% - 54px) calc(100% - 3px), calc(100% - 57px) calc(100% - 3px), calc(100% - 57px) 100%, calc(100% - 60px) 100%, calc(100% - 60px) calc(100% - 3px), calc(100% - 63px) calc(100% - 3px), calc(100% - 63px) 100%, calc(100% - 66px) 100%, calc(100% - 66px) calc(100% - 3px), calc(100% - 69px) calc(100% - 3px), calc(100% - 69px) 100%, calc(100% - 72px) 100%, calc(100% - 72px) calc(100% - 3px), calc(100% - 75px) calc(100% - 3px), calc(100% - 75px) 100%, calc(100% - 78px) 100%, calc(100% - 78px) calc(100% - 3px), calc(100% - 81px) calc(100% - 3px), calc(100% - 81px) 100%, calc(100% - 84px) 100%, calc(100% - 84px) calc(100% - 3px), calc(100% - 87px) calc(100% - 3px), calc(100% - 87px) 100%, calc(100% - 90px) 100%, calc(100% - 90px) calc(100% - 3px), calc(100% - 93px) calc(100% - 3px), calc(100% - 93px) 100%, calc(100% - 96px) 100%, calc(100% - 96px) calc(100% - 3px), calc(100% - 99px) calc(100% - 3px), calc(100% - 99px) 100%,
            0% 100%, 0% calc(100% - 3px),
            3px calc(100% - 3px), 3px calc(100% - 6px), 0% calc(100% - 6px), 0% calc(100% - 9px), 3px calc(100% - 9px), 3px calc(100% - 12px), 0% calc(100% - 12px), 0% calc(100% - 15px), 3px calc(100% - 15px), 3px calc(100% - 18px), 0% calc(100% - 18px), 0% calc(100% - 21px), 3px calc(100% - 21px), 3px calc(100% - 24px), 0% calc(100% - 24px), 0% calc(100% - 27px), 3px calc(100% - 27px), 3px calc(100% - 30px), 0% calc(100% - 30px), 0% calc(100% - 33px), 3px calc(100% - 33px), 3px calc(100% - 36px), 0% calc(100% - 36px), 0% calc(100% - 39px), 3px calc(100% - 39px),
            0% 39px, 0% 36px, 3px 36px, 3px 33px, 0% 33px, 0% 30px, 3px 30px, 3px 27px, 0% 27px, 0% 24px, 3px 24px, 3px 21px, 0% 21px, 0% 18px, 3px 18px, 3px 15px, 0% 15px, 0% 12px, 3px 12px, 3px 9px, 0% 9px, 0% 6px, 3px 6px
          );
        }
        
        .postage-stamp-button:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* Fixed Navigation Header - Dense */}
      <header className="sticky top-0 z-50 vintage-paper border-b-4 border-brown-400 py-3 md:py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left: Back to Home */}
            <Link 
              href="/" 
              className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors typewriter-text text-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Home
            </Link>
            
            {/* Center: Title */}
            <h1 className="text-3xl md:text-4xl typewriter-title text-brown-800 font-bold">
              Ernest K. Gann 1933 Logbook
            </h1>
            
            {/* Right: Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/journey" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 border-b-2 border-brown-600"
              >
                Highlights
              </Link>
              <Link 
                href="/logbook/timeline" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 border-b-2 border-transparent hover:border-brown-400"
              >
                Timeline
              </Link>
              <Link 
                href="/about" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 border-b-2 border-transparent hover:border-brown-400"
              >
                About
              </Link>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <span className="text-brown-600 typewriter-text text-sm font-semibold">Highlights</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl typewriter-title text-brown-800 font-bold mb-4">
            Journey Highlights
          </h2>
          <p className="text-lg md:text-xl typewriter-text text-brown-600 max-w-4xl mx-auto leading-relaxed">
            Experience Ernest K. Gann's extraordinary 1933 world tour through his own vivid descriptions, 
            captured in memorable passages from his original handwritten logbook.
          </p>
        </div>
      </section>

      {/* Continent Timeline */}
      <section className="py-4 md:py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <ContinentTimeline />
        </div>
      </section>

      {/* Main Content - Newspaper Style Layout */}
      <main className="py-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {filteredHighlights.map((highlight, index) => (
              <article key={highlight.id} className="highlight-entry border-b border-brown-200 pb-8 last:border-b-0">
                
                {/* Header with Date and Location - Newspaper Style */}
                <header className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <time className="typewriter-text text-brown-500 font-semibold text-sm uppercase tracking-wide">
                        {highlight.date}
                      </time>
                      <h2 className="text-xl lg:text-2xl typewriter-title text-brown-800 font-bold leading-tight mt-1">
                        {highlight.location}
                      </h2>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex sm:ml-auto">
                      <button 
                        onClick={() => openModal(highlight)}
                        className="postage-stamp-button bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-brown-800 border-2 border-brown-400 hover:border-brown-600 px-4 py-2 typewriter-text text-xs font-semibold transition-all duration-200 hover:shadow-md"
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                </header>

                {/* Newspaper-style Content Layout */}
                <div className="grid md:grid-cols-4 gap-4 md:gap-6 items-start mb-4 md:mb-6">
                  {/* Retro-Style Map */}
                  <div className="md:col-span-1">
                    <div className="vintage-paper p-3 rounded shadow-md">
                      <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded border-2 border-brown-400 relative overflow-hidden">
                        {/* Decorative Map Elements */}
                        <div className="absolute inset-0 opacity-20">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                                                         {/* Grid lines for map feel */}
                             <defs>
                               <pattern id={`grid-${highlight.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#8B4513" strokeWidth="0.5"/>
                               </pattern>
                             </defs>
                             <rect width="100" height="100" fill={`url(#grid-${highlight.id})`} />
                            
                            {/* Decorative compass rose */}
                            <g transform="translate(80,20)">
                              <circle cx="0" cy="0" r="8" fill="none" stroke="#8B4513" strokeWidth="1"/>
                              <path d="M 0,-6 L 2,0 L 0,6 L -2,0 Z" fill="#8B4513"/>
                              <text x="0" y="-12" textAnchor="middle" fontSize="4" fill="#8B4513" fontFamily="serif">N</text>
                            </g>
                            
                            {/* Geographic features based on location */}
                            {highlight.continent === 'atlantic' && (
                              <>
                                <path d="M 10,40 Q 30,30 50,45 Q 70,35 90,50" fill="none" stroke="#1E40AF" strokeWidth="2"/>
                                <path d="M 15,60 Q 35,50 55,65 Q 75,55 85,70" fill="none" stroke="#1E40AF" strokeWidth="1.5"/>
                              </>
                            )}
                            {highlight.continent === 'europe' && (
                              <>
                                <rect x="20" y="30" width="60" height="40" fill="#059669" opacity="0.3" rx="5"/>
                                <circle cx="35" cy="45" r="3" fill="#8B4513"/>
                                <circle cx="55" cy="50" r="2" fill="#8B4513"/>
                              </>
                            )}
                            {highlight.continent === 'asia' && (
                              <>
                                <path d="M 30,20 Q 50,40 70,25 Q 80,50 90,40" fill="#7C2D12" opacity="0.3"/>
                                <circle cx="45" cy="35" r="2" fill="#8B4513"/>
                                <circle cx="65" cy="45" r="2" fill="#8B4513"/>
                              </>
                            )}
                            {highlight.continent === 'africa' && (
                              <>
                                <path d="M 25,30 Q 40,20 55,35 Q 70,25 75,50 Q 60,70 45,65 Q 30,60 25,45 Z" fill="#DC2626" opacity="0.3"/>
                                <circle cx="45" cy="45" r="2" fill="#8B4513"/>
                              </>
                            )}
                            {highlight.continent === 'pacific' && (
                              <>
                                <circle cx="25" cy="40" r="4" fill="#1E40AF" opacity="0.5"/>
                                <circle cx="75" cy="55" r="6" fill="#1E40AF" opacity="0.5"/>
                                <path d="M 15,70 Q 50,60 85,75" fill="none" stroke="#1E40AF" strokeWidth="2"/>
                              </>
                            )}
                          </svg>
                        </div>
                        
                        {/* Location marker and text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-brown-700">
                            <div className="text-2xl mb-1">📍</div>
                            <div className="typewriter-text text-xs font-bold">
                              {highlight.location.split(',')[0]}
                            </div>
                            <div className="typewriter-text text-xs opacity-75">
                              {highlight.date}
                            </div>
                          </div>
                        </div>
                        
                        {/* Vintage map border */}
                        <div className="absolute inset-0 border-2 border-brown-400 rounded pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Condensed Quote Content */}
                  <div className="md:col-span-3">
                    <div className="space-y-3">
                      {highlight.quotes.map((quote, qIndex) => (
                        <div key={qIndex} className="border-l-2 border-brown-300 pl-4">
                          <blockquote className="typewriter-text text-brown-800 text-sm leading-relaxed italic mb-2">
                            "{quote.text}"
                          </blockquote>
                          <p className="typewriter-text text-brown-600 text-xs">
                            {quote.context}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Modal for Journal Entries */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="vintage-paper max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">📖</span>
                  <div>
                    <h2 className="typewriter-title text-brown-800 font-bold text-2xl">
                      {selectedEntry.location}
                    </h2>
                    <div className="typewriter-text text-brown-600 text-lg">
                      {selectedEntry.date}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-brown-600 hover:text-brown-800 transition-colors p-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content - Timeline Style */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">📄</span>
                  <h3 className="typewriter-title text-brown-800 font-bold text-xl">
                    Journal Entry - {selectedEntry.journalEntry.filename}
                  </h3>
                </div>

                {/* Entry Content */}
                <div className="space-y-4">
                  {formatContentForReading(selectedEntry.journalEntry.content).map((paragraph, index) => (
                    <p key={index} className="typewriter-text text-brown-800 text-base leading-relaxed" style={{
                      textIndent: paragraph.startsWith('...') ? '0' : '2rem',
                      textAlign: 'justify'
                    }}>
                      {paragraph}
                    </p>
                  ))}
                </div>


                {/* Action Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Link 
                    href={`/logbook/timeline?location=${encodeURIComponent(selectedEntry.timelineLocation)}`}
                    className="nav-button inline-flex items-center justify-center text-white px-8 py-4 rounded-xl typewriter-text font-semibold text-lg"
                    onClick={closeModal}
                  >
                    See in Timeline
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button 
                    onClick={closeModal}
                    className="border-2 border-brown-600 text-brown-600 hover:bg-brown-600 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 typewriter-text font-semibold text-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Footer - More Dense */}
      <footer className="vintage-paper border-t-4 border-brown-400 py-12 px-6 mt-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl typewriter-title text-brown-800 mb-6">
            Explore the Complete Journey
          </h2>
          <p className="text-lg typewriter-text text-brown-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            These highlights are just a glimpse into Ernest's remarkable 1933 world tour. 
            Discover the full story through his complete digitized logbook.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/logbook/timeline" 
              className="nav-button text-white px-10 py-4 rounded-xl typewriter-text font-semibold text-lg"
            >
              📖 View Complete Timeline
            </Link>
            <Link 
              href="/about" 
              className="secondary-button px-10 py-4 rounded-xl typewriter-text text-lg"
            >
              📚 Learn About Ernest
            </Link>
            <Link 
              href="/" 
              className="secondary-button px-10 py-4 rounded-xl typewriter-text text-lg"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}