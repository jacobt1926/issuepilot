import { z } from "zod";

export type IssueSummaryInput = {
    title: string;
    body: string | null;
    labels: Array<string>;
}

export const issueSummarySchema = z.object({
    overview: z.string(),
    plainExplanation: z.string(),
    keyDetails: z.array(z.string()),
    firstStep: z.string()
})

export function isIssueSummaryInput(input: unknown): input is IssueSummaryInput {
        return (
            input !== null &&
            typeof input === 'object' &&
            'title' in input && typeof input.title === 'string' && input.title.length <= 300 &&
            'body' in input && ((typeof input.body === 'string' && input.body.length <= 10000) ||
            input.body === null) &&
            'labels' in input && Array.isArray(input.labels) && 
            input.labels.every((label: unknown) => typeof label === 'string')
        );
    }

export type IssueSummary = z.infer<typeof issueSummarySchema>;

