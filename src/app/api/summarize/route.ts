import type { IssueSummary, IssueSummaryInput } from "@/lib/summary"

export async function POST(request: Request) {
    
    let issueInput: unknown;

    function isIssueSummaryInput(input: unknown): input is IssueSummaryInput {
        return (
            input !== null &&
            typeof input === 'object' &&
            'title' in input && typeof input.title === 'string' &&
            'body' in input && (typeof input.body === 'string' ||
            input.body === null) &&
            'labels' in input && Array.isArray(input.labels) && 
            input.labels.every((label: unknown) => typeof label === 'string')
        );
    }

    try {
        issueInput= await request.json()
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid JSON" }), 
            {
                status: 400,
            }
        );
    }

    if (!isIssueSummaryInput(issueInput)) {
        return new Response(
            JSON.stringify({ error: "Invalid request body" }), 
            {
                status: 400,
            }
        );
    }

    const summary: IssueSummary = {
        overview: issueInput.title,
        plainExplanation: "Thing that does an important thing",
        keyDetails: issueInput.labels,
        firstStep: "Do this thing 1000 times"
    }

    return Response.json(summary);
}