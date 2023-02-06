'use client'

import React, { useState, useEffect } from "react";
import { AccessPass, Membership, Plan } from "@whop-sdk/core";
import { usePurchaseLink } from "@/lib/get-purchase-link";
import { useSearchParams } from 'next/navigation';
import { setCookie, getCookie } from "cookies-next";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

const RECOMMENDED_PLAN = process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID || "";

type PassGatedProps =
  | {
      membership: Membership;
      pass: null;
      plan: null;
    }
  | {
      membership: null;
      pass: AccessPass;
      plan: Plan;
    }
  | {
    membership: boolean;
  }

export default function Home({membership: initialMembership}: PassGatedProps) {
  let [membership, setMembership] = useState(initialMembership);
  const cookieVal = getCookie('membership')
  if (cookieVal && !membership){
    setMembership(true)
  }
  const searchParams = useSearchParams();
  const membershipId = searchParams.get('membershipId');
  const [request, setRequest] = useState<{days?: string, city?: string}>({})
  let [itinerary, setItinerary] = useState<string>('')
  const paidLink = usePurchaseLink(RECOMMENDED_PLAN);

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!membershipId || membership) return;
    fetchMembership();
  }, [membershipId]);

  const fetchMembership = async () => {
    const response = await fetch("api/fetchMembership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ membershipId }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error("Something went wrong");
      })
      .then((responseJson) => {
        if (
          responseJson.plan === process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID ||
          responseJson.plan === process.env.NEXT_PUBLIC_PAID_RECOMMENDED_PLAN_ID
        ) {
          setCookie("membership", true);
          setMembership(true);
        } else {
          setCookie("membership", false);
          setMembership(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function hitAPI() {
    if (!request.city || !request.days) return
    setMessage('Building itinerary...')
    setLoading(true)
    setItinerary('')

    setTimeout(() => {
      setMessage('Getting closer ...')
    }, 7000)

    setTimeout(() => {
      setMessage('Almost there ...')
    }, 15000)

    const response = await fetch('/api/get-itinerary', {
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
    let itinerary = json.itinerary

    console.log('pointsOfInterest: ', pointsOfInterest)

    pointsOfInterest.map(point => {
      // itinerary = itinerary.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)}">${point}</a>`)
      itinerary = itinerary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)})`)
    })

    setItinerary(itinerary)
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
        <h1 style={styles.header}>GPTravel Advisor</h1>
        <div style={styles.formContainer} className="form-container">
        {membership ? (
            <>
            <input style={styles.input}  placeholder="City" onChange={e => setRequest(request => ({
              ...request, city: e.target.value
            }))} />
            <input style={styles.input} placeholder="Days" onChange={e => setRequest(request => ({
              ...request, days: e.target.value
            }))} />
            <button className="input-button"  onClick={hitAPI}>Build Itinerary</button>
            </>
            ) : (
              <a href={paidLink}>
                <button className="input-button">Get Access for $5</button>
              </a>
            )}
        </div>
        <div className="results-container">
        {
          loading && (
            <p>{message}</p>
          )
        }
        {
          itinerary && days.map((day, index) => (
            // <p
            //   key={index}
            //   style={{marginBottom: '20px'}}
            //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
            // />
            <div
              style={{marginBottom: '30px'}}
              key={index}
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
    marginTop: '80px',
    color: '#c683ff',
    fontSize: '44px'
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
    margin: '30px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(198, 131, 255, .2)',
    borderRadius: '10px'
  },
  result: {
    color: 'white'
  }
}
