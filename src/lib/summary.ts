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

export type IssueSummary = z.infer<typeof issueSummarySchema>;

