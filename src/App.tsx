import { useState, useEffect } from 'react'
import ClipperForm from './components/ClipperForm'
import './App.css'

function App() {
  const [params, setParams] = useState<{ title?: string, text?: string, url?: string } | null>(null)

  useEffect(() => {
    // Check for search params
    const searchParams = new URLSearchParams(window.location.search)

    // Web Share Target usually sends params
    if (searchParams.has('title') || searchParams.has('text') || searchParams.has('url')) {
      setParams({
        title: searchParams.get('title') || '',
        text: searchParams.get('text') || '',
        url: searchParams.get('url') || ''
      })
    }
  }, [])

  return (
    <div className="app-container">
      {params ? (
        <ClipperForm
          initialTitle={params.title}
          initialText={params.text}
          initialUrl={params.url}
        />
      ) : (
        <div className="home-screen">
          <h1>Obsidian Clipper</h1>
          <p>Share a page to this app to clip it.</p>
          <div className="instructions">
            <p><strong>How to use:</strong></p>
            <ol>
              <li>Open a web page in Chrome</li>
              <li>Tap "Share"</li>
              <li>Select "Obsidian Clipper"</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
