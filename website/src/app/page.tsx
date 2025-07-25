import Link from 'next/link'

// Force deployment update - Ernest K. Gann 1933 Logbook
// Timestamp: 2024-06-21 20:55 - FORCE FRESH DEPLOYMENT
export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        {/* Fixed Navigation Header */}
        <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-amber-100/95 via-yellow-100/95 to-orange-100/95 backdrop-blur-sm border-b-2 border-brown-400 py-3 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left: Logo/Title */}
              <div className="text-2xl typewriter-title text-brown-800 font-bold">
                Ernest K. Gann 1933
              </div>
              
              {/* Right: Quick Navigation */}
              <div className="flex items-center space-x-4">
                <Link 
                  href="/journey" 
                  className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 rounded"
                >
                  ✨ Highlights
                </Link>
                <Link 
                  href="/logbook/timeline" 
                  className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 rounded"
                >
                  📖 Timeline
                </Link>
                <Link 
                  href="/about" 
                  className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm px-3 py-2 rounded"
                >
                  👨‍✈️ About
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Aviation sketch background */}
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-20"
            style={{
              backgroundImage: 'url(/images/backgrounds/aviation-sketch-optimized.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          
          {/* Background texture overlay */}
          <div className="absolute inset-0 vintage-paper opacity-15"></div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-12 rounded-2xl shadow-2xl border-4 border-brown-400">
              <h1 className="text-6xl md:text-8xl typewriter-title text-brown-800 mb-6 tracking-tight">
                <span className="block">ERNEST K. GANN</span>
                <span className="block text-3xl md:text-4xl text-brown-600 mt-4 typewriter-text">1933 World Tour Logbook</span>
              </h1>
              
              <p className="text-xl md:text-2xl typewriter-text text-brown-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                A young man's journey around the world to review telephone companies in Europe and Asia, 
                setting the stage for one of aviation's greatest storytellers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/journey" 
                  className="bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 typewriter-text font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  ✨ Journey Highlights
                </Link>
                <Link 
                  href="/logbook/timeline" 
                  className="border-2 border-brown-600 text-brown-600 hover:bg-gradient-to-r hover:from-brown-600 hover:to-brown-700 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 typewriter-text font-semibold text-lg shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                >
                  📖 Explore Timeline
                </Link>
                <Link 
                  href="/about" 
                  className="border-2 border-brown-500 text-brown-500 hover:bg-gradient-to-r hover:from-brown-500 hover:to-brown-600 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 typewriter-text font-semibold text-lg shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                >
                  👨‍✈️ About Ernest
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-brown-500 rounded-full flex justify-center vintage-paper">
              <div className="w-1 h-3 bg-brown-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Timeline Preview */}
        <section className="py-20 px-4 vintage-paper">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl typewriter-title text-brown-800 text-center mb-16">The Journey Begins</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="vintage-paper p-8 rounded-xl shadow-xl border-2 border-brown-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-brown-500 typewriter-text text-lg font-semibold mb-3">📅 1933</div>
                <h3 className="text-2xl typewriter-title text-brown-800 mb-4">The Assignment</h3>
                <p className="typewriter-text text-brown-700 leading-relaxed">
                  George Kellogg Gann, a telephone company executive, sends his son Ernest on a world tour 
                  to review telephone companies across Europe and Asia.
                </p>
              </div>
              
              <div className="vintage-paper p-8 rounded-xl shadow-xl border-2 border-brown-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-brown-500 typewriter-text text-lg font-semibold mb-3">👤 The Traveler</div>
                <h3 className="text-2xl typewriter-title text-brown-800 mb-4">Young Ernest</h3>
                <p className="typewriter-text text-brown-700 leading-relaxed">
                  At 23, Ernest K. Gann was a Yale dropout with dreams of filmmaking, 
                  about to embark on an adventure that would shape his future.
                </p>
              </div>
              
              <div className="vintage-paper p-8 rounded-xl shadow-xl border-2 border-brown-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-brown-500 typewriter-text text-lg font-semibold mb-3">✈️ The Legacy</div>
                <h3 className="text-2xl typewriter-title text-brown-800 mb-4">Aviation Pioneer</h3>
                <p className="typewriter-text text-brown-700 leading-relaxed">
                  This journey would later inspire his aviation career and his famous novels 
                  like "Fate Is the Hunter" and "The High and the Mighty."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Quote */}
        <section className="py-20 px-4 bg-gradient-to-r from-brown-100 to-amber-100">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-2xl border-4 border-brown-400">
              <div className="text-center mb-8">
                <h2 className="text-4xl typewriter-title text-brown-800 mb-4">From the Logbook</h2>
                <div className="w-24 h-1 bg-brown-500 mx-auto"></div>
              </div>
              
              <div className="quote-highlight mb-6">
                <blockquote className="text-2xl typewriter-text text-brown-800 italic text-center leading-relaxed">
                  "I am at present on the threshold of a world tour... just like that, you see, I say 'World Tour.' 
                  As a matter of fact, I am not terribly excited. I have business to do along the way, and naturally, 
                  I have no intentions of neglecting the purely entertaining points of such a trip."
                </blockquote>
              </div>
              
              <div className="text-center">
                <div className="typewriter-text text-brown-600 text-lg">
                  — Ernest K. Gann, aboard the motor-ship Georgic, June 1933
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 vintage-paper border-t-4 border-brown-400">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl typewriter-title text-brown-800 mb-6">Discover the Complete Story</h2>
            <p className="text-xl typewriter-text text-brown-600 mb-8 leading-relaxed">
              Explore the carefully preserved pages of Ernest's 1933 world tour logbook, 
              digitized and enhanced to bring his remarkable journey to life.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/journey" 
                className="vintage-paper p-6 rounded-lg border-2 border-brown-400 hover:bg-brown-100 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-2">✨</div>
                <div className="typewriter-title text-brown-800 font-bold text-lg mb-2">Journey Highlights</div>
                <div className="typewriter-text text-brown-600 text-sm">Notable quotes & observations</div>
              </Link>
              
              <Link 
                href="/logbook/timeline" 
                className="vintage-paper p-6 rounded-lg border-2 border-brown-400 hover:bg-brown-100 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-2">📖</div>
                <div className="typewriter-title text-brown-800 font-bold text-lg mb-2">Complete Timeline</div>
                <div className="typewriter-text text-brown-600 text-sm">Full chronological journey</div>
              </Link>
              
              <Link 
                href="/logbook/retro" 
                className="vintage-paper p-6 rounded-lg border-2 border-brown-400 hover:bg-brown-100 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-2">⌨️</div>
                <div className="typewriter-title text-brown-800 font-bold text-lg mb-2">Retro Typewriter</div>
                <div className="typewriter-text text-brown-600 text-sm">Authentic 1930s experience</div>
              </Link>
              
              <Link 
                href="/about" 
                className="vintage-paper p-6 rounded-lg border-2 border-brown-400 hover:bg-brown-100 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-2">👨‍✈️</div>
                <div className="typewriter-title text-brown-800 font-bold text-lg mb-2">About Ernest</div>
                <div className="typewriter-text text-brown-600 text-sm">Life & literary legacy</div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
