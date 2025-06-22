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
              <div className="card">
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
              
              <div className="card">
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
                className="btn-primary"
              >
                Explore the Journey →
              </Link>
            </div>
          </section>

          {/* Aviation Career */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Aviation Career (1938-1945)</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
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
              
              <div className="card">
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

          {/* Literary Career */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Literary Career</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Aviation Novels</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Gann&apos;s first novel, &quot;Island in the Sky&quot; (1944), was based on his wartime experiences 
                  and became a successful film starring John Wayne.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  His most famous work, &quot;The High and the Mighty&quot; (1953), was also adapted into a 
                  major Hollywood film starring John Wayne and won an Academy Award for Best Original Song.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  &quot;Fate Is the Hunter&quot; (1961) is considered one of the greatest aviation books ever written 
                  and remains in print today.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Nautical and Other Works</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Gann also wrote nautical-themed novels including &quot;Fiddler&apos;s Green&quot; and &quot;Soldier of Fortune,&quot; 
                  both of which were adapted into major motion pictures.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  His works captured the romance and danger of early commercial aviation and sailing, 
                  drawing from his extensive real-world experiences.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  He wrote over 20 books during his career, including novels, memoirs, and non-fiction works.
                </p>
              </div>
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
                  <div className="text-2xl font-bold text-blue-400">20+</div>
                  <div className="text-slate-300">Books Published</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">5+</div>
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
              className="btn-primary"
            >
              View the Logbook
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
