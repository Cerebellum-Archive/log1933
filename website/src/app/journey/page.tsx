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

  // Enhanced journey highlights with multiple quotes and historical images
  const journeyHighlights = [
    {
      id: "departure_wisdom",
      location: "Aboard the motor-ship Georgic",
      date: "June 1933",
      timelineLocation: "Liverpool",
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
      image: "/images/gann-portrait.jpg",
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
      image: "/images/placeholder-journey.jpg",
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
      image: "/images/placeholder-journey.jpg",
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
      image: "/images/placeholder-journey.jpg",
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
      image: "/images/placeholder-journey.jpg",
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
      image: "/images/placeholder-journey.jpg",
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
        <div className="quote-content-wrapper relative">
          {/* Left Arrow */}
          {quotes.length > 1 && (
            <button
              onClick={prevQuote}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-brown-600 hover:text-brown-800 text-2xl font-bold z-10 p-2"
              title="Previous quote"
            >
              ‹
            </button>
          )}
          
          {/* Quote Content */}
          <div className="quote-content px-8">
            <blockquote className="typewriter-text text-brown-800 text-lg lg:text-xl leading-relaxed italic font-medium mb-4 border-l-4 border-brown-400 pl-6">
              "{quotes[currentQuote].text}"
            </blockquote>
            <p className="typewriter-text text-brown-600 text-base leading-relaxed">
              {quotes[currentQuote].context}
            </p>
          </div>
          
          {/* Right Arrow */}
          {quotes.length > 1 && (
            <button
              onClick={nextQuote}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-brown-600 hover:text-brown-800 text-2xl font-bold z-10 p-2"
              title="Next quote"
            >
              ›
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap');
        
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
          font-family: 'Special Elite', cursive;
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
      `}</style>

      {/* Fixed Navigation Header - Dense */}
      <header className="sticky top-0 z-50 vintage-paper border-b-4 border-brown-400 py-3 px-6">
        <div className="max-w-7xl mx-auto">
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
              Journey Highlights
            </h1>
            
            {/* Right: Quick Navigation */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/logbook/timeline" 
                className="nav-button text-white px-4 py-2 rounded-lg typewriter-text font-semibold text-sm"
              >
                📖 Timeline
              </Link>
              <Link 
                href="/about" 
                className="nav-button text-white px-4 py-2 rounded-lg typewriter-text font-semibold text-sm"
              >
                👨‍✈️ About
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="py-8 px-6">
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

      {/* Main Content - Simplified Clean Layout */}
      <main className="py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {journeyHighlights.map((highlight, index) => (
              <article key={highlight.id} className="highlight-entry border-b border-brown-200 pb-12 last:border-b-0">
                
                {/* Header with Date and Location */}
                <header className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <time className="typewriter-text text-brown-500 font-semibold text-lg">
                        📅 {highlight.date}
                      </time>
                      <h2 className="text-3xl lg:text-4xl typewriter-title text-brown-800 font-bold leading-tight mt-2">
                        {highlight.location}
                      </h2>
                    </div>
                    
                    {/* Action Buttons - Simplified */}
                    <div className="flex gap-3 sm:ml-auto">
                      <button 
                        onClick={() => openModal(highlight)}
                        className="nav-button px-4 py-2 rounded typewriter-text text-sm"
                      >
                        View Entry
                      </button>
                      <Link 
                        href={`/logbook/timeline?location=${encodeURIComponent(highlight.timelineLocation)}`}
                        className="secondary-button px-4 py-2 rounded typewriter-text text-sm"
                      >
                        Timeline
                      </Link>
                    </div>
                  </div>
                </header>

                {/* Quote Content - Clean Single Panel */}
                <div className="quote-section">
                  <QuoteCarousel quotes={highlight.quotes} />
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

                {/* Entry Metadata */}
                <div className="mt-6 pt-4 border-t border-brown-200 bg-brown-50 p-4 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="typewriter-text text-brown-600">
                      <strong>Source:</strong> {selectedEntry.journalEntry.filename}
                    </div>
                    <div className="typewriter-text text-brown-600">
                      <strong>Confidence:</strong> {Math.round(selectedEntry.journalEntry.confidence_score * 100)}%
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Link 
                    href={`/logbook/timeline?location=${encodeURIComponent(selectedEntry.timelineLocation)}`}
                    className="nav-button inline-flex items-center justify-center text-white px-8 py-4 rounded-xl typewriter-text font-semibold text-lg"
                    onClick={closeModal}
                  >
                    🗺️ Go to Timeline Location
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