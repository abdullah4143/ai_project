import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { text } = await request.json()

  try {
    // Call your Flask paraphrasing endpoint
    const flaskResponse = await fetch('https://17b7-35-221-51-235.ngrok-free.app/paraphrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paragraph: text }),
    })

    if (!flaskResponse.ok) {
      throw new Error('Failed to paraphrase text')
    }

    const data = await flaskResponse.json()
    return NextResponse.json({ paraphrased: data.paraphrased })
    
  } catch (error) {
    console.error('Error calling paraphrase API:', error)
    return NextResponse.json(
      { error: 'Failed to paraphrase content' },
      { status: 500 }
    )
  }
}