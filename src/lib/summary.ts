export type IssueSummary = {
    overview: string;
    plainExplanation: string;
    keyDetails: Array<string>;
    firstStep: string;

}

export type IssueSummaryInput = {
    title: string;
    body: string | null;
    labels: Array<string>;
}