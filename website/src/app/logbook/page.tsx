'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function LogbookPage() {
  const [logbookData, setLogbookData] = useState<LogbookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntry | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'filename'>('filename')

  useEffect(() => {
    // Load the digitized logbook data
    fetch('/data/complete_logbook.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Logbook data not found')
        }
        return response.json()
      })
      .then((data: LogbookData) => {
        setLogbookData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredEntries = logbookData?.entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date_entry?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return (a.date_entry || '').localeCompare(b.date_entry || '')
      case 'confidence':
        return b.confidence_score - a.confidence_score
      case 'filename':
      default:
        return a.filename.localeCompare(b.filename)
    }
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-300 mx-auto"></div>
            <p className="text-blue-100 mt-4">Loading digitized logbook...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="text-red-400 mb-4 text-xl">⚠️ {error}</div>
            <div className="bg-blue-900/50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-3">To load the logbook data:</h3>
              <ol className="text-left text-slate-300 space-y-2">
                <li>1. Run digitization: <code className="bg-slate-700 px-2 py-1 rounded">python digitize_logbook.py</code></li>
                <li>2. Integrate data: <code className="bg-slate-700 px-2 py-1 rounded">python integrate_data.py</code></li>
                <li>3. Deploy to Vercel</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">The 1933 Logbook</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore Ernest K. Gann&apos;s handwritten logbook entries from his world tour, 
              digitized using cutting-edge AI technology.
            </p>
          </div>

          {/* Status Section */}
          <div className="bg-slate-800/50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Digitization Complete!</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{logbookData.metadata.total_entries}</div>
                <div className="text-slate-300">Pages Digitized</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {Math.round(logbookData.metadata.average_confidence * 100)}%
                </div>
                <div className="text-slate-300">Average Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{logbookData.metadata.processing_stats.google_vision}</div>
                <div className="text-slate-300">Google Vision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">AI Enhanced</div>
                <div className="text-slate-300">GPT-4 Improved</div>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search entries by content, location, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence' | 'filename')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="filename">Sort by Filename</option>
                <option value="date">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
              </select>
            </div>
            <div className="text-slate-300">
              Showing {filteredEntries.length} of {logbookData.entries.length} entries
            </div>
          </div>

          {/* Entries Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEntries.map((entry, index) => (
              <div
                key={entry.filename}
                className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-700/50 transition-all cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    Page {entry.page_number || index + 1}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.confidence_score > 0.8 ? 'bg-green-400' :
                      entry.confidence_score > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-xs text-slate-400">
                      {Math.round(entry.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
                
                {entry.date_entry && (
                  <div className="text-blue-400 text-sm mb-2">{entry.date_entry}</div>
                )}
                
                {entry.location && (
                  <div className="text-slate-400 text-sm mb-3">{entry.location}</div>
                )}
                
                <p className="text-slate-300 text-sm line-clamp-3">
                  {entry.content.substring(0, 150)}...
                </p>
                
                <div className="mt-4 text-xs text-slate-500">
                  Method: {entry.processing_method}
                </div>
              </div>
            ))}
          </div>

          {/* Entry Modal */}
          {selectedEntry && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Page {selectedEntry.page_number}
                      </h2>
                      {selectedEntry.date_entry && (
                        <div className="text-blue-400 mb-1">{selectedEntry.date_entry}</div>
                      )}
                      {selectedEntry.location && (
                        <div className="text-slate-400">{selectedEntry.location}</div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedEntry(null)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">AI-Enhanced Content</h3>
                    <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.content}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Original OCR Text</h3>
                    <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.raw_ocr_text}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center text-sm text-slate-500">
                    <div>
                      Processing method: {selectedEntry.processing_method} | 
                      Confidence: {Math.round(selectedEntry.confidence_score * 100)}%
                    </div>
                    <div>
                      Processed: {new Date(selectedEntry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
