'use client'

import Link from 'next/link'

export default function AboutPage() {
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
        
        .brown-300 {
          color: #a0522d;
        }
        
        .timeline-dot {
          background: #FF6B35;
          border: 3px solid #f4f1e8;
        }
        
        .book-spine {
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
          border-left: 3px solid #654321;
          border-right: 1px solid #A0522D;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 vintage-paper border-b-4 border-brown-400 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left: Back to Home */}
            <Link 
              href="/" 
              className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors typewriter-text text-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Home
            </Link>
            
            {/* Center: Title */}
            <h1 className="text-3xl md:text-4xl typewriter-title text-brown-800 font-bold">
              About Ernest K. Gann
            </h1>
            
            {/* Right: Quick Navigation */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/journey" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm"
              >
                ✨ Highlights
              </Link>
              <Link 
                href="/logbook/timeline" 
                className="text-brown-600 hover:text-brown-800 transition-colors typewriter-text font-semibold text-sm"
              >
                📖 Timeline
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl typewriter-text text-brown-600 mb-4">
              1910 - 1991
            </div>
            <p className="text-xl typewriter-text text-brown-600 max-w-4xl mx-auto leading-relaxed">
              From telephone company reviewer to aviation pioneer and bestselling author — 
              the remarkable life of a man who turned his 1933 world tour into a lifetime of adventure.
            </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* The Man Behind the Words */}
          <section className="vintage-paper p-12 rounded-xl shadow-2xl">
            <h2 className="text-4xl typewriter-title text-brown-800 mb-8 text-center border-b-2 border-brown-300 pb-4">
              The Man Behind the Words
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl typewriter-title text-brown-700 mb-4">Early Dreams & Rebellions</h3>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed mb-4">
                  Born on October 13, 1910, in Lincoln, Nebraska, Ernest Kellogg Gann was the son of a telephone 
                  company executive who had grand plans for his boy to follow in the family business. But young 
                  Ernest had other ideas — his heart belonged to photography, movie-making, and the romantic 
                  notion of flight.
                </p>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed">
                  After struggling through traditional schooling, he was sent to Culver Military Academy, 
                  graduating at 19. Two years at Yale School of Drama followed, but the call of Broadway 
                  proved stronger than academic pursuits. By his early twenties, he was working the stages 
                  of New York as an assistant stage manager and later as a projectionist at Radio City Music Hall.
                </p>
              </div>

              <div className="border-l-4 border-brown-400 pl-6 bg-brown-50 py-4 rounded-r-lg">
                <h3 className="text-2xl typewriter-title text-brown-700 mb-4">The 1933 Turning Point</h3>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed mb-4">
                  In 1933, Ernest's father offered him an opportunity that would change everything: a trip around 
                  the world to review telephone companies in Europe and Asia. What began as a business assignment 
                  became an odyssey of discovery, documented in the logbook pages you can explore on this site.
                </p>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed">
                  This journey opened Ernest's eyes to the vast world beyond America's shores and planted the 
                  seeds for his future adventures in aviation and storytelling. The young man who departed was 
                  not the same one who returned — he had found his calling as an observer and chronicler of 
                  human experience.
                </p>
              </div>
            </div>
          </section>

          {/* Aviation Pioneer */}
          <section className="vintage-paper p-12 rounded-xl shadow-2xl">
            <h2 className="text-4xl typewriter-title text-brown-800 mb-8 text-center border-b-2 border-brown-300 pb-4">
              Taking to the Skies
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl typewriter-title text-brown-700 mb-4">Finding His Wings (1938-1945)</h3>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed mb-4">
                  In 1938, Ernest found what he would later call his "life's work" when American Airlines hired 
                  him as a First Officer. Flying Douglas DC-2 and DC-3 aircraft across the northeastern United States, 
                  he discovered the unique perspective that only aviators know — the world spread out below like 
                  a living map.
                </p>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed">
                  When World War II erupted, Ernest volunteered for the Air Transport Command, flying the dangerous 
                  routes across the North Atlantic and later the treacherous "Hump" route over the Himalayas to China. 
                  He described the Himalayan route as having "simply and truthfully the worst weather in the world" — 
                  experiences that would later fuel his most memorable stories.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 my-8">
                <div className="text-center vintage-paper p-4 rounded-lg border-2 border-brown-300">
                  <div className="text-3xl typewriter-title text-brown-700 font-bold">DC-3</div>
                  <div className="typewriter-text text-brown-600 text-sm">Commercial Aviation</div>
                </div>
                <div className="text-center vintage-paper p-4 rounded-lg border-2 border-brown-300">
                  <div className="text-3xl typewriter-title text-brown-700 font-bold">The Hump</div>
                  <div className="typewriter-text text-brown-600 text-sm">Himalayan Route</div>
                </div>
                <div className="text-center vintage-paper p-4 rounded-lg border-2 border-brown-300">
                  <div className="text-3xl typewriter-title text-brown-700 font-bold">ATC</div>
                  <div className="typewriter-text text-brown-600 text-sm">Air Transport Command</div>
                </div>
              </div>
            </div>
          </section>

          {/* Literary Legacy */}
          <section className="vintage-paper p-12 rounded-xl shadow-2xl">
            <h2 className="text-4xl typewriter-title text-brown-800 mb-8 text-center border-b-2 border-brown-300 pb-4">
              Literary Legacy
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl typewriter-title text-brown-700 mb-4">The Stories Take Flight</h3>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed mb-6">
                  Ernest's aviation experiences provided the raw material for a remarkable literary career. 
                  His novels weren't just adventure stories — they were authentic portrayals of the early 
                  days of commercial aviation, written by someone who had lived every moment in the cockpit.
                </p>
              </div>

              {/* Featured Books */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl typewriter-title text-brown-700">Aviation Classics</h4>
                  <div className="space-y-3">
                    <div className="book-spine p-4 rounded-lg text-white">
                      <div className="font-bold typewriter-text">Island in the Sky (1944)</div>
                      <div className="text-sm typewriter-text opacity-90">His breakthrough novel</div>
                    </div>
                    <div className="book-spine p-4 rounded-lg text-white">
                      <div className="font-bold typewriter-text">The High and the Mighty (1953)</div>
                      <div className="text-sm typewriter-text opacity-90">Academy Award winning adaptation</div>
                    </div>
                    <div className="book-spine p-4 rounded-lg text-white">
                      <div className="font-bold typewriter-text">Fate Is the Hunter (1961)</div>
                      <div className="text-sm typewriter-text opacity-90">Classic aviation memoir</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl typewriter-title text-brown-700">Adventure & Beyond</h4>
                  <div className="space-y-3">
                    <div className="book-spine p-4 rounded-lg text-white">
                      <div className="font-bold typewriter-text">Soldier of Fortune (1954)</div>
                      <div className="text-sm typewriter-text opacity-90">Hong Kong adventure</div>
                    </div>
                    <div className="book-spine p-4 rounded-lg text-white">
                      <div className="font-bold typewriter-text">The Antagonists (1970)</div>
                      <div className="text-sm typewriter-text opacity-90">Siege of Masada epic</div>
                    </div>
                    <div className="book-spine p-4 rounded-lg text-white">
                      <div className="font-bold typewriter-text">Song of the Sirens (1968)</div>
                      <div className="text-sm typewriter-text opacity-90">Maritime memoir</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-brown-400 pl-6 bg-brown-50 py-4 rounded-r-lg">
                <h4 className="text-xl typewriter-title text-brown-700 mb-3">Hollywood Recognition</h4>
                <p className="typewriter-text text-brown-800 leading-relaxed">
                  Ernest's stories captured the imagination of Hollywood, with eight of his works adapted for 
                  film and television. Stars like John Wayne, Clark Gable, and Rock Hudson brought his characters 
                  to life, but the authentic aviation details came straight from Ernest's own experiences in the cockpit.
                </p>
              </div>
            </div>
          </section>

          {/* Later Life & Legacy */}
          <section className="vintage-paper p-12 rounded-xl shadow-2xl">
            <h2 className="text-4xl typewriter-title text-brown-800 mb-8 text-center border-b-2 border-brown-300 pb-4">
              The Final Chapters
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl typewriter-title text-brown-700 mb-4">Sailor & Conservationist</h3>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed mb-4">
                  In his later years, Ernest traded wings for sails, becoming an accomplished sailor and 
                  environmental advocate. From his home in Friday Harbor, Washington, he continued to write 
                  and paint, always with an eye toward preserving the natural world that had inspired so 
                  many of his adventures.
                </p>
                <p className="typewriter-text text-brown-800 text-lg leading-relaxed">
                  His commitment to conservation and maritime preservation reflected the same spirit of 
                  exploration that had driven his 1933 world tour — a desire to understand and protect 
                  the world's remarkable diversity.
                </p>
              </div>

              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-8 vintage-paper p-6 rounded-full border-2 border-brown-400">
                  <div className="text-center">
                    <div className="text-3xl typewriter-title text-brown-700 font-bold">24</div>
                    <div className="typewriter-text text-brown-600 text-sm">Books Published</div>
                  </div>
                  <div className="w-px h-12 bg-brown-400"></div>
                  <div className="text-center">
                    <div className="text-3xl typewriter-title text-brown-700 font-bold">8</div>
                    <div className="typewriter-text text-brown-600 text-sm">Film Adaptations</div>
                  </div>
                  <div className="w-px h-12 bg-brown-400"></div>
                  <div className="text-center">
                    <div className="text-3xl typewriter-title text-brown-700 font-bold">81</div>
                    <div className="typewriter-text text-brown-600 text-sm">Years of Adventure</div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-brown-400 pl-6 bg-brown-50 py-4 rounded-r-lg">
                <h4 className="text-xl typewriter-title text-brown-700 mb-3">Lasting Impact</h4>
                <p className="typewriter-text text-brown-800 leading-relaxed">
                  Ernest K. Gann passed away on December 19, 1991, but his legacy lives on through his books, 
                  which continue to inspire aviation enthusiasts and adventure seekers worldwide. His authentic 
                  portrayal of early aviation helped preserve the history of an era when flying was still a 
                  dangerous and romantic endeavor.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center vintage-paper p-12 rounded-xl shadow-2xl">
            <h2 className="text-4xl typewriter-title text-brown-800 mb-6">
              Discover the Journey That Started It All
            </h2>
            <p className="text-lg typewriter-text text-brown-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The 1933 world tour documented in these pages was the foundation for Ernest's lifetime of 
              adventure and storytelling. Explore his original logbook entries and trace the journey 
              that transformed a young telephone company reviewer into one of America's greatest aviation writers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/logbook/timeline" 
                className="bg-brown-600 hover:bg-brown-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 typewriter-text font-semibold text-lg"
              >
                📖 Explore the 1933 Logbook
              </Link>
              <Link 
                href="/journey" 
                className="border-2 border-brown-600 text-brown-600 hover:bg-brown-600 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 typewriter-text font-semibold text-lg"
              >
                ✨ Read Journey Highlights
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
