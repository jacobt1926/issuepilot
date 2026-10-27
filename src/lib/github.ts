export type repoInfo = {
  name: string;
  owner: string;
}

export type GitHubIssue = {
  id: number;
  title: string;
  html_url: string;
  pull_request?: { url: string };
};

export async function fetchGitHubIssues(
    owner: string,
    repo: string,
): Promise<GitHubIssue[]> {
    "use cache"
    const apiURL: string = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`;

    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Results could not be fetched.");
    const issues: GitHubIssue[] = await response.json();
    
    const actualIssues = issues.filter((issue) => !issue.pull_request);

    return actualIssues;

}
