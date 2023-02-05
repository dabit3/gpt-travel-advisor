"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [request, setRequest] = useState<{ days?: string; city?: string }>({});
  let [itinerary, setItinerary] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function hitAPI() {
    if (!request.city || !request.days) return;
    setMessage("Building itinerary...");
    setLoading(true);
    setItinerary("");

    setTimeout(() => {
      setMessage("Almost there ...");
    }, 8000);

    const response = await fetch("/api/get-itinerary", {
      method: "POST",
      body: JSON.stringify({
        days: request.days,
        city: request.city,
      }),
    });
    const json = await response.json();

    const response2 = await fetch("/api/get-points-of-interest", {
      method: "POST",
      body: JSON.stringify({
        pointsOfInterestPrompt: json.pointsOfInterestPrompt,
      }),
    });
    const json2 = await response2.json();

    let pointsOfInterest = JSON.parse(json2.pointsOfInterest);
    let itinerary = json.itinerary;

    pointsOfInterest.map((point) => {
      // itinerary = itinerary.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)}">${point}</a>`)
      itinerary = itinerary.replace(
        point,
        `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + " " + request.city)})`
      );
    });

    setItinerary(itinerary);
    setLoading(false);
  }

  let days = itinerary.split("Day");
  days.shift();

  console.log("itinerary: ", itinerary);

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header}>GPTravel Advisor</h1>
        <div style={styles.formContainer} className="form-container">
          <input
            style={styles.input}
            placeholder="City"
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                city: e.target.value,
              }))
            }
          />
          <input
            style={styles.input}
            placeholder="Days"
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                days: e.target.value,
              }))
            }
          />
          <button className="input-button" onClick={hitAPI}>
            Build Itinerary
          </button>
        </div>
        <div className="results-container">
          {loading && <p>{message}</p>}
          {itinerary &&
            days.map((day, index) => (
              // <p
              //   key={index}
              //   style={{marginBottom: '20px'}}
              //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
              // />
              <div style={{ marginBottom: "30px" }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: (props) => {
                      return (
                        <a target="_blank" rel="no-opener" href={props.href}>
                          {props.children}
                        </a>
                      );
                    },
                  }}
                >
                  {`Day ${day}`}
                </ReactMarkdown>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

const styles = {
  header: {
    textAlign: "center" as "center",
    marginTop: "80px",
    color: "#c683ff",
    fontSize: "44px",
  },
  input: {
    padding: "10px 14px",
    marginBottom: "4px",
    outline: "none",
    fontSize: "16px",
    width: "100%",
    borderRadius: "8px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    margin: "30px auto 0px",
    padding: "20px",
    boxShadow: "0px 0px 12px rgba(198, 131, 255, .2)",
    borderRadius: "10px",
  },
  result: {
    color: "white",
  },
};
