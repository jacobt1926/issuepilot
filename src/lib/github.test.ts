import { describe, it, vi, expect, afterEach } from 'vitest';
import { fetchGitHubIssues } from './github';
import type { GitHubIssue } from './github';

describe('filter out pull requests when fetching issues', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    })

    it('successfully filters out pull requests', async () => {

        const mockIssue: GitHubIssue = {
            id: 1,
            number: 1,
            title: "A regular issue",
            html_url: "https://example.test/issues/1",
            body: null,
            labels: [],
        };

        const mockPullRequest: GitHubIssue = {
            id: 2,
            number: 2, 
            title: "A pull request",
            html_url: "https://example.test/pull/2",
            body: null,
            labels: [],
            pull_request: { url: "https://api.example.test/pulls/2"}
        }

        const mockResponse = {
            ok: true,
            json: async () => [mockIssue, mockPullRequest],
        };

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

        const result = await fetchGitHubIssues('testowner', 'testrepo');

        expect(result).toEqual([mockIssue])
        
    });

    it('throws when github resonds with an error', async () => {
        const mockResponse = {
            ok: false,
            json: async () => [],
        }

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

        await expect(
            fetchGitHubIssues('testowner', 'testrepo')

        ).rejects.toThrow('Results could not be fetched.');
    });

    it('throws when there is a network failure', async () => {

        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
        
        await expect(fetchGitHubIssues('testowner', 'testrepo')).rejects.toThrow('Failed to fetch');
    })
});