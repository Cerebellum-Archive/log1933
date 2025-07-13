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

function LogbookContent() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [filteredEntries, setFilteredEntries] = useState<LogbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntry | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'filename'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
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

    // Apply sorting
    entries.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'date':
          aValue = a.date_entry || ''
          bValue = b.date_entry || ''
          break
        case 'confidence':
          aValue = a.confidence_score
          bValue = b.confidence_score
          break
        case 'filename':
          aValue = a.filename
          bValue = b.filename
          break
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredEntries(entries)
  }, [logbookData, searchTerm, sortBy, sortOrder, filterMonth, filterYear])

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

  const getFilterTitle = () => {
    if (filterMonth && filterYear) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      const monthName = monthNames[parseInt(filterMonth) - 1]
      return `${monthName} ${filterYear} Entries`
    }
    return 'Ernest K. Gann\'s 1933 World Tour Logbook'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading digitized logbook...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Logbook</h2>
          <p className="text-red-300 mb-4">Error: {error}</p>
          <p className="text-slate-400">The digitization process may still be in progress.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href={filterMonth && filterYear ? "/journey" : "/"}
              className="inline-flex items-center text-blue-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {filterMonth && filterYear ? 'Back to Journey' : 'Back to Home'}
            </Link>
            
            <Link 
              href="/logbook/retro"
              className="inline-flex items-center text-yellow-300 hover:text-white transition-colors bg-yellow-900 bg-opacity-50 px-4 py-2 rounded-lg border border-yellow-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Retro View
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {getFilterTitle()}
          </h1>
          
          {logbookData && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{logbookData.metadata.total_entries}</div>
                <div className="text-slate-300">Pages Digitized</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{Math.round(logbookData.metadata.average_confidence * 100)}%</div>
                <div className="text-slate-300">Average Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{logbookData.metadata.processing_stats.google_vision}</div>
                <div className="text-slate-300">Google Vision API</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{filteredEntries.length}</div>
                <div className="text-slate-300">Showing Results</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Controls */}
      <section className="py-8 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search logbook entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
            
            {/* Sort Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence' | 'filename')}
                className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="filename">Sort by Filename</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 hover:bg-slate-600 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Entries Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-400 text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Entries Found</h3>
              <p className="text-slate-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No entries match the current filter.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry, index) => (
                <div
                  key={index}
                  className="card hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 text-sm font-medium">
                        {formatDate(entry.date_entry)}
                      </span>
                      <span className="text-green-400 text-sm">
                        {Math.round(entry.confidence_score * 100)}%
                      </span>
                    </div>
                    
                    {entry.location && (
                      <div className="text-slate-300 text-sm mb-2">📍 {entry.location}</div>
                    )}
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {entry.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{entry.processing_method}</span>
                    <span>Page {entry.page_number}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for detailed view */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Logbook Entry - {formatDate(selectedEntry.date_entry)}
                </h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-slate-400 text-sm">Location</div>
                  <div className="text-white">{selectedEntry.location || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Confidence</div>
                  <div className="text-green-400">{Math.round(selectedEntry.confidence_score * 100)}%</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Processing Method</div>
                  <div className="text-blue-400">{selectedEntry.processing_method}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Content</h3>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedEntry.content}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 border-t border-slate-600 pt-4">
                <div>Filename: {selectedEntry.filename}</div>
                <div>Processed: {new Date(selectedEntry.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LogbookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading logbook...</p>
        </div>
      </div>
    }>
      <LogbookContent />
    </Suspense>
  )
}

