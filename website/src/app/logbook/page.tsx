import Link from 'next/link'

export default function LogbookPage() {
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
            The 1933 Logbook
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl">
            Explore the original pages from Ernest K. Gann&apos;s world tour logbook, 
            carefully digitized and enhanced for modern viewing.
          </p>
        </div>
      </header>

      {/* Coming Soon Section */}
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800 p-12 rounded-lg">
            <div className="text-6xl mb-6">📖</div>
            <h2 className="text-3xl font-bold text-white mb-6">Coming Soon</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              We&apos;re currently processing and digitizing the original logbook pages from Ernest&apos;s 1933 world tour. 
              This will include high-resolution scans, OCR text extraction, and historical context for each entry.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="text-2xl mb-2">📷</div>
                <h3 className="font-bold text-white mb-2">High-Resolution Scans</h3>
                <p className="text-slate-300 text-sm">Original handwritten pages preserved in digital format</p>
              </div>
              <div className="card">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-bold text-white mb-2">OCR Text Extraction</h3>
                <p className="text-slate-300 text-sm">AI-enhanced text recognition for easy reading</p>
              </div>
              <div className="card">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-bold text-white mb-2">Historical Context</h3>
                <p className="text-slate-300 text-sm">Background information for each location and entry</p>
              </div>
            </div>
            
            <div className="bg-blue-900 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-white mb-4">What to Expect</h3>
              <ul className="text-blue-100 text-left max-w-md mx-auto space-y-2">
                <li>• Interactive page viewer with zoom capabilities</li>
                <li>• Searchable text from all logbook entries</li>
                <li>• Timeline integration with journey map</li>
                <li>• Historical photographs and context</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/journey" 
                className="btn-secondary"
              >
                Explore the Journey
              </Link>
              <Link 
                href="/about" 
                className="btn-secondary"
              >
                Learn About Ernest
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
