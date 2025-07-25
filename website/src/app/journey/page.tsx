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

  // Notable quotes extracted from actual logbook content
  const journeyHighlights = [
    {
      id: "departure_wisdom",
      location: "Aboard the motor-ship Georgic",
      date: "June 1933",
      quote: "I am suffering from the kind ministrations of my doctor, and I cannot help but ruminate upon certain peculiarities in the human race. I am at present on the threshold of a world tour... just like that, you see, I say 'World Tour.'",
      context: "Ernest's humorous reflection on the overwhelming preparations for his journey",
      image: "departure"
    },
    {
      id: "travel_philosophy", 
      location: "Mid-Ocean",
      date: "June 1933",
      quote: "Truth is not always a virtue in a book. I had a rather definite idea of where I wanted to go and how I wanted to get there. It seems, however, that I had suddenly become incapable of adult thought.",
      context: "On the chaos of travel planning and well-meaning advice from friends",
      image: "departure"
    },
    {
      id: "friends_advice",
      location: "Before Departure",
      date: "May 1933", 
      quote: "The variety of diseases and horrible lingering deaths described to me by sundry well-wishers was nothing short of appalling. I had visions of my slow demise at the hands of some insidious tropical insect.",
      context: "Ernest's wry observation about the 'helpful' warnings from concerned friends",
      image: "departure"
    },
    {
      id: "world_explorer",
      location: "Planning Phase",
      date: "Early 1933",
      quote: "I was the possessor of a quantity of charts and maps of the world and its environs for which Magellan would have traded his best satin jerkin.",
      context: "His excitement about the extensive preparation and research for the journey",
      image: "departure"
    },
    {
      id: "social_whirlwind",
      location: "Pre-Departure",
      date: "Spring 1933",
      quote: "Somehow the news spread... 'so and so's taking a trip around the world.' Immediately, I was the vortex of any number of kibitzing friends who were all only too glad to impart in a most impressive manner just what I should and should not do.",
      context: "The social circus that surrounded his travel plans",
      image: "departure"
    },
    {
      id: "medical_preparations",
      location: "Doctor's Office",
      date: "May 1933",
      quote: "The doctor was delighted at the prospect of downing a foreign disease and set to work with a will, sticking needles full of all manner of strange fluids in my arms.",
      context: "His amusing account of the required vaccinations and medical preparations",
      image: "departure"
    }
  ]

  const getImagePath = (imageId: string): string => {
    return `/images/journey/${imageId}.jpg`
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
      `}</style>

      {/* Header */}
      <header className="vintage-paper border-b-4 border-brown-400 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors mb-8 typewriter-text text-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ← Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl typewriter-title text-brown-800 mb-6">
              Journey Highlights
            </h1>
            <p className="text-xl typewriter-text text-brown-600 max-w-4xl mx-auto leading-relaxed">
              Notable quotes and observations from Ernest K. Gann's extraordinary 1933 world tour, 
              captured in his own words from the original logbook.
            </p>
            {!loading && logbookData && (
              <div className="mt-6 text-brown-500">
                <span className="vintage-paper px-6 py-3 rounded-full typewriter-text border-2 border-brown-400">
                  📖 Drawn from {logbookData.metadata.total_entries} original logbook pages
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {journeyHighlights.map((highlight, index) => {
              const isEven = index % 2 === 0
              
              return (
                <div key={highlight.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                  {/* Image */}
                  <div className="lg:w-2/5">
                    <div className="relative group">
                      <div className="vintage-paper p-4 rounded-xl shadow-2xl">
                        <img
                          src={getImagePath(highlight.image)}
                          alt={`${highlight.location} - ${highlight.date}`}
                          className="w-full h-64 object-cover rounded-lg shadow-inner transform transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder-journey.jpg'
                          }}
                        />
                        <div className="absolute inset-4 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg pointer-events-none" />
                        <div className="absolute bottom-8 left-8 text-white">
                          <div className="typewriter-text text-sm font-medium opacity-90">{highlight.date}</div>
                          <div className="typewriter-title text-lg font-bold">{highlight.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quote Content */}
                  <div className="lg:w-3/5">
                    <div className="vintage-paper p-8 rounded-xl shadow-2xl">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="typewriter-text text-brown-500 font-semibold text-lg">
                            📅 {highlight.date}
                          </div>
                          <h2 className="text-2xl typewriter-title text-brown-800 font-bold">
                            {highlight.location}
                          </h2>
                        </div>
                        
                        {/* Main Quote */}
                        <div className="quote-highlight">
                          <blockquote className="typewriter-text text-brown-800 text-lg leading-relaxed italic">
                            "{highlight.quote}"
                          </blockquote>
                        </div>

                        {/* Context */}
                        <div className="border-t-2 border-brown-200 pt-4">
                          <p className="typewriter-text text-brown-600 leading-relaxed">
                            {highlight.context}
                          </p>
                        </div>

                        {/* Link to Timeline */}
                        <div className="pt-4">
                          <Link 
                            href="/logbook/timeline"
                            className="inline-flex items-center bg-brown-600 hover:bg-brown-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 typewriter-text font-semibold"
                          >
                            📖 Read Full Timeline Entry
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Call to Action Footer */}
      <footer className="vintage-paper border-t-4 border-brown-400 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl typewriter-title text-brown-800 mb-6">
            Explore the Complete Journey
          </h2>
          <p className="text-lg typewriter-text text-brown-600 mb-8 leading-relaxed">
            These highlights are just a glimpse into Ernest's remarkable 1933 world tour. 
            Discover the full story through his complete digitized logbook.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/logbook/timeline" 
              className="bg-brown-600 hover:bg-brown-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 typewriter-text font-semibold text-lg"
            >
              📖 View Complete Timeline
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-brown-600 text-brown-600 hover:bg-brown-600 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 typewriter-text font-semibold text-lg"
            >
              📚 Learn About Ernest
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
