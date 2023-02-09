'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LoadingDots from '@components/LoadingDots';
import { PoppinsFont } from './layout';

export default function Home() {
  const [request, setRequest] = useState<{ days?: string, city?: string }>({})
  const [itinerary, setItinerary] = useState<string>('')

  useEffect(() => {
    checkRedirect()
  }, [])

  function checkRedirect() {
    if (window.location.hostname === 'gpt-travel-advisor.vercel.app') {
      window.location.replace('https://www.roamaround.io/')
    }
  }

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const hitAPI = async () => {
    if (!request.city || !request.days) return
    setLoading(true)
    setItinerary('')

    const response = await fetch('/api/get-itinerary', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        days: request.days,
        city: request.city
      })
    })

    if (!response.ok) {
      setMessage('Something went wrong. Please try again.')
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setItinerary((prev) => prev + chunkValue);
    }

    setLoading(false)
  }

  let days = itinerary.split('Day')

  if (days.length > 1) {
    days.shift()
  } else {
    days[0] = "1" + days[0]
  }

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header} className={`hero-header ${PoppinsFont.className}`}>Roam Around</h1>
        <div style={styles.formContainer} className="form-container">
          <input style={styles.input} placeholder="City" onChange={e => setRequest(request => ({
            ...request, city: e.target.value
          }))} />
          <input style={styles.input} placeholder="Days" onChange={e => setRequest(request => ({
            ...request, days: e.target.value
          }))} />
          {loading ? (
            <button className="input-button">
              <LoadingDots color="white" style="large" />
            </button>
          ) : (
            <button className="input-button" onClick={hitAPI}>Build Itinerary</button>
          )}
        </div>
        <div className="results-container">
          {
            message && (
              <p>{message}</p>
            )
          }
          <div className="space-y-8 my-10">
            {
              itinerary && days.map((day, index) => (
                <div
                  key={index}
                  className='text-white'
                  dangerouslySetInnerHTML={{ __html: `Day ${day}` }}
                />
              ))
            }
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as 'center',
    marginTop: '60px',
    color: '#c683ff',
    fontWeight: '900',
    // fontFamily: 'Poppins',
    fontSize: '68px'
  },
  input: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '20px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(198, 131, 255, .2)',
    borderRadius: '10px'
  },
  result: {
    color: 'white'
  }
}
