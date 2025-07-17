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

export default function JourneyPage() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogbookData = async () => {
      try {
        const response = await fetch('/data/complete_logbook.json')
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

  // Helper function to parse dates and find matching entries
  const findEntriesForMonth = (targetMonth: string, targetYear: string = "1933") => {
    if (!logbookData) return []
    
    return logbookData.entries.filter(entry => {
      if (!entry.date_entry) return false
      
      const dateStr = entry.date_entry.toLowerCase()
      const monthStr = targetMonth.toLowerCase()
      
      return (dateStr.includes(monthStr) && dateStr.includes(targetYear)) ||
             (dateStr.includes(`${targetYear}-${getMonthNumber(targetMonth)}`))
    })
  }

  const getMonthNumber = (monthName: string): string => {
    const months: { [key: string]: string } = {
      'january': '01', 'february': '02', 'march': '03', 'april': '04',
      'may': '05', 'june': '06', 'july': '07', 'august': '08',
      'september': '09', 'october': '10', 'november': '11', 'december': '12'
    }
    return months[monthName.toLowerCase()] || '00'
  }

  const getImagePath = (locationId: string): string => {
    return `/images/journey/${locationId}.jpg`
  }

  const timelineEvents = [
    {
      id: "departure",
      date: "January 1933",
      month: "january",
      location: "San Francisco, California",
      description: "Ernest K. Gann begins his ambitious world tour, setting off from the bustling San Francisco waterfront with dreams of adventure and discovery.",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: "hawaii",
      date: "January 1933",
      month: "january", 
      location: "Honolulu, Hawaii",
      description: "First stop in the vast Pacific, experiencing the tropical paradise and unique culture of the Hawaiian Islands.",
      coordinates: { lat: 21.3099, lng: -157.8581 }
    },
    {
      id: "japan",
      date: "February 1933",
      month: "february",
      location: "Tokyo, Japan",
      description: "Exploring the fascinating blend of ancient traditions and modern innovation in the Land of the Rising Sun.",
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    {
      id: "china",
      date: "March 1933",
      month: "march",
      location: "Shanghai, China",
      description: "Witnessing the bustling international hub of Shanghai, where East meets West in a vibrant cultural exchange.",
      coordinates: { lat: 31.2304, lng: 121.4737 }
    },
    {
      id: "philippines",
      date: "April 1933",
      month: "april",
      location: "Manila, Philippines",
      description: "Island adventures in the tropical Philippines, experiencing the rich cultural heritage and natural beauty.",
      coordinates: { lat: 14.5995, lng: 120.9842 }
    },
    {
      id: "singapore",
      date: "May 1933",
      month: "may",
      location: "Singapore",
      description: "Gateway to Southeast Asia, experiencing the multicultural melting pot of this strategic port city.",
      coordinates: { lat: 1.3521, lng: 103.8198 }
    },
    {
      id: "india",
      date: "June 1933",
      month: "june",
      location: "Calcutta, India",
      description: "Immersing in the rich tapestry of Indian culture, from ancient traditions to the grandeur of the British Raj.",
      coordinates: { lat: 22.5726, lng: 88.3639 }
    },
    {
      id: "middle_east",
      date: "July 1933",
      month: "july",
      location: "Baghdad, Iraq",
      description: "Journey through ancient Mesopotamia, where civilization began and history echoes through every street.",
      coordinates: { lat: 33.3152, lng: 44.3661 }
    },
    {
      id: "egypt",
      date: "August 1933",
      month: "august",
      location: "Cairo, Egypt",
      description: "Standing in awe before the ancient pyramids and experiencing the timeless majesty of Egyptian civilization.",
      coordinates: { lat: 30.0444, lng: 31.2357 }
    },
    {
      id: "africa",
      date: "September 1933",
      month: "september",
      location: "Nairobi, Kenya",
      description: "Safari adventures in East Africa, witnessing the incredible wildlife and vast landscapes of the continent.",
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    {
      id: "europe",
      date: "October 1933",
      month: "october",
      location: "London, England",
      description: "Experiencing the heart of the British Empire, from foggy London streets to the corridors of power.",
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    {
      id: "return",
      date: "November 1933",
      month: "november",
      location: "New York, USA",
      description: "The triumphant return to America, completing an extraordinary journey around the world with countless stories to tell.",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  ]

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
          
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The 1933 Journey
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Follow Ernest K. Gann&apos;s extraordinary world tour through twelve remarkable destinations, 
              spanning four continents and countless adventures.
            </p>
            {!loading && logbookData && (
              <div className="mt-6 text-blue-300">
                <span className="bg-blue-900/30 px-4 py-2 rounded-full">
                  {logbookData.metadata.total_entries} digitized logbook pages documenting this incredible journey
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const entriesForMonth = findEntriesForMonth(event.month)
              const isEven = index % 2 === 0
              
              return (
                <div key={event.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                  {/* Image */}
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <img
                        src={getImagePath(event.id)}
                        alt={`${event.location} in ${event.date}`}
                        className="w-full h-64 object-cover rounded-xl shadow-2xl transform transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/placeholder-journey.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm font-medium opacity-90">{event.date}</div>
                        <div className="text-lg font-bold">{event.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 space-y-6">
                    <div className="space-y-2">
                      <div className="text-blue-300 font-semibold text-lg">{event.date}</div>
                      <h2 className="text-3xl font-bold text-white">{event.location}</h2>
                    </div>
                    
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {event.description}
                    </p>

                    {/* Logbook entries for this month */}
                    {entriesForMonth.length > 0 && (
                      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            Logbook Entries ({entriesForMonth.length})
                          </h3>
                          <Link 
                            href={`/logbook?month=${event.month}`}
                            className="text-blue-300 hover:text-white transition-colors text-sm font-medium"
                          >
                            View All →
                          </Link>
                        </div>
                        <div className="space-y-3">
                          {entriesForMonth.slice(0, 2).map((entry, i) => (
                            <div key={i} className="text-slate-300 text-sm">
                              <div className="font-medium text-blue-300">{entry.date_entry}</div>
                              <div className="mt-1 line-clamp-2">
                                {entry.content.substring(0, 150)}...
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link 
                      href={`/logbook?location=${encodeURIComponent(event.location)}`}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      View Logbook Entries
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer with AI Generated Disclaimer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-slate-400 text-sm">
            <p className="mb-2">
              <sup>*</sup> Location images are AI-generated historical reconstructions based on 1933 period references
            </p>
            <p>
              Created to illustrate Ernest K. Gann&apos;s journey as documented in his original logbook
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
