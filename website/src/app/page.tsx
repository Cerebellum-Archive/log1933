import Link from 'next/link'

// Force deployment update - Ernest K. Gann 1933 Logbook
// Timestamp: 2024-06-21 20:55 - FORCE FRESH DEPLOYMENT
export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-pattern"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              <span className="block">ERNEST K. GANN</span>
              <span className="block text-3xl md:text-4xl text-blue-300 mt-2">1933 World Tour</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              A young man&apos;s journey around the world to review telephone companies in Europe and Asia, 
              setting the stage for one of aviation&apos;s greatest storytellers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/journey" 
                className="btn-primary"
              >
                Explore the Journey
              </Link>
              <Link 
                href="/about" 
                className="btn-secondary"
              >
                About Ernest
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-blue-300 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Timeline Preview */}
        <section className="py-20 px-4 bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">The Journey Begins</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-blue-400 text-sm font-semibold mb-2">1933</div>
                <h3 className="text-xl font-bold text-white mb-3">The Assignment</h3>
                <p className="text-slate-300">
                  George Kellogg Gann, a telephone company executive, sends his son Ernest on a world tour 
                  to review telephone companies across Europe and Asia.
                </p>
              </div>
              
              <div className="card">
                <div className="text-blue-400 text-sm font-semibold mb-2">The Traveler</div>
                <h3 className="text-xl font-bold text-white mb-3">Young Ernest</h3>
                <p className="text-slate-300">
                  At 23, Ernest K. Gann was a Yale dropout with dreams of filmmaking, 
                  about to embark on an adventure that would shape his future.
                </p>
              </div>
              
              <div className="card">
                <div className="text-blue-400 text-sm font-semibold mb-2">The Legacy</div>
                <h3 className="text-xl font-bold text-white mb-3">Aviation Pioneer</h3>
                <p className="text-slate-300">
                  This journey would later inspire his aviation career and his famous novels 
                  like &quot;Fate Is the Hunter&quot; and &quot;The High and the Mighty.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Discover the Logbook</h2>
            <p className="text-xl text-blue-100 mb-8">
              Explore the carefully preserved pages of Ernest&apos;s 1933 world tour logbook, 
              digitized and enhanced with modern technology.
            </p>
            <Link 
              href="/logbook" 
              className="btn-primary"
            >
              View the Logbook
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
