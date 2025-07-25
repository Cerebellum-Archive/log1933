'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const WorldRouteMap = dynamic(() => import('./WorldRouteMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-blue-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <div className="typewriter-text text-brown-800 text-xl">Loading interactive map...</div>
      </div>
    </div>
  )
})

// Types for logbook entries
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
  date_inferred?: boolean
  document_type?: string
  document_title?: string
  is_combined?: boolean

  source_entries?: string[]
  entry_count?: number
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
    cleaned_date?: string
    cleaned_entries?: number
    combined_date?: string
    original_entries?: number
    combined_entries?: number
    documents_combined?: number
  }
  entries: LogbookEntry[]
}

interface TimelineEntry {
  id: string
  date: string
  location: string
  title: string
  entries: LogbookEntry[]
}

// Helper function to break content into logical paragraphs
const formatContentForReading = (content: string): string[] => {
  // Function to clean up nonsensical OCR text
  const cleanupOCRText = (text: string): string => {
    // Remove nonsensical patterns at the beginning of text
    const nonsensicalPatterns = [
      /^GD JO AMBAT[^.]*?\.\s*/,
      /^[A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{2,}[^.]*?\.\s*/,
      /^[a-zA-Z0-9\s]{0,10}[^a-zA-Z\s][^.]*?\.\s*/,
      /^[0-9]+\s+[A-Z]{2,}\s+[A-Z]{2,}[^.]*?\.\s*/,
      /^[^\w\s]+[^.]*?\.\s*/
    ]
    
    let cleanedText = text
    
    // Check if text starts with nonsensical patterns
    for (const pattern of nonsensicalPatterns) {
      if (pattern.test(cleanedText)) {
        cleanedText = cleanedText.replace(pattern, '...\n\n')
        break
      }
    }
    
    // Also clean up any remaining nonsensical fragments within the text
    cleanedText = cleanedText.replace(/[^\w\s.,!?;:'"()\-–—]+/g, '')
    
    return cleanedText
  }

  // Clean up the content first
  const cleanedContent = cleanupOCRText(content)
  
  // Split by existing line breaks and filter out empty strings
  const paragraphs = cleanedContent.split('\n').filter(p => p.trim().length > 0)
  
  // Further break down very long paragraphs (over 500 characters)
  const formattedParagraphs: string[] = []
  
  paragraphs.forEach(paragraph => {
    if (paragraph.length > 500) {
      // Look for natural break points: periods followed by capital letters
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

// Journey Route component with professional world map
const JourneyRoute = ({ onLocationClick }: { onLocationClick?: (location: string) => void }) => {
  return (
    <div className="vintage-paper rounded-lg p-8 mb-8 shadow-2xl">
      <h2 className="text-2xl typewriter-title text-brown-800 mb-4 text-center">
        World Tour Route
      </h2>
      
      {/* Cities list above the map */}
      <div className="text-center mb-4">
        <p className="typewriter-text text-brown-700 text-lg font-bold mb-1">
          Chicago → Europe → Asia → Pacific → Los Angeles
        </p>
        <p className="typewriter-text text-brown-600 text-sm">
          <span className="font-bold">24 stops</span> • <span className="font-bold">6 continents</span> • <span className="font-bold">8 months</span>
        </p>
      </div>
      
      <div className="relative rounded-lg border-4 border-brown-400 overflow-hidden shadow-inner" style={{ height: '500px' }}>
        <WorldRouteMap onLocationClick={onLocationClick} />
      </div>
      
      <div className="mt-6 text-center">
        <p className="typewriter-text text-brown-500 text-sm">
          Interactive map showing Ernest's complete 1933 world tour route<br/>
          <span className="text-brown-400 text-xs">Click on any location to scroll to that part of the timeline</span>
        </p>
      </div>
    </div>
  )
}

function TimelineLogbookContent() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeEntry, setActiveEntry] = useState<string | null>(null)
  const [filteredEntries, setFilteredEntries] = useState<TimelineEntry[]>([])
  const [expandedNotes, setExpandedNotes] = useState<{ [key: string]: boolean }>({})
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({})
  const [notesModal, setNotesModal] = useState<{ show: boolean, entry: LogbookEntry | null, entryKey: string | null }>({ 
    show: false, 
    entry: null, 
    entryKey: null 
  })
  
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRefs = useRef<{ [key: string]: HTMLDivElement }>({})
  
  const searchParams = useSearchParams()
  const filterMonth = searchParams.get('month')
  const filterYear = searchParams.get('year')
  const locationParam = searchParams.get('location')

  useEffect(() => {
    const fetchLogbookData = async () => {
      try {
        const response = await fetch('/data/combined_logbook.json')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        setLogbookData(data)
        processTimelineEntries(data.entries)
      } catch (err) {
        console.error('Error fetching logbook data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load logbook data')
      } finally {
        setLoading(false)
      }
    }

    fetchLogbookData()
  }, [])

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle location parameter from URL
  useEffect(() => {
    if (locationParam && timelineEntries.length > 0) {
      // Add a small delay to ensure the DOM is ready
      setTimeout(() => {
        scrollToLocation(locationParam)
      }, 500)
    }
  }, [locationParam, timelineEntries])

  const processTimelineEntries = (entries: LogbookEntry[]) => {
    // Sort entries by date with better date parsing
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = a.date_entry || '1933-01-01'
      const dateB = b.date_entry || '1933-01-01'
      
      // Convert dates to Date objects for proper chronological sorting
      const parseDateStr = (dateStr: string): Date => {
        try {
          // Try parsing as-is first
          let date = new Date(dateStr)
          if (!isNaN(date.getTime())) {
            return date
          }
          
          // Handle formats like "April 27th, 1933"
          const monthDayYearMatch = dateStr.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?,?\s+(\d{4})/)
          if (monthDayYearMatch) {
            const [, month, day, year] = monthDayYearMatch
            date = new Date(`${month} ${day}, ${year}`)
            if (!isNaN(date.getTime())) {
              return date
            }
          }
          
          // Handle formats like "1933-06"
          if (dateStr.match(/^\d{4}-\d{2}$/)) {
            date = new Date(dateStr + '-01')
            if (!isNaN(date.getTime())) {
              return date
            }
          }
          
          // Fallback to 1933-01-01
          return new Date('1933-01-01')
        } catch {
          return new Date('1933-01-01')
        }
      }
      
      const dateAObj = parseDateStr(dateA)
      const dateBObj = parseDateStr(dateB)
      
      return dateAObj.getTime() - dateBObj.getTime()
    })

    // Group entries by location only
    const groupedEntries: { [key: string]: LogbookEntry[] } = {}
    
    sortedEntries.forEach(entry => {
      const location = entry.location || 'Unknown Location'
      
      if (!groupedEntries[location]) {
        groupedEntries[location] = []
      }
      groupedEntries[location].push(entry)
    })

    // Create timeline entries - one per location
    const timeline: TimelineEntry[] = Object.keys(groupedEntries).map(location => {
      const entries = groupedEntries[location]
      // Use the earliest date for this location
      const earliestDate = entries[0]?.date_entry || '1933-01-01'
      
      return {
        id: location,
        date: earliestDate,
        location,
        title: formatTimelineTitle(earliestDate, location),
        entries
      }
    })

    // Sort timeline by date for proper chronological order
    timeline.sort((a, b) => {
      const parseDateStr = (dateStr: string): Date => {
        try {
          // Try parsing as-is first
          let date = new Date(dateStr)
          if (!isNaN(date.getTime())) {
            return date
          }
          
          // Handle formats like "April 27th, 1933"
          const monthDayYearMatch = dateStr.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?,?\s+(\d{4})/)
          if (monthDayYearMatch) {
            const [, month, day, year] = monthDayYearMatch
            date = new Date(`${month} ${day}, ${year}`)
            if (!isNaN(date.getTime())) {
              return date
            }
          }
          
          // Handle formats like "1933-06"
          if (dateStr.match(/^\d{4}-\d{2}$/)) {
            date = new Date(dateStr + '-01')
            if (!isNaN(date.getTime())) {
              return date
            }
          }
          
          // Fallback to 1933-01-01
          return new Date('1933-01-01')
        } catch {
          return new Date('1933-01-01')
        }
      }
      
      const dateAObj = parseDateStr(a.date)
      const dateBObj = parseDateStr(b.date)
      
      return dateAObj.getTime() - dateBObj.getTime()
    })

    setTimelineEntries(timeline)
    setFilteredEntries(timeline)
  }

  const formatTimelineTitle = (date: string, location: string) => {
    const formattedDate = formatDate(date)
    return `${formattedDate} • ${location}`
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === 'Invalid Date') return '1933'
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return '1933'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return '1933'
    }
  }

  const DateIndicator = ({ dateStr, isInferred }: { dateStr?: string, isInferred?: boolean }) => {
    const formattedDate = formatDate(dateStr)
    
    // Don't render anything if the date is invalid or just '1933'
    if (!formattedDate || formattedDate === '1933' || formattedDate === 'Invalid Date') {
      return null
    }
    
    return (
      <div className="flex items-center gap-1">
        <span className="font-medium text-xs typewriter-text text-brown-500">{formattedDate}</span>
      </div>
    )
  }

  const DocumentTypeIcon = ({ type }: { type?: string }) => {
    const getIcon = () => {
      switch (type) {
        case 'letter': return '✉️'
        case 'telegram': return '📞'
        case 'report': return '📊'
        case 'list': return '📋'
        case 'narrative': return '📖'
        default: return '📄'
      }
    }

    return (
      <div className="flex items-center gap-1">
        <span title={`${type || 'document'}`}>
          {getIcon()}
        </span>
      </div>
    )
  }

  const getMonthYear = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      })
    } catch {
      return 'Unknown'
    }
  }

  const normalizeLocationName = (location: string) => {
    // Split by comma and take first part, then normalize
    const primaryLocation = location.split(',')[0].trim()
    
    // Handle special cases where first word alone isn't descriptive enough
    const locationMappings: { [key: string]: string } = {
      'New': 'New York',
      'San': 'San Francisco', 
      'Los': 'Los Angeles',
      'Las': 'Las Palmas',
      'Port': 'Port Said',
      'Santa': 'Santa Monica',
      'Saint': 'Saint Paul',
      'Fez': 'French Morocco',
      'Casa-Blanca': 'Casa-Blanca, Morocco',
      '218': 'London Office',
      'Donington': 'London Office',
      'Norfolk': 'London Office',
      'Stafford': 'London Office',
      'Chapel': 'Hong Kong',
      'Imperial': 'Tokyo',
      'Grand': 'Vienna',
      'between': 'Between Vienna and Venice',
      'One': 'Port Said',
      'En': 'Colombo',
      'aboard': 'Atlantic Ocean Crossing',
      'Swiss': 'Switzerland',
      'Harz': 'Germany'
    }
    
    const firstWord = primaryLocation.split(' ')[0]
    
    // If first word has a known mapping, use it
    if (locationMappings[firstWord]) {
      return locationMappings[firstWord]
    }
    
    // For most locations, first word is sufficient (London, Paris, Berlin, etc.)
    return firstWord
  }

  const scrollToEntry = (entryId: string) => {
    const element = timelineRefs.current[entryId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveEntry(entryId)
    }
  }

  const scrollToLocation = (locationName: string) => {
    console.log(`Attempting to scroll to: ${locationName}`)
    console.log('Available locations:', timelineEntries.map(entry => entry.location))
    
    // Create flexible matching patterns for map pins to timeline entries
    const locationPatterns: { [key: string]: string[] } = {
      'Chicago': ['Chicago'],
      'Atlantic Ocean': ['aboard the motor-ship Georgic', 'Atlantic Ocean', 'mid-ocean'],
      'Southampton': ['Southampton'],
      'London': ['London', 'Norfolk House', 'Donington House', 'Melbourne House', 'Stafford House'],
      'Liverpool': ['Liverpool'],
      'Paris': ['Paris', 'Blvd. Raspail'],
      'Brussels': ['Brussels', 'Belgium'],
      'Antwerp': ['Antwerp', 'Rue du Verger', 'Berchem'],
      'Berlin': ['Berlin'],
      'Vienna': ['Vienna', 'Grand Hotel'],
      'Switzerland': ['Swiss Federal Parliament'],
      'Italy': ['Milan', 'Venice', 'Naples'],
      'Lisbon': ['Lisbon'],
      'Morocco': ['Morocco', 'Fez', 'Casa-Blanca', 'Algeciras'],
      'Suez Canal': ['Port Said'],
      'Ceylon': ['Ceylon', 'Colombo'],
      'Singapore': ['Singapore', 'Straits Settlements'],
      'Malay States': ['Singapore', 'Penang'],
      'Shanghai': ['Shanghai', 'China', 'Chapel Exchange', 'Nantao Exchange'],
      'Beijing': ['Pekin', 'Peking', 'Nanking', 'Tientsin'],
      'Manchuria': ['Manchukuo', 'Antung'],
      'Japan': ['Japan', 'Tokyo', 'Imperial Hotel', 'Yokohama'],
      'San Francisco': ['San Francisco', 'Mills College'],
      'Los Angeles': ['California']
    }
    
    const patterns = locationPatterns[locationName] || [locationName]
    
    // Find the timeline entry that matches any of the patterns
    const matchingEntry = timelineEntries.find(entry => {
      const entryLocation = entry.location?.toLowerCase() || ''
      
      return patterns.some(pattern => {
        const patternLower = pattern.toLowerCase()
        return entryLocation.includes(patternLower)
      })
    })
    
    if (matchingEntry) {
      console.log(`✓ Found match: ${locationName} -> ${matchingEntry.location}`)
      scrollToEntry(matchingEntry.id)
    } else {
      console.log(`✗ No match found for: ${locationName}`)
      console.log(`Searched patterns:`, patterns)
      
      // Fallback: try a very loose match on just the first word
      const fallbackEntry = timelineEntries.find(entry => {
        const entryLocation = entry.location?.toLowerCase() || ''
        const firstWord = locationName.toLowerCase().split(' ')[0]
        return entryLocation.includes(firstWord)
      })
      
      if (fallbackEntry) {
        console.log(`✓ Fallback match: ${locationName} -> ${fallbackEntry.location}`)
        scrollToEntry(fallbackEntry.id)
      }
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleNotes = (entryKey: string, entry: LogbookEntry) => {
    setNotesModal({
      show: true,
      entry: entry,
      entryKey: entryKey
    })
  }

  const closeNotesModal = () => {
    setNotesModal({ show: false, entry: null, entryKey: null })
  }

  // Copy functions
  const copyTextToClipboard = async (text: string, entryKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus(prev => ({ ...prev, [`text-${entryKey}`]: 'copied' }))
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [`text-${entryKey}`]: '' }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      setCopyStatus(prev => ({ ...prev, [`text-${entryKey}`]: 'error' }))
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [`text-${entryKey}`]: '' }))
      }, 2000)
    }
  }

  const copyImageToClipboard = async (filename: string, entryKey: string) => {
    try {
      // First, try to copy the actual image as a blob
      const imagePath = `/images/logbook/${filename}`
      
      try {
        const response = await fetch(imagePath)
        if (response.ok) {
          const blob = await response.blob()
          const item = new ClipboardItem({ [blob.type]: blob })
          await navigator.clipboard.write([item])
          setCopyStatus(prev => ({ ...prev, [`image-${entryKey}`]: 'copied' }))
        } else {
          throw new Error('Image not found')
        }
      } catch (imageError) {
        // Fallback: copy image reference and filename as text
        const imageInfo = `Logbook Image: ${filename}\nSource: ${imagePath}\nDate: ${new Date().toISOString()}`
        await navigator.clipboard.writeText(imageInfo)
        setCopyStatus(prev => ({ ...prev, [`image-${entryKey}`]: 'copied' }))
      }
      
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [`image-${entryKey}`]: '' }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy image: ', err)
      setCopyStatus(prev => ({ ...prev, [`image-${entryKey}`]: 'error' }))
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [`image-${entryKey}`]: '' }))
      }, 2000)
    }
  }

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEntries(timelineEntries)
      return
    }

    const filtered = timelineEntries.filter(timelineEntry =>
      timelineEntry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timelineEntry.entries.some(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    setFilteredEntries(filtered)
  }, [searchTerm, timelineEntries])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="vintage-paper p-8 rounded-lg shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="typewriter-text text-brown-800">Loading vintage timeline...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="vintage-paper p-8 rounded-lg shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl typewriter-title text-brown-800 mb-4">Unable to Load Timeline</h2>
          <p className="typewriter-text text-brown-600 mb-4">Error: {error}</p>
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
          line-height: 1.4;
          letter-spacing: 0.3px;
          color: #2c1810;
          font-size: 14px;
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
        
        .search-vintage {
          background: rgba(244,241,232,0.8);
          border: 2px solid #8B4513;
          border-radius: 4px;
          padding: 8px 12px;
          font-family: 'Courier Prime', monospace;
          color: #2c1810;
          font-size: 12px;
        }
        
        .search-vintage:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(139,69,19,0.2);
        }
        
        .sidebar-button {
          background: rgba(244,241,232,0.3);
          border: 1px solid rgba(139,69,19,0.1);
          color: #2c1810;
          font-family: 'Courier Prime', monospace;
          transition: all 0.2s ease;
          font-size: 9px;
          line-height: 1.1;
        }
        
        .sidebar-button:hover {
          background: rgba(139,69,19,0.1);
          border-color: rgba(139,69,19,0.3);
        }
        
        .sidebar-button.active {
          background: rgba(139,69,19,0.2);
          border-color: rgba(139,69,19,0.5);
          color: #2c1810;
        }
        
        .copy-button {
          position: relative;
          transition: all 0.2s ease;
          background: rgba(244,241,232,0.6);
          border: 1px solid rgba(139,69,19,0.3);
        }
        
        .copy-button:hover {
          background: rgba(139,69,19,0.1);
          border-color: rgba(139,69,19,0.5);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(139,69,19,0.2);
        }
        
        .copy-button.copied {
          background: rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.5);
        }
        
        .copy-button.error {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.5);
        }
      `}</style>
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-100 to-yellow-100 border-b-2 border-brown-400">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link 
                href="/"
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text"
              >
                ← Back to Home
              </Link>
            </div>
            
            <h1 className="text-2xl md:text-3xl typewriter-title text-brown-800">
              Ernest's 1933 World Tour Timeline
            </h1>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/journey" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 border-b-2 border-transparent hover:border-brown-400"
              >
                Highlights
              </Link>
              <Link 
                href="/logbook/timeline" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 border-b-2 border-brown-600"
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
              <span className="text-brown-600 typewriter-text text-sm font-semibold">Timeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Route */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-6">
        <JourneyRoute onLocationClick={scrollToLocation} />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row px-4 md:px-8">
        {/* Timeline Sidebar */}
        <div className="w-full lg:w-80 lg:pr-6 mb-8 lg:mb-0 lg:h-screen lg:sticky lg:top-24 lg:overflow-y-auto">
          <div className="vintage-paper p-4 rounded-lg shadow-lg">
            <h2 className="text-sm typewriter-title text-brown-800 mb-2 text-center">Journey Timeline</h2>
            
            {/* Search Bar - Compact */}
            <div className="mb-3 space-y-2">
              <input
                type="text"
                placeholder="Search timeline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-vintage w-full text-sm"
              />
              
              {logbookData && (
                <div className="typewriter-text text-brown-600 text-xs text-center">
                  {filteredEntries.length} entries
                </div>
              )}
            </div>
            
            {filteredEntries.length === 0 ? (
              <div className="text-center text-brown-600 py-8">
                <div className="text-4xl mb-4">📖</div>
                <p className="typewriter-text">No entries found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredEntries.map((timelineEntry, index) => {
                  const isActive = activeEntry === timelineEntry.id
                  const prevEntry = index > 0 ? filteredEntries[index - 1] : null
                  const showMonthDivider = !prevEntry || 
                    getMonthYear(timelineEntry.date) !== getMonthYear(prevEntry.date)
                  
                  return (
                    <div key={timelineEntry.id}>
                      {showMonthDivider && (
                        <div className="py-1 mb-1 border-b border-brown-300">
                          <div className="typewriter-title text-brown-800 font-bold text-xs">
                            {getMonthYear(timelineEntry.date)}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => scrollToEntry(timelineEntry.id)}
                        className={`w-full text-left px-2 py-1 rounded transition-all sidebar-button ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="typewriter-text text-brown-800 font-medium text-xs truncate leading-tight">
                              {normalizeLocationName(timelineEntry.location)}
                            </div>
                            <DateIndicator 
                              dateStr={timelineEntry.date} 
                              isInferred={timelineEntry.entries[0]?.date_inferred}
                            />
                          </div>
                          <div className="typewriter-text text-brown-400 text-xs font-light opacity-75">
                            {timelineEntry.entries.length}
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Much Wider */}
        <div className="flex-1 py-4 lg:py-8 overflow-y-auto" ref={contentRef}>
          {filteredEntries.length === 0 ? (
            <div className="vintage-paper p-12 rounded-lg shadow-2xl text-center">
              <div className="text-6xl mb-6">📖</div>
              <h3 className="text-6xl typewriter-title text-brown-800 mb-6">No Entries Found</h3>
              <p className="typewriter-text text-brown-600">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredEntries.map((timelineEntry) => (
                <div
                  key={timelineEntry.id}
                  ref={el => {
                    if (el) timelineRefs.current[timelineEntry.id] = el
                  }}
                  className="scroll-mt-20"
                >
                  <div className="vintage-paper p-8 px-12 rounded-lg shadow-2xl">
                    {/* Desktop Layout: Full Width */}
                    <div className="hidden md:block">
                                             {/* Content - Full Width */}
                       <div className="w-full">
                         {/* Location Header */}
                         <div className="mb-4 border-b-2 border-brown-400 pb-2">
                           <h2 className="typewriter-title text-brown-800 text-lg font-bold">{timelineEntry.location}</h2>
                           {(() => {
                             const dates = Array.from(new Set(timelineEntry.entries.map(e => e.date_entry).filter(Boolean))).sort()
                             if (dates.length > 1) {
                               return (
                                 <div className="mt-2 flex items-center gap-4">
                                   <span className="typewriter-text text-brown-600 text-sm">
                                     {formatDate(dates[0])} to {formatDate(dates[dates.length - 1])}
                                   </span>
                                   <span className="typewriter-text text-brown-500 text-sm">
                                     • {timelineEntry.entries.length} documents
                                   </span>
                                 </div>
                               )
                             } else {
                               return (
                                 <div className="mt-2 flex items-center gap-4">
                                   <DateIndicator 
                                     dateStr={timelineEntry.date} 
                                     isInferred={timelineEntry.entries[0]?.date_inferred}
                                   />
                                   <span className="typewriter-text text-brown-500 text-sm">
                                     • {timelineEntry.entries.length} documents
                                   </span>
                                 </div>
                               )
                             }
                           })()}
                         </div>
                         
                         <div className="space-y-8">
                           {timelineEntry.entries.map((entry, entryIndex) => (
                             <div key={entry.filename} className="border-b border-brown-200 pb-6 last:border-b-0">
                                                             {/* Entry Header - Title and Date on Same Line */}
                               <div className="mb-8">
                                 <div className="flex items-center justify-between mb-3">
                                   <div className="flex items-center gap-4">
                                     <DocumentTypeIcon 
                                       type={entry.document_type}
                                     />
                                     <h3 className="typewriter-title text-brown-800 font-bold text-sm">
                                       {entry.document_title || `Document ${entryIndex + 1}`}
                                     </h3>
                                   </div>
                                   <div className="flex items-center gap-4">
                                     {entry.date_entry && (
                                       <span className="typewriter-text text-brown-500 text-sm">
                                         {formatDate(entry.date_entry)}
                                       </span>
                                     )}
                                     
                                     {/* Copy Icons and Notes */}
                                     <div className="flex items-center gap-2">
                                       {/* Copy Text Button */}
                                       <button
                                         onClick={() => copyTextToClipboard(entry.content, `${timelineEntry.id}-${entryIndex}`)}
                                         className={`copy-button group relative p-2 rounded-lg transition-colors ${
                                           copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'copied' ? 'copied' :
                                           copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'error' ? 'error' : ''
                                         }`}
                                         title="Copy text to clipboard"
                                       >
                                         {copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'copied' ? (
                                           <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                           </svg>
                                         ) : copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'error' ? (
                                           <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                           </svg>
                                         ) : (
                                           <svg className="w-5 h-5 text-brown-600 group-hover:text-brown-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                           </svg>
                                         )}
                                       </button>
                                       
                                       {/* Copy Image Button */}
                                       <button
                                         onClick={() => copyImageToClipboard(entry.filename, `${timelineEntry.id}-${entryIndex}`)}
                                         className={`copy-button group relative p-2 rounded-lg transition-colors ${
                                           copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'copied' ? 'copied' :
                                           copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'error' ? 'error' : ''
                                         }`}
                                         title="Copy image reference to clipboard"
                                       >
                                         {copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'copied' ? (
                                           <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                           </svg>
                                         ) : copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'error' ? (
                                           <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                           </svg>
                                         ) : (
                                           <svg className="w-5 h-5 text-brown-600 group-hover:text-brown-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                           </svg>
                                         )}
                                       </button>
                                       
                                       {/* Notes Button */}
                                       <button
                                         onClick={() => toggleNotes(`${timelineEntry.id}-${entryIndex}`, entry)}
                                         className="copy-button group relative p-2 rounded-lg transition-colors"
                                         title="Toggle notes"
                                       >
                                         <span className="text-brown-600 group-hover:text-brown-800 text-sm">
                                           📋
                                         </span>
                                       </button>
                                     </div>
                                   </div>
                                 </div>
                               </div>

                                                             {/* Entry Content - Formatted in readable paragraphs with better spacing */}
                               <div className="space-y-3">
                                 {formatContentForReading(entry.content).map((paragraph, paragraphIndex) => (
                                   <p key={paragraphIndex} className="typewriter-text text-brown-800 text-lg" style={{
                                     textIndent: paragraph.startsWith('...') ? '0' : '2rem',
                                     textAlign: 'justify',
                                     lineHeight: '1.6'
                                   }}>
                                     {paragraph}
                                   </p>
                                 ))}
                               </div>



                               </div>
                          ))}
                        </div>
                      </div>
                    </div>

                                        {/* Mobile Layout: Stacked */}
                    <div className="md:hidden">
                      {/* Location Header */}
                      <div className="mb-4 border-b-2 border-brown-400 pb-2">
                        <h2 className="typewriter-title text-brown-800 text-lg font-bold">{timelineEntry.location}</h2>
                        {(() => {
                          const dates = Array.from(new Set(timelineEntry.entries.map(e => e.date_entry).filter(Boolean))).sort()
                          if (dates.length > 1) {
                            return (
                              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <span className="typewriter-text text-brown-600 text-lg">
                                  {formatDate(dates[0])} to {formatDate(dates[dates.length - 1])}
                                </span>
                                <span className="typewriter-text text-brown-500 text-base mt-1 sm:mt-0">
                                  • {timelineEntry.entries.length} documents
                                </span>
                              </div>
                            )
                          } else {
                            return (
                              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <DateIndicator 
                                  dateStr={timelineEntry.date} 
                                  isInferred={timelineEntry.entries[0]?.date_inferred}
                                />
                                <span className="typewriter-text text-brown-500 text-base mt-1 sm:mt-0">
                                  • {timelineEntry.entries.length} documents
                                </span>
                              </div>
                            )
                          }
                        })()}
                      </div>

                      <div className="space-y-6">
                        {timelineEntry.entries.map((entry, entryIndex) => (
                          <div key={entry.filename} className="border-b border-brown-200 pb-4 last:border-b-0">
                            {/* Mobile Entry Header - Title and Date on Same Line */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <DocumentTypeIcon 
                                    type={entry.document_type}
                                  />
                                  <h3 className="typewriter-title text-brown-800 font-bold text-sm">
                                    {entry.document_title || `Document ${entryIndex + 1}`}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  {entry.date_entry && (
                                    <span className="typewriter-text text-brown-500 text-lg">
                                      {formatDate(entry.date_entry)}
                                    </span>
                                  )}
                                  
                                  {/* Copy Icons and Notes - Mobile */}
                                  <div className="flex items-center gap-1">
                                    {/* Copy Text Button */}
                                    <button
                                      onClick={() => copyTextToClipboard(entry.content, `${timelineEntry.id}-${entryIndex}`)}
                                      className={`copy-button group relative p-1.5 rounded-lg transition-colors ${
                                        copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'copied' ? 'copied' :
                                        copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'error' ? 'error' : ''
                                      }`}
                                      title="Copy text to clipboard"
                                    >
                                      {copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'copied' ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : copyStatus[`text-${timelineEntry.id}-${entryIndex}`] === 'error' ? (
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-brown-600 group-hover:text-brown-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                      )}
                                    </button>
                                    
                                    {/* Copy Image Button */}
                                    <button
                                      onClick={() => copyImageToClipboard(entry.filename, `${timelineEntry.id}-${entryIndex}`)}
                                      className={`copy-button group relative p-1.5 rounded-lg transition-colors ${
                                        copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'copied' ? 'copied' :
                                        copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'error' ? 'error' : ''
                                      }`}
                                      title="Copy image reference to clipboard"
                                    >
                                      {copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'copied' ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : copyStatus[`image-${timelineEntry.id}-${entryIndex}`] === 'error' ? (
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-brown-600 group-hover:text-brown-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                    </button>
                                    
                                    {/* Notes Button - Mobile */}
                                    <button
                                      onClick={() => toggleNotes(`${timelineEntry.id}-${entryIndex}`, entry)}
                                      className="copy-button group relative p-1.5 rounded-lg transition-colors"
                                      title="Toggle notes"
                                    >
                                      <span className="text-brown-600 group-hover:text-brown-800 text-xs">
                                        📋
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {formatContentForReading(entry.content).map((paragraph, paragraphIndex) => (
                                <p key={paragraphIndex} className="typewriter-text text-brown-800 text-lg" style={{
                                  textIndent: paragraph.startsWith('...') ? '0' : '2rem',
                                  textAlign: 'justify',
                                  lineHeight: '1.6'
                                }}>
                                  {paragraph}
                                </p>
                              ))}
                            </div>


                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      {logbookData && (
        <footer className="vintage-paper border-t-2 border-brown-400 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-3xl font-bold typewriter-title text-brown-800">
                  {logbookData.metadata.original_entries || logbookData.metadata.total_entries}
                </div>
                <div className="typewriter-text text-brown-600 text-xs">Original Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold typewriter-title text-brown-800">
                  {logbookData.metadata.combined_entries || logbookData.metadata.total_entries}
                </div>
                <div className="typewriter-text text-brown-600 text-xs">Combined Documents</div>
              </div>
              <div>
                <div className="text-3xl font-bold typewriter-title text-brown-800">
                  {logbookData.metadata.documents_combined || 0}
                </div>
                <div className="typewriter-text text-brown-600 text-xs">Multi-page Documents</div>
              </div>
              <div>
                <div className="text-3xl font-bold typewriter-title text-brown-800">
                  {Math.round(logbookData.metadata.average_confidence * 100)}%
                </div>
                <div className="typewriter-text text-brown-600 text-xs">Average Confidence</div>
              </div>
              <div>
                <div className="text-3xl font-bold typewriter-title text-brown-800">
                  1933
                </div>
                <div className="typewriter-text text-brown-600 text-xs">Vintage Year</div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Notes Modal */}
      {notesModal.show && notesModal.entry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="vintage-paper max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <h3 className="typewriter-title text-brown-800 font-bold text-xl">
                    Document Notes
                  </h3>
                </div>
                <button 
                  onClick={closeNotesModal}
                  className="text-brown-600 hover:text-brown-800 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                {notesModal.entry.is_combined ? (
                  <div className="space-y-3">
                    <div className="typewriter-text text-brown-700 text-sm">
                      <strong>Combined from:</strong> {notesModal.entry.source_entries?.join(', ')}
                    </div>
                    <div className="typewriter-text text-brown-700 text-sm">
                      <strong>Original pages:</strong> {notesModal.entry.entry_count}
                    </div>
                  </div>
                ) : (
                  <div className="typewriter-text text-brown-700 text-sm">
                    <strong>Source:</strong> {notesModal.entry.filename}
                  </div>
                )}
                
                <div className="border-t border-brown-200 pt-4 space-y-2">
                  <div className="typewriter-text text-brown-600 text-sm">
                    <strong>Confidence:</strong> {Math.round(notesModal.entry.confidence_score * 100)}%
                  </div>
                  <div className="typewriter-text text-brown-600 text-sm">
                    <strong>Processing method:</strong> {notesModal.entry.processing_method}
                  </div>
                  <div className="typewriter-text text-brown-600 text-sm">
                    <strong>Page:</strong> {notesModal.entry.page_number}
                  </div>
                </div>

                {/* Close Button */}
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={closeNotesModal}
                    className="bg-brown-600 hover:bg-brown-700 text-white px-4 py-2 rounded-lg transition-colors typewriter-text text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-brown-600 hover:bg-brown-700 text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <span className="text-xl md:text-2xl">↑</span>
        </button>
      )}
    </div>
  )
}

export default function TimelineLogbookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="vintage-paper p-8 rounded-lg shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="typewriter-text text-brown-800">Loading vintage timeline...</p>
        </div>
      </div>
    }>
      <TimelineLogbookContent />
    </Suspense>
  )
}