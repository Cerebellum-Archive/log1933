'use client'

import { useState } from 'react'
import { generateJourneyImages } from '@/utils/imageGeneration'

export default function ImageAdminPage() {
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [apiKey, setApiKey] = useState('')

  const handleGenerate = async () => {
    if (!apiKey) {
      alert('Please enter your OpenAI API key')
      return
    }

    setGenerating(true)
    
    // Set API key in environment
    process.env.NEXT_PUBLIC_OPENAI_API_KEY = apiKey
    
    try {
      const imageResults = await generateJourneyImages()
      setResults(imageResults)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Image generation failed. Check console for details.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">AI Image Generation Admin</h1>
        
        <div className="bg-slate-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Generate Journey Images</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="sk-..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              generating 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {generating ? 'Generating Images...' : 'Generate All Journey Images'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Generation Results</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((result, index) => (
                <div key={index} className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">{result.location}</h3>
                  {result.success ? (
                    <div>
                      <img 
                        src={result.image.url} 
                        alt={result.image.alt}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-green-400 text-sm">✓ Generated successfully</p>
                    </div>
                  ) : (
                    <p className="text-red-400 text-sm">✗ Generation failed</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 