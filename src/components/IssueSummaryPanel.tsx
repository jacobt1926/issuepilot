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
    <>
      {!summary && (
        <button type="button" onClick={handlePostRequest} disabled={loading}>
          {loading ? "Summarizing..." : "AI Summary"}
        </button>
      )}
      

        {summary && (
        <section>
          {summary.overview}
          <br/>
          <ul className="summarylist">
            {summary.keyDetails.map((individualDetail) => (
              <li key={individualDetail}>{individualDetail}</li>
            ))}
          </ul>
          <br/>
          <p>{summary.plainExplanation}</p>
          <br/>
          <p>{summary.firstStep}</p>
          <br/>
        </section>
        )}
    </>
  )
};

