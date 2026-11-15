import { describe, it, expect } from 'vitest';
import { IssueSummaryInput, issueSummarySchema } from './summary';
import { isIssueSummaryInput } from './summary';

describe('issueSummarySchema validation', () => {
    it('succeeds when given a valid summary', () => {
        const validSummary = {
            overview: 'Test',
            plainExplanation: 'Thing doesnt work',
            keyDetails: ['test detail #1', 'test detail #2'],
            firstStep: 'another test'
        };

        const result = issueSummarySchema.safeParse(validSummary);

        expect(result.success).toBe(true);
    });

    it('fails when given an invalid summary', () => {
        const invalidSummary = {
            overview: 'Test',
            plainExplanation: 'Thing doesnt work',
            firstStep: 'Another test'
        }

        const result = issueSummarySchema.safeParse(invalidSummary);

        expect(result.success).toBe(false);
    });
});

describe('isIssueSummaryInput requests', () => {
    it('accepts valid request data', () => {
        const mockInput: IssueSummaryInput = {
            title: "test",
            body: 'test',
            labels: ['testlabel1', 'testlabel2'],
        };

        const result = isIssueSummaryInput(mockInput);

        expect(result).toBe(true);

    });

    it('rejects incorrect input', () => {
        const mockInput = {
            title: "test",
            body: 'test',
            labels: [100],
        };

        const result = isIssueSummaryInput(mockInput);

        expect(result).toBe(false);
    })

    it('rejects title input that is too long', () => {
        const mockInput = {
            title: `A very very very very very very very very very very very very very very very very very very 
            very very very very very very very very very very very very very very very very very very very very 
            very very very very very very very very very very very very very very very very very long sentence 
            that exceeds three hundred characters in total length.`,
            body: 'test',
            labels: ['label1', 'label2'],
        };

        const result = isIssueSummaryInput(mockInput);

        expect(result).toBe(false);

    })

    it('rejects body input that is too long', () => {
        const mockInput = {
            title: "test",
            body: "x".repeat(10_001),
            labels: ['label1', 'label2'],
        };

        const result = isIssueSummaryInput(mockInput);

        expect(result).toBe(false);
    })
})