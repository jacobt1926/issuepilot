type GitHubIssue = {
  id: number;
  title: string;
  html_url: string;
  pull_request?: {
    url: string;
  }
}



export default async function Home() {

  const response = await fetch("https://api.github.com/repos/facebook/react/issues?state=open&per_page=5")
  if (!response.ok) {
    return (
      <main>
        <p>Couldn&apos;t load GitHub issues. Please try again later.</p>
      </main>
    )
  };
  const issues: GitHubIssue[] = await response.json()
  const actualIssues = issues.filter((issue) => !issue.pull_request)

  if (actualIssues.length === 0) {
    return (
      <main>
        <p>No open issues found.</p>
      </main>
    )
  }

  return (
    <div>
      <main>
        <h1>IssuePilot</h1>
        <p>Issue pilot is a development tool that shows you the issues that matter most, and gives you guidance on fixing them.</p>
        <ul>
          {actualIssues.map((issue) => (
            <li key={issue.id}><a href={issue.html_url}>{issue.title}</a></li>
          ))}
        </ul>
      </main>
    </div>
  );
}
