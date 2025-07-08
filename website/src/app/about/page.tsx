'use client'

import Link from 'next/link'

export default function AboutPage() {
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
            About Ernest K. Gann
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl">
            From telephone company reviewer to aviation pioneer and bestselling author - 
            the remarkable life of Ernest Kellogg Gann.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Early Life */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Early Life (1910-1933)</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Birth and Family</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Ernest Kellogg Gann was born on October 13, 1910, in Lincoln, Nebraska, 
                  to George Kellogg Gann (1884-1958) and Caroline May Kupper (1890-1945). 
                  His father was a telephone company executive who worked in Lincoln, St. Paul, and Chicago.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Despite his father&apos;s desire for him to pursue a career in the telephone business, 
                  young Ernest was fascinated by photography, movie-making, and aviation.
                </p>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Education and Early Career</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  After struggling in school, Ernest was sent to Culver Military Academy, 
                  graduating at age 19 in 1930. He then attended Yale School of Drama for two years 
                  before dropping out to pursue a career on Broadway.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  He worked as an assistant stage manager and later found work at Radio City Music Hall 
                  as a projectionist and commercial movie cartoonist.
                </p>
              </div>
            </div>
          </section>

          {/* The 1933 World Tour */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">The 1933 World Tour</h2>
            <div className="bg-slate-800 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-blue-300 mb-4">The Assignment</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                In 1933, Ernest&apos;s father gave him a unique opportunity: a trip around the world 
                to review telephone companies in Europe and Asia. This assignment would prove to be 
                a pivotal experience in his life, exposing him to different cultures and technologies.
              </p>
              <p className="text-slate-300 leading-relaxed mb-6">
                The journey took him through major cities including London, Paris, Berlin, Moscow, 
                Tokyo, Shanghai, Hong Kong, Singapore, and Bombay. Each stop provided insights into 
                different approaches to telecommunications and exposed him to the broader world.
              </p>
              <Link 
                href="/journey" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Explore the Journey →
              </Link>
            </div>
          </section>

          {/* Aviation Career */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Aviation Career (1938-1945)</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Commercial Aviation</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  In 1938, Gann was hired as a First Officer by American Airlines, flying Douglas DC-2 
                  and DC-3 aircraft. He found his &quot;life&apos;s work&quot; in aviation, flying routes in the 
                  northeastern United States.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  During World War II, he volunteered for the Air Transport Command, flying transport 
                  aircraft across the North Atlantic and later in the South Atlantic and Asia.
                </p>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold text-blue-300 mb-4">The Hump and Beyond</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Gann flew &quot;The Hump&quot; - the dangerous airlift route across the Himalayas to China, 
                  which he described as having &quot;simply and truthfully the worst weather in the world.&quot;
                </p>
                <p className="text-slate-300 leading-relaxed">
                  His wartime experiences would later provide rich material for his aviation novels 
                  and memoirs.
                </p>
              </div>
            </div>
          </section>

          {/* Published Works */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Published Works</h2>
            
            {/* Aviation Novels */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-300 mb-6">Aviation Novels</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="https://www.amazon.com/Island-Sky-Ernest-K-Gann/dp/1519479034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1944</div>
                  <div className="font-semibold text-white">Island in the Sky</div>
                  <div className="text-xs text-slate-400 mt-1">His first novel, based on wartime experiences</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Blaze-Noon-Ernest-K-Gann/dp/0553290371"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1946</div>
                  <div className="font-semibold text-white">Blaze of Noon</div>
                  <div className="text-xs text-slate-400 mt-1">Story of early air mail operations</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/High-Mighty-Ernest-K-Gann/dp/0450045226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1953</div>
                  <div className="font-semibold text-white">The High and the Mighty</div>
                  <div className="text-xs text-slate-400 mt-1">His most famous work, Academy Award winner</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Fate-Hunter-Ernest-K-Gann/dp/0671636030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1961</div>
                  <div className="font-semibold text-white">Fate Is the Hunter</div>
                  <div className="text-xs text-slate-400 mt-1">Classic aviation memoir, still in print</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Company-Eagles-Ernest-K-Gann/dp/0515054844"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1966</div>
                  <div className="font-semibold text-white">In the Company of Eagles</div>
                  <div className="text-xs text-slate-400 mt-1">World War I aviation drama</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Aviator-Ernest-K-Gann/dp/0345322533"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1981</div>
                  <div className="font-semibold text-white">The Aviator</div>
                  <div className="text-xs text-slate-400 mt-1">Epic tale of early aviation</div>
                </a>
              </div>
            </div>

            {/* Nautical Works */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-300 mb-6">Nautical & Adventure Novels</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="https://www.amazon.com/Fiddlers-Green-Ernest-K-Gann/dp/1199999903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1950</div>
                  <div className="font-semibold text-white">Fiddler&apos;s Green</div>
                  <div className="text-xs text-slate-400 mt-1">Nautical adventure, adapted to film</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Soldier-Fortune-Ernest-K-Gann/dp/0848804961"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1954</div>
                  <div className="font-semibold text-white">Soldier of Fortune</div>
                  <div className="text-xs text-slate-400 mt-1">Hong Kong adventure, major film adaptation</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Twilight-Gods-Ernest-K-Gann/dp/0345021436"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1956</div>
                  <div className="font-semibold text-white">Twilight for the Gods</div>
                  <div className="text-xs text-slate-400 mt-1">Maritime drama, film adaptation</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Antagonists-Ernest-K-Gann/dp/0451078993"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1970</div>
                  <div className="font-semibold text-white">The Antagonists</div>
                  <div className="text-xs text-slate-400 mt-1">Siege of Masada, became TV miniseries</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Gentlemen-Adventure-Ernest-K-Gann/dp/0340508175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1983</div>
                  <div className="font-semibold text-white">Gentlemen of Adventure</div>
                  <div className="text-xs text-slate-400 mt-1">Early aviation pioneers</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Bad-Angel-Ernest-K-Gann/dp/0877959293"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1987</div>
                  <div className="font-semibold text-white">The Bad Angel</div>
                  <div className="text-xs text-slate-400 mt-1">Contemporary drama about drug trafficking</div>
                </a>
              </div>
            </div>

            {/* Memoirs & Non-Fiction */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-300 mb-6">Memoirs & Non-Fiction</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="https://www.amazon.com/Song-Sirens-Ernest-K-Gann/dp/1574092545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1968</div>
                  <div className="font-semibold text-white">Song of the Sirens</div>
                  <div className="text-xs text-slate-400 mt-1">Sailing memoir and maritime adventures</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Ernest-Ganns-Flying-Circus/dp/0553296973"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1974</div>
                  <div className="font-semibold text-white">Ernest K. Gann&apos;s Flying Circus</div>
                  <div className="text-xs text-slate-400 mt-1">Aviation stories and experiences</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Hostage-Fortune-Ernest-K-Gann/dp/0345284011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1978</div>
                  <div className="font-semibold text-white">A Hostage to Fortune</div>
                  <div className="text-xs text-slate-400 mt-1">Complete autobiography</div>
                </a>
                
                <a 
                  href="https://www.amazon.com/Black-Watch-America-Secret-Planes/dp/0394575075"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-sm text-blue-400 mb-1">1989</div>
                  <div className="font-semibold text-white">The Black Watch</div>
                  <div className="text-xs text-slate-400 mt-1">The Men Who Fly America&apos;s Secret Spy Planes</div>
                </a>
              </div>
            </div>
          </section>

          {/* Film Adaptations */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Film Adaptations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a 
                href="https://www.imdb.com/title/tt0045919/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-sm text-blue-400 mb-2">1953</div>
                <div className="font-bold text-white text-lg mb-2">Island in the Sky</div>
                <div className="text-slate-300 text-sm mb-3">
                  Starring John Wayne • Directed by William A. Wellman
                </div>
                <div className="text-xs text-slate-400">
                  Based on his novel • IMDb Rating: 6.8/10
                </div>
              </a>
              
              <a 
                href="https://www.imdb.com/title/tt0047150/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-sm text-blue-400 mb-2">1954</div>
                <div className="font-bold text-white text-lg mb-2">The High and the Mighty</div>
                <div className="text-slate-300 text-sm mb-3">
                  Starring John Wayne • Directed by William A. Wellman
                </div>
                <div className="text-xs text-slate-400">
                  Academy Award winner • IMDb Rating: 6.6/10
                </div>
              </a>
              
              <a 
                href="https://www.imdb.com/title/tt0048623/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-sm text-blue-400 mb-2">1955</div>
                <div className="font-bold text-white text-lg mb-2">Soldier of Fortune</div>
                <div className="text-slate-300 text-sm mb-3">
                  Starring Clark Gable & Susan Hayward • Directed by Edward Dmytryk
                </div>
                <div className="text-xs text-slate-400">
                  Hong Kong adventure • IMDb Rating: 6.2/10
                </div>
              </a>
              
              <a 
                href="https://www.imdb.com/title/tt0051107/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-sm text-blue-400 mb-2">1958</div>
                <div className="font-bold text-white text-lg mb-2">Twilight for the Gods</div>
                <div className="text-slate-300 text-sm mb-3">
                  Starring Rock Hudson • Directed by Joseph Pevney
                </div>
                <div className="text-xs text-slate-400">
                  Maritime drama • IMDb Rating: 5.8/10
                </div>
              </a>
              
              <a 
                href="https://www.imdb.com/title/tt0057065/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-sm text-blue-400 mb-2">1964</div>
                <div className="font-bold text-white text-lg mb-2">Fate Is the Hunter</div>
                <div className="text-slate-300 text-sm mb-3">
                  Starring Glenn Ford • Directed by Ralph Nelson
                </div>
                <div className="text-xs text-slate-400">
                  Aviation drama • IMDb Rating: 6.8/10
                </div>
              </a>
              
              <a 
                href="https://www.imdb.com/title/tt0082694/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-sm text-blue-400 mb-2">1981</div>
                <div className="font-bold text-white text-lg mb-2">Masada</div>
                <div className="text-slate-300 text-sm mb-3">
                  TV Miniseries • Starring Peter O&apos;Toole
                </div>
                <div className="text-xs text-slate-400">
                  Based on &quot;The Antagonists&quot; • IMDb Rating: 7.8/10
                </div>
              </a>
            </div>
          </section>

          {/* Later Life and Legacy */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Later Life and Legacy</h2>
            <div className="bg-slate-800 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-blue-300 mb-4">Conservation and Sailing</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                In his later years, Gann became an avid sailor and conservationist. He lived in Friday Harbor, 
                Washington, where he continued to write and paint. He was also involved in environmental 
                causes and maritime preservation.
              </p>
              <p className="text-slate-300 leading-relaxed mb-6">
                Ernest K. Gann passed away on December 19, 1991, at the age of 81. His legacy lives on 
                through his books, which continue to inspire aviation enthusiasts and readers worldwide.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">24</div>
                  <div className="text-slate-300">Books Published</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">8</div>
                  <div className="text-slate-300">Film Adaptations</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">81</div>
                  <div className="text-slate-300">Years of Life</div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Explore the 1933 Logbook</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover the actual pages from Ernest&apos;s world tour logbook, 
              carefully preserved and digitized for future generations.
            </p>
            <Link 
              href="/logbook" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View the Logbook
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
