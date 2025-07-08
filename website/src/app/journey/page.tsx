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
    average_confidence: number
  }
  entries: LogbookEntry[]
}

const journeyData = [
  {
    date: "January 1933",
    location: "Chicago, Illinois",
    title: "The Assignment",
    description: "George Kellogg Gann, a telephone company executive, gives his son Ernest an assignment to travel around the world and review telephone companies in Europe and Asia.",
    image: "/images/journey/chicago-1933.jpg",
    fallbackImage: "/images/chicago-1933.jpg",
    searchMonth: "01",
    searchYear: "1933"
  },
  {
    date: "February 1933",
    location: "New York City",
    title: "Departure",
    description: "Ernest boards a steamship bound for Europe, beginning his world tour. At 23, he was a Yale dropout with dreams of filmmaking.",
    image: "/images/journey/nyc-departure-1933.jpg",
    fallbackImage: "/images/nyc-1933.jpg",
    searchMonth: "02",
    searchYear: "1933"
  },
  {
    date: "March 1933",
    location: "London, England",
    title: "European Telephone Review",
    description: "Ernest begins his review of European telephone systems, starting with the British Post Office telephone network.",
    image: "/images/journey/london-1933.jpg",
    fallbackImage: "/images/london-1933.jpg",
    searchMonth: "03",
    searchYear: "1933"
  },
  {
    date: "April 1933",
    location: "Paris, France",
    title: "French Telecommunications",
    description: "Continuing his journey through Europe, Ernest studies the French telephone system and experiences the culture of Paris.",
    image: "/images/journey/paris-1933.jpg",
    fallbackImage: "/images/paris-1933.jpg",
    searchMonth: "04",
    searchYear: "1933"
  },
  {
    date: "May 1933",
    location: "Berlin, Germany",
    title: "German Innovation",
    description: "Ernest reviews the German telephone infrastructure, witnessing the technological advances of the era.",
    image: "/images/journey/berlin-1933.jpg",
    fallbackImage: "/images/berlin-1933.jpg",
    searchMonth: "05",
    searchYear: "1933"
  },
  {
    date: "June 1933",
    location: "Moscow, Soviet Union",
    title: "Soviet Communications",
    description: "A challenging leg of the journey as Ernest reviews the Soviet telephone system during a period of significant change.",
    image: "/images/journey/moscow-1933.jpg",
    fallbackImage: "/images/moscow-1933.jpg",
    searchMonth: "06",
    searchYear: "1933"
  },
  {
    date: "July 1933",
    location: "Tokyo, Japan",
    title: "Japanese Technology",
    description: "Ernest arrives in Asia, beginning his review of Japanese telecommunications and experiencing a vastly different culture.",
    image: "/images/journey/tokyo-1933.jpg",
    fallbackImage: "/images/tokyo-1933.jpg",
    searchMonth: "07",
    searchYear: "1933"
  },
  {
    date: "August 1933",
    location: "Shanghai, China",
    title: "Chinese Communications",
    description: "Continuing through Asia, Ernest studies the Chinese telephone system in the international port city of Shanghai.",
    image: "/images/journey/shanghai-1933.jpg",
    fallbackImage: "/images/shanghai-1933.jpg",
    searchMonth: "08",
    searchYear: "1933"
  },
  {
    date: "September 1933",
    location: "Hong Kong",
    title: "British Colony",
    description: "Ernest reviews the telephone system in the British colony of Hong Kong, experiencing the blend of Eastern and Western influences.",
    image: "/images/journey/hongkong-1933.jpg",
    fallbackImage: "/images/hongkong-1933.jpg",
    searchMonth: "09",
    searchYear: "1933"
  },
  {
    date: "October 1933",
    location: "Singapore",
    title: "Strait Settlements",
    description: "The journey continues through Southeast Asia as Ernest reviews telecommunications in the British Straits Settlements.",
    image: "/images/journey/singapore-1933.jpg",
    fallbackImage: "/images/singapore-1933.jpg",
    searchMonth: "10",
    searchYear: "1933"
  },
  {
    date: "November 1933",
    location: "Bombay, India",
    title: "Indian Subcontinent",
    description: "Ernest arrives in India, reviewing the telephone systems of the British Raj and experiencing the vastness of the subcontinent.",
    image: "/images/journey/bombay-1933.jpg",
    fallbackImage: "/images/bombay-1933.jpg",
    searchMonth: "11",
    searchYear: "1933"
  },
  {
    date: "December 1933",
    location: "Return to America",
    title: "Homeward Bound",
    description: "After nearly a year of travel, Ernest returns to America with a wealth of experience and observations that would later influence his writing.",
    image: "/images/journey/return-america-1933.jpg",
    fallbackImage: "/images/return-1933.jpg",
    searchMonth: "12",
    searchYear: "1933"
  }
]

export default function JourneyPage() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchLogbookData = async () => {
      try {
        const response = await fetch('/data/complete_logbook.json')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        setLogbookData(data)
      } catch (err) {
        console.error('Error fetching logbook data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load logbook data')
      } finally {
        setLoading(false)
      }
    }

    fetchLogbookData()
  }, [])

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set(prev).add(imagePath))
  }

  // Function to find logbook entries for a specific month/year
  const findEntriesForMonth = (month: string, year: string) => {
    if (!logbookData) return []
    
    return logbookData.entries.filter(entry => {
      if (!entry.date_entry) return false
      
      const dateStr = entry.date_entry.toLowerCase()
      
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [entryYear, entryMonth] = dateStr.split('-')
        return entryYear === year && entryMonth === month
      }
      
      if (dateStr.includes(year)) {
        const monthNames = [
          'january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december'
        ]
        const monthIndex = monthNames.findIndex(name => dateStr.includes(name))
        if (monthIndex !== -1) {
          const expectedMonth = String(monthIndex + 1).padStart(2, '0')
          return expectedMonth === month
        }
      }
      
      return false
    })
  }

  const getBestEntryForTimelineItem = (timelineItem: any) => {
    const entries = findEntriesForMonth(timelineItem.searchMonth, timelineItem.searchYear)
    if (entries.length === 0) return null
    
    return entries.reduce((best, current) => 
      current.confidence_score > best.confidence_score ? current : best
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading journey data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-300 hover:text-white transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            The 1933 Journey
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl">
            Follow Ernest K. Gann&apos;s world tour through Europe and Asia, 
            reviewing telephone companies and experiencing diverse cultures.
          </p>
        </div>
      </header>

      {/* Journey Timeline */}
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {journeyData.map((stop, index) => {
              const logbookEntry = getBestEntryForTimelineItem(stop)
              const entryCount = findEntriesForMonth(stop.searchMonth, stop.searchYear).length
              const hasImageError = imageErrors.has(stop.image)
              
              return (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  {index < journeyData.length - 1 && (
                    <div className="absolute left-8 top-24 w-0.5 h-32 bg-blue-500 opacity-30"></div>
                  )}
                  
                  {/* Timeline node */}
                  <div className="absolute left-6 top-8 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900"></div>
                  
                  {/* Content */}
                  <div className="ml-20 grid md:grid-cols-2 gap-8 items-center">
                    {/* Image */}
                    <div className="relative">
                      <img 
                        src={hasImageError ? stop.fallbackImage : stop.image}
                        alt={`${stop.location} in ${stop.date}`}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                        onError={() => handleImageError(stop.image)}
                      />
                      {!hasImageError && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                          🎨 AI Generated
                        </div>
                      )}
                    </div>
                    
                    {/* Text Content */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-blue-400 font-semibold">{stop.date}</div>
                        {entryCount > 0 && (
                          <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                            {entryCount} logbook {entryCount === 1 ? 'entry' : 'entries'}
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-2">{stop.title}</h2>
                      <h3 className="text-lg text-blue-300 mb-4">{stop.location}</h3>
                      <p className="text-slate-300 leading-relaxed mb-6">{stop.description}</p>
                      
                      {logbookEntry && (
                        <div className="bg-slate-800 p-4 rounded-lg mb-4">
                          <h4 className="text-sm font-semibold text-blue-300 mb-2">From Ernest&apos;s Logbook:</h4>
                          <p className="text-slate-300 text-sm italic mb-2">
                            &quot;{logbookEntry.content.substring(0, 200)}...&quot;
                          </p>
                          <div className="text-xs text-slate-400">
                            Confidence: {(logbookEntry.confidence_score * 100).toFixed(1)}% • 
                            Method: {logbookEntry.processing_method}
                          </div>
                        </div>
                      )}
                      
                      <Link 
                        href={`/logbook?month=${stop.searchMonth}&year=${stop.searchYear}`}
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Logbook Entries →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
