import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { text, max_sentences = 3 } = await request.json()

  try {
    const flaskResponse = await fetch('https://17b7-35-221-51-235.ngrok-free.app/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paragraph: text,
        bullet_count: max_sentences
      }),
    })

    if (!flaskResponse.ok) {
      throw new Error('Flask API error')    
    }

    const data = await flaskResponse.json()
    return NextResponse.json({ summary: data.join('\n') })
    
  } catch (error) {
    console.error('Error calling Flask API:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}