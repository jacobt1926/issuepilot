'use client';
import type { IssueSummary, IssueSummaryInput } from "@/lib/summary";
import React, { useState } from "react";



export default function SummarizeIssue({ input}: {input: IssueSummaryInput}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<IssueSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handlePostRequest = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    setErrorMessage(null)
    setLoading(true);
    
    try {
      // 2. Configure fetch with POST method, headers, and body
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: IssueSummary = await response.json();
      setSummary(result);
    } catch (error) {
      setErrorMessage("Failed to load summary.")
    } finally {
      setLoading(false);

    }

  };
    

  return(
    <div className="summary-assistant">
      {!summary && (
        <button className="summary-button" type="button" onClick={handlePostRequest} disabled={loading}>
          <span className="summary-button-icon" aria-hidden="true">✦</span>
          <span className="summary-button-copy">
            <span className="summary-button-title">
              {loading ? "Creating your summary..." : "Generate AI summary"}
            </span>
            <span className="summary-button-caption">
              {loading ? "This may take a few seconds" : "Get a clear, contributor-friendly overview"}
            </span>
          </span>
          {!loading && <span className="summary-button-arrow" aria-hidden="true">→</span>}
        </button>
      )}

      {errorMessage && <p className="summary-error" role="alert">{errorMessage}</p>}

      {summary && (
        <section className="summary-result" aria-labelledby="summary-heading">
          <header className="summary-result-heading">
            <div>
              <span className="summary-kicker">ISSUEPILOT SUMMARY</span>
              <h2 id="summary-heading">A clearer path into this issue</h2>
            </div>
            <span className="summary-sparkle" aria-hidden="true">✦</span>
          </header>

          <div className="summary-grid">
            <section className="summary-block summary-overview">
              <h3>Overview</h3>
              <p>{summary.overview}</p>
            </section>

            <section className="summary-block">
              <h3>In plain language</h3>
              <p>{summary.plainExplanation}</p>
            </section>

            <section className="summary-block summary-details">
              <h3>Key details</h3>
              <ul className="summarylist">
                {summary.keyDetails.map((individualDetail) => (
                  <li key={individualDetail}>{individualDetail}</li>
                ))}
              </ul>
            </section>

            <section className="summary-block summary-first-step">
              <h3>Suggested first step</h3>
              <p>{summary.firstStep}</p>
            </section>
          </div>
        </section>
      )}
    </div>
  )
};

