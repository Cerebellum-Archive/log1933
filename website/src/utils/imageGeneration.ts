// AI Image Generation Service for Historical Journey Images

interface ImageGenerationRequest {
  location: string
  date: string
  context: string
  style?: 'historical' | 'vintage' | 'documentary'
}

interface GeneratedImage {
  url: string
  alt: string
  prompt: string
  cached: boolean
}

export class HistoricalImageGenerator {
  private apiKey: string
  private baseUrl: string
  private cache: Map<string, GeneratedImage> = new Map()

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    this.baseUrl = 'https://api.openai.com/v1/images/generations'
  }

  /**
   * Generate historically accurate image prompts for 1933 world tour locations
   */
  private createHistoricalPrompt(location: string, date: string, context: string): string {
    const basePrompt = `A historically accurate photograph-style image from 1933 showing ${location}. `
    
    const locationPrompts: Record<string, string> = {
      'Chicago, Illinois': 'Chicago skyline with Art Deco buildings, vintage 1930s automobiles, people in period clothing, telephone company building, sepia tones',
      'New York City': 'New York harbor with steamships, 1930s Manhattan skyline, passengers boarding ocean liner, vintage luggage, documentary photography style',
      'London, England': 'London street scene 1933, red telephone boxes, double-decker buses, Big Ben in background, men in bowler hats, foggy atmosphere',
      'Paris, France': 'Paris street scene 1933, Eiffel Tower visible, vintage French automobiles, sidewalk cafes, people in 1930s fashion, romantic lighting',
      'Berlin, Germany': 'Berlin 1933, Weimar Republic era architecture, vintage German cars, people in period clothing, telephone exchange building, documentary style',
      'Moscow, Soviet Union': 'Moscow 1933, Red Square, Soviet architecture, vintage Russian vehicles, people in winter coats, telephone infrastructure, cold atmosphere',
      'Tokyo, Japan': 'Tokyo 1933, traditional Japanese architecture mixed with modern buildings, vintage Japanese cars, people in kimono and western dress, telephone poles',
      'Shanghai, China': 'Shanghai International Settlement 1933, mix of Eastern and Western architecture, vintage cars, bustling street scene, telephone lines',
      'Hong Kong': 'Hong Kong harbor 1933, British colonial architecture, vintage ships, mix of Chinese and Western people, telephone infrastructure, tropical atmosphere',
      'Singapore': 'Singapore 1933, British colonial buildings, tropical setting, vintage cars, mix of ethnicities, telephone exchange, humid atmosphere',
      'Bombay, India': 'Bombay 1933, British Raj architecture, vintage Indian vehicles, people in traditional and western dress, telephone infrastructure, colonial atmosphere',
      'Return to America': 'Ocean liner approaching New York harbor 1933, passengers on deck, Statue of Liberty visible, vintage luggage, homecoming atmosphere'
    }

    const specificPrompt = locationPrompts[location] || `${location} in 1933, period-accurate architecture and vehicles, people in 1930s clothing`
    
    return `${basePrompt}${specificPrompt}. ${context} High quality, historically accurate, documentary photography style, sepia or muted colors, 1930s aesthetic. No modern elements.`
  }

  /**
   * Generate image using OpenAI DALL-E
   */
  async generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    const cacheKey = `${request.location}-${request.date}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const prompt = this.createHistoricalPrompt(request.location, request.date, request.context)
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const imageUrl = data.data[0].url

      const generatedImage: GeneratedImage = {
        url: imageUrl,
        alt: `${request.location} in ${request.date} - ${request.context}`,
        prompt: prompt,
        cached: false
      }

      // Cache the result
      this.cache.set(cacheKey, generatedImage)
      
      return generatedImage
    } catch (error) {
      console.error('Image generation failed:', error)
      
      // Return fallback image
      return {
        url: `/images/journey/departure.jpg`,
        alt: `${request.location} in ${request.date}`,
        prompt: prompt,
        cached: false
      }
    }
  }

  /**
   * Generate placeholder image with location text
   */
  generatePlaceholder(location: string, date: string): GeneratedImage {
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1e293b"/>
          <text x="50%" y="40%" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="16">
            ${location}
          </text>
          <text x="50%" y="60%" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="12">
            ${date}
          </text>
        </svg>
      `)}`,
      alt: `${location} in ${date}`,
      prompt: `Placeholder for ${location} in ${date}`,
      cached: false
    }
  }
}

// Export singleton instance
export const imageGenerator = new HistoricalImageGenerator()

// Utility function to generate images for all journey locations
export async function generateJourneyImages() {
  const locations = [
    { location: 'Chicago, Illinois', date: 'January 1933', context: 'Telephone company executive giving assignment to son' },
    { location: 'New York City', date: 'February 1933', context: 'Young man boarding steamship for world tour' },
    { location: 'London, England', date: 'March 1933', context: 'Reviewing British Post Office telephone network' },
    { location: 'Paris, France', date: 'April 1933', context: 'Studying French telephone system and culture' },
    { location: 'Berlin, Germany', date: 'May 1933', context: 'Reviewing German telephone infrastructure' },
    { location: 'Moscow, Soviet Union', date: 'June 1933', context: 'Challenging review of Soviet telephone system' },
    { location: 'Tokyo, Japan', date: 'July 1933', context: 'Beginning Asian tour, reviewing Japanese telecommunications' },
    { location: 'Shanghai, China', date: 'August 1933', context: 'Studying Chinese telephone system in international port' },
    { location: 'Hong Kong', date: 'September 1933', context: 'British colony telephone system review' },
    { location: 'Singapore', date: 'October 1933', context: 'Southeast Asian telecommunications in British Straits Settlements' },
    { location: 'Bombay, India', date: 'November 1933', context: 'British Raj telephone systems review' },
    { location: 'Return to America', date: 'December 1933', context: 'Homeward bound after year of world travel' }
  ]

  const results = await Promise.all(
    locations.map(async (location) => {
      try {
        const image = await imageGenerator.generateImage(location)
        return { location: location.location, success: true, image }
      } catch (error) {
        console.error(`Failed to generate image for ${location.location}:`, error)
        return { 
          location: location.location, 
          success: false, 
          image: imageGenerator.generatePlaceholder(location.location, location.date)
        }
      }
    })
  )

  return results
} 