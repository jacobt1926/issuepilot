import { vi, describe, it, expect } from "vitest";

vi.mock("openai", () => ({
  default: class FakeOpenAI {
    responses = {
      parse: async () => {
        throw new Error("OpenAI should not be called for invalid input");
      },
    };
  },
}));

import { POST } from "./route";

describe('post', () => {
    it("returns 400 for invalid JSON", async () => {
        const request = new Request("http://localhost/api/summarize", {
            method: "POST",
            body: "{",
        });

        const response = await POST(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Invalid JSON" });
    });

    it('throws an error for invalid JSON shape', async () => {
        const request = new Request("http://localhost/api/summarize", {
            method: "POST",
            body: JSON.stringify({
                title: "Issue title",
                body: "Issue details",
                labels: [100]
            })
        });

        const response = await POST(request);
        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: "Invalid request body"})
    });

    it('throws an error if the client fails', async () => {
        const request = new Request("http://localhost/api/summarize", {
            method: "POST",
            body: JSON.stringify({
                title: "Issue title",
                body: "Issue details",
                labels: ['label1', 'label2']
            })
        });
        
        const response = await POST(request)
        
        expect(response.status).toBe(502);
        expect( await response.json()).toEqual({
            error: "Unable to generate summary."
        });
        
    });
});