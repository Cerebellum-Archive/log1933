import Link from 'next/link'

const journeyData = [
  {
    date: "January 1933",
    location: "Chicago, Illinois",
    title: "The Assignment",
    description: "George Kellogg Gann, a telephone company executive, gives his son Ernest an assignment to travel around the world and review telephone companies in Europe and Asia.",
    image: "/images/chicago-1933.jpg"
  },
  {
    date: "February 1933",
    location: "New York City",
    title: "Departure",
    description: "Ernest boards a steamship bound for Europe, beginning his world tour. At 23, he was a Yale dropout with dreams of filmmaking.",
    image: "/images/nyc-1933.jpg"
  },
  {
    date: "March 1933",
    location: "London, England",
    title: "European Telephone Review",
    description: "Ernest begins his review of European telephone systems, starting with the British Post Office telephone network.",
    image: "/images/london-1933.jpg"
  },
  {
    date: "April 1933",
    location: "Paris, France",
    title: "French Telecommunications",
    description: "Continuing his journey through Europe, Ernest studies the French telephone system and experiences the culture of Paris.",
    image: "/images/paris-1933.jpg"
  },
  {
    date: "May 1933",
    location: "Berlin, Germany",
    title: "German Innovation",
    description: "Ernest reviews the German telephone infrastructure, witnessing the technological advances of the era.",
    image: "/images/berlin-1933.jpg"
  },
  {
    date: "June 1933",
    location: "Moscow, Soviet Union",
    title: "Soviet Communications",
    description: "A challenging leg of the journey as Ernest reviews the Soviet telephone system during a period of significant change.",
    image: "/images/moscow-1933.jpg"
  },
  {
    date: "July 1933",
    location: "Tokyo, Japan",
    title: "Japanese Technology",
    description: "Ernest arrives in Asia, beginning his review of Japanese telecommunications and experiencing a vastly different culture.",
    image: "/images/tokyo-1933.jpg"
  },
  {
    date: "August 1933",
    location: "Shanghai, China",
    title: "Chinese Communications",
    description: "Continuing through Asia, Ernest studies the Chinese telephone system in the international port city of Shanghai.",
    image: "/images/shanghai-1933.jpg"
  },
  {
    date: "September 1933",
    location: "Hong Kong",
    title: "British Colony",
    description: "Ernest reviews the telephone system in the British colony of Hong Kong, experiencing the blend of Eastern and Western influences.",
    image: "/images/hongkong-1933.jpg"
  },
  {
    date: "October 1933",
    location: "Singapore",
    title: "Strait Settlements",
    description: "The journey continues through Southeast Asia as Ernest reviews telecommunications in the British Straits Settlements.",
    image: "/images/singapore-1933.jpg"
  },
  {
    date: "November 1933",
    location: "Bombay, India",
    title: "Indian Subcontinent",
    description: "Ernest arrives in India, reviewing the telephone systems of the British Raj and experiencing the vastness of the subcontinent.",
    image: "/images/bombay-1933.jpg"
  },
  {
    date: "December 1933",
    location: "Return to America",
    title: "Homeward Bound",
    description: "After nearly a year of travel, Ernest returns to America with a wealth of experience and observations that would later influence his writing.",
    image: "/images/return-1933.jpg"
  }
]

export default function JourneyPage() {
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
            The World Tour
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl">
            Follow Ernest K. Gann&apos;s 1933 journey around the world as he reviewed telephone companies 
            across Europe and Asia, an adventure that would shape his future as an aviation author.
          </p>
        </div>
      </header>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="timeline-line hidden md:block"></div>
            
            {journeyData.map((entry, index) => (
              <div key={index} className="relative mb-16 md:mb-24">
                {/* Timeline Dot */}
                <div className="timeline-dot"></div>
                
                {/* Content */}
                <div className="md:ml-16 card">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-1">{entry.date}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{entry.title}</h3>
                      <div className="text-blue-300 font-medium">{entry.location}</div>
                    </div>
                    
                    {/* Placeholder for future images */}
                    <div className="mt-4 md:mt-0 md:ml-8">
                      <div className="w-32 h-24 bg-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-slate-400 text-sm">Image</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {entry.description}
                  </p>
                  
                  {/* Future: Add button to view logbook entry */}
                  <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View Logbook Entry →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Explore the Original Logbook</h2>
          <p className="text-lg text-blue-100 mb-8">
            See the actual pages from Ernest&apos;s 1933 world tour logbook, 
            carefully digitized and preserved for future generations.
          </p>
          <Link 
            href="/logbook" 
            className="btn-primary"
          >
            View the Logbook
          </Link>
        </div>
      </section>
    </div>
  )
}
