'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [request, setRequest] = useState<{days?: string, city?: string}>({})
  let [itenerary, setItenerary] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  async function hitAPI() {
    if (!request.city || !request.days) return
    setMessage('Building itenerary...')
    setLoading(true)
    setItenerary('')

    setTimeout(() => {
      setMessage('Almost there ...')
    }, 8000)

    const response = await fetch('/api/get-itenerary', {
      method: 'POST',
      body: JSON.stringify({
        days: request.days,
        city: request.city
      })
    })
    const json = await response.json()
    
    const response2 = await fetch('/api/get-points-of-interest', {
      method: 'POST',
      body: JSON.stringify({
        pointsOfInterestPrompt: json.pointsOfInterestPrompt,
      })
    })
    const json2 = await response2.json()

    let pointsOfInterest = JSON.parse(json2.pointsOfInterest)
    let itenerary = json.itenerary

    pointsOfInterest.map(point => {
      // itenerary = itenerary.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)}">${point}</a>`)
      itenerary = itenerary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)})`)
    })

    setItenerary(itenerary)
    setLoading(false)
  }
  
  let days = itenerary.split('Day')
  days.shift()

  console.log('itenerary: ', itenerary)

  return (
    <main>
      <div style={styles.container}>
        <h1 style={styles.header}>GPT Travel Buddy</h1>
        <div style={styles.formContainer}>
          <input style={styles.input}  placeholder="City" onChange={e => setRequest(request => ({
            ...request, city: e.target.value
          }))} />
          <input style={styles.input} placeholder="Days" onChange={e => setRequest(request => ({
            ...request, days: e.target.value
          }))} />
          <button className="input-button"  onClick={hitAPI}>Build Itenerary</button>
        </div>
        <div style={styles.resultsContainer}>
        {
          loading && (
            <p>{message}</p>
          )
        }
        {
          itenerary && days.map((day, index) => (
            // <p
            //   key={index}
            //   style={{marginBottom: '20px'}}
            //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
            // />
            <div style={{marginBottom: '30px'}}
            >
              <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: props => {
                    return <a target="_blank" rel="no-opener" href={props.href}>{props.children}</a>
                }
            }}
              >
                {`Day ${day}`}
                </ReactMarkdown>
            </div>
          ))
        }

        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as 'center',
    marginTop: '50px',
    color: '#c683ff'
  },
  input: {
    padding: '6px 10px',
    marginBottom: '4px',
    outline: 'none',
    width: '100%'
  },
  container: {
    padding: '20px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '500px',
    margin: '30px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(198, 131, 255, .2)',
    borderRadius: '10px'
  },
  resultsContainer: {
    padding: '30px 140px'
  },
  result: {
    color: 'white'
  }
}
