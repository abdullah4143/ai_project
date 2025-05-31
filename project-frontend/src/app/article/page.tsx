'use client'

import { useRouter } from 'next/navigation'
import  useArticleStore  from '../stores/articleStore'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ArticlePage() {
  const router = useRouter()
  const selectedArticle = useArticleStore(state => state.selectedArticle)
  const selectedCategory = useArticleStore(state => state.selectedCategory)
  const [fullText, setFullText] = useState<string | null>(null)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert HTML to clean plain text
  const cleanHtmlToText = (html: string): string => {

    // Remove script and style tags
    const cleaned = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
                       .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ') // Remove remaining tags
                       .replace(/\s+/g, ' ')     // Collapse whitespace
                       .trim()
    console.log(cleaned);
    return cleaned
  }

  const fetchAndSummarize = async () => {
    if (!selectedArticle) return

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Fetch full article content
      const res = await fetch('/api/full-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedArticle.url }),
      })

      if (!res.ok) throw new Error('Failed to fetch article')
      
      const { text } = await res.json()
      console.log(text);

      const cleanedContent = cleanHtmlToText(text || selectedArticle.description)
      setFullText(cleanedContent)

      // Step 2: Send to summarization API
      const summaryRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: cleanedContent,
          max_sentences: 4
        }),
      })

      if (!summaryRes.ok) throw new Error('Failed to generate summary')
      
      const { summary } = await summaryRes.json()
      setAiSummary(summary)

    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setAiSummary(selectedArticle.description || 'No summary available.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedArticle) {
      router.back()
      return
    }
    fetchAndSummarize()
  }, [selectedArticle, router])

  if (!selectedArticle) {
    return <div className="p-4 text-center">No article selected. Redirecting...</div>
  }

  return (
    <>
      <header className="w-full bg-pink-100 mb-6 rounded-md p-6 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-4xl font-extrabold border-b-4 border-gray-900 inline-block capitalize tracking-wide">
              {selectedCategory || 'NA'}
            </h1>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-10 gap-8">
        <main className="flex-1 max-w-full md:max-w-none">
          <button
            onClick={() => router.back()}
            className="mb-6 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 inline-flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
          <p className="text-gray-500 mb-4">
            By {selectedArticle.author || 'Unknown'} -{' '}
            {new Date(selectedArticle.publishedAt).toLocaleDateString()}
          </p>

          {selectedArticle.urlToImage && (
            <Image
              width={600}
              height={400}
              src={selectedArticle.urlToImage}
              alt={selectedArticle.title}
              className="w-full rounded mb-6 object-cover max-h-96"
              priority
            />
          )}

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <article className="text-lg leading-7 text-gray-800 whitespace-pre-line">
              {fullText || 'Loading content...'}
            </article>
          )}
        </main>

        <aside className="hidden md:block md:w-80 bg-gray-50 p-6 border-l border-gray-200 rounded-lg shadow-sm sticky top-10 h-fit">
          <h2 className="text-xl font-semibold mb-4">AI Summary</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-line">
              {aiSummary || 'Summary will appear here...'}
            </p>
          )}
        </aside>
      </div>
    </>
  )
}