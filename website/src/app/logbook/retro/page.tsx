'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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

function RetroLogbookContent() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [filteredEntries, setFilteredEntries] = useState<LogbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [entriesPerPage] = useState(1) // Show one entry per page for authentic book feel
  
  const searchParams = useSearchParams()
  const filterMonth = searchParams.get('month')
  const filterYear = searchParams.get('year')

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

  useEffect(() => {
    if (!logbookData) return

    let entries = [...logbookData.entries]

    // Apply month/year filter if coming from journey page
    if (filterMonth && filterYear) {
      entries = entries.filter(entry => {
        if (!entry.date_entry) return false
        
        const dateStr = entry.date_entry.toLowerCase()
        
        // Format: "1933-01-28" (ISO format)
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [entryYear, entryMonth] = dateStr.split('-')
          return entryYear === filterYear && entryMonth === filterMonth
        }
        
        // Format: "8th February, 1933" (verbose format)
        if (dateStr.includes(filterYear)) {
          const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
          ]
          const monthIndex = monthNames.findIndex(name => dateStr.includes(name))
          if (monthIndex !== -1) {
            const expectedMonth = String(monthIndex + 1).padStart(2, '0')
            return expectedMonth === filterMonth
          }
        }
        
        return false
      })
    }

    // Apply search filter
    if (searchTerm) {
      entries = entries.filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.date_entry?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by date
    entries.sort((a, b) => {
      const aDate = a.date_entry || ''
      const bDate = b.date_entry || ''
      return aDate.localeCompare(bDate)
    })

    setFilteredEntries(entries)
    setCurrentPage(0)
  }, [logbookData, searchTerm, filterMonth, filterYear])

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Date not specified'
    
    // If it's already in a readable format, return as is
    if (dateStr.includes(',')) return dateStr
    
    // If it's in ISO format, convert to readable format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return dateStr
  }

  const getCurrentEntry = () => {
    return filteredEntries[currentPage] || null
  }

  const nextPage = () => {
    if (currentPage < filteredEntries.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNum: number) => {
    if (pageNum >= 0 && pageNum < filteredEntries.length) {
      setCurrentPage(pageNum)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-paper flex items-center justify-center">
        <div className="vintage-paper p-8 rounded-lg shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="typewriter-text text-brown-800">Loading vintage logbook...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-vintage-paper flex items-center justify-center">
        <div className="vintage-paper p-8 rounded-lg shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="typewriter-title text-2xl font-bold text-brown-800 mb-4">Unable to Load Logbook</h2>
          <p className="typewriter-text text-brown-600 mb-4">Error: {error}</p>
        </div>
      </div>
    )
  }

  const currentEntry = getCurrentEntry()
  const totalPages = filteredEntries.length

  return (
    <div className="bg-vintage-paper min-h-screen p-4">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="vintage-paper torn-edges p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors typewriter-text"
              >
                <span className="mr-2">←</span>
                Home
              </Link>
              <Link 
                href="/logbook/timeline"
                className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors typewriter-text"
              >
                Timeline View
              </Link>
              <Link 
                href="/journey"
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text"
              >
                Journey Highlights
              </Link>
              <Link 
                href="/about"
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text"
              >
                About Ernest
              </Link>
            </div>
            
            <Link 
              href="/logbook/timeline"
              className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors typewriter-text bg-brown-100 px-3 py-1 rounded border border-brown-300"
            >
              <span className="mr-2">🗓️</span>
              Timeline View
            </Link>
          </div>
        </div>
        
        <h1 className="typewriter-title text-4xl md:text-6xl text-center mb-4">
          Ernest K. Gann's
        </h1>
        <h2 className="typewriter-title text-2xl md:text-3xl text-center mb-6">
          1933 World Tour Logbook
        </h2>
        
        <div className="text-center">
          <input
            type="text"
            placeholder="Search the logbook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-vintage max-w-md w-full"
          />
        </div>
      </div>
      
      {/* Main Content */}
      {currentEntry ? (
        <div className="vintage-paper torn-edges p-8 shadow-2xl mb-6 min-h-[600px] relative">
          {/* Page Header */}
          <div className="border-b-2 border-brown-400 pb-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="typewriter-text text-brown-800">
                <div className="text-lg font-bold">
                  {formatDate(currentEntry.date_entry)}
                </div>
                {currentEntry.location && (
                  <div className="text-sm text-brown-600">
                    📍 {currentEntry.location}
                  </div>
                )}
              </div>
              <div className="page-indicator">
                Page {currentPage + 1} of {totalPages}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="typewriter-text text-brown-800 leading-relaxed">
            {currentEntry.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Footer */}
          <div className="absolute bottom-4 left-8 right-8 border-t-2 border-brown-400 pt-4">
            <div className="flex justify-between items-center text-xs typewriter-text text-brown-600">
              <span>Confidence: {Math.round(currentEntry.confidence_score * 100)}%</span>
              <span>Original: {currentEntry.filename}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="vintage-paper torn-edges p-8 shadow-2xl text-center">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="typewriter-title text-2xl text-brown-800 mb-4">No Entries Found</h3>
          <p className="typewriter-text text-brown-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'No entries available.'}
          </p>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="page-turn-button px-6 py-3 rounded-lg disabled:opacity-50"
        >
          ← Previous
        </button>
        
        <div className="flex items-center gap-2">
          <select
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value))}
            className="search-vintage"
          >
            {filteredEntries.map((entry, index) => (
              <option key={index} value={index}>
                Page {index + 1}: {formatDate(entry.date_entry)}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage >= filteredEntries.length - 1}
          className="page-turn-button px-6 py-3 rounded-lg disabled:opacity-50"
        >
          Next →
        </button>
      </div>
      
      {/* Stats */}
      {logbookData && (
        <div className="vintage-paper torn-edges p-6 shadow-lg">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-brown-800 typewriter-title">
                {logbookData.metadata.total_entries}
              </div>
              <div className="text-brown-600 typewriter-text">Total Pages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brown-800 typewriter-title">
                {Math.round(logbookData.metadata.average_confidence * 100)}%
              </div>
              <div className="text-brown-600 typewriter-text">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brown-800 typewriter-title">
                {totalPages}
              </div>
              <div className="text-brown-600 typewriter-text">Showing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brown-800 typewriter-title">
                1933
              </div>
              <div className="text-brown-600 typewriter-text">Vintage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RetroLogbookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vintage-paper flex items-center justify-center">
        <div className="vintage-paper p-8 rounded-lg shadow-2xl max-w-md text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="typewriter-text text-brown-800">Loading vintage logbook...</p>
        </div>
      </div>
    }>
      <RetroLogbookContent />
    </Suspense>
  )
} 