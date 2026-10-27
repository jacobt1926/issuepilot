import Link from "next/link";
import {fetchGitHubIssues} from "@/lib/github";
import {GitHubIssue} from "@/lib/github";
import {repoInfo} from "@/lib/github";

export default async function Home({ searchParams}: PageProps<"/">) {
  
  const query = await searchParams;

  const owner = typeof query.owner === "string" ? query.owner.trim(): "facebook";
  const repo = typeof query.repo === "string" ? query.repo.trim(): "react";
  const invalidInput = owner.length === 0 || repo.length === 0;



  const namingInfo: repoInfo = {
    owner: owner,
    name: repo
  };

  const githubRepoURL: string = `https://github.com/${namingInfo.owner}/${namingInfo.name}`
  let failed = false;
  let issues: GitHubIssue[] = []
  let inputMessage = null;

  if (!invalidInput) {
    try {
    issues = await fetchGitHubIssues(namingInfo.owner, namingInfo.name);
  } catch {
    // Keep the page shell visible when the request or JSON parsing fails.
    failed = true;
  }
  } else {
    inputMessage = (
      <p role="alert">Enter both a repository owner and name.</p>
    );  
  }



  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" href="/" aria-label="IssuePilot home"><span className="brand-mark" aria-hidden="true">↗</span>IssuePilot<span className="preview-badge">PREVIEW</span></Link>
        <a className="quiet-link" href={`${githubRepoURL}/issues`}>View on GitHub ↗</a>
      </header>
      <main className="workspace">
        <div className="page-intro">
          <div className="eyebrow"><span className="status-dot" /> YOUR DEVELOPMENT WORKSPACE</div>
          <h1>A little clarity.<br /><span>A better place to start.</span></h1>
          <p>Explore open issues and find your next contribution.<br />One repository, one step at a time.</p>
        </div>
        <form action="/" method="get">
          <input id="owner" name="owner" required defaultValue={owner}/><label htmlFor="owner">Repo Owner</label>
          <input id="repo" name="repo" required defaultValue={repo}/><label htmlFor="repo">Repo Name</label>
          <button type="submit">Load issues</button>

        </form>
        {inputMessage}
        {!invalidInput && (
          <>
            <section className="repository-panel" aria-labelledby="repository-heading">
            <div className="repository-details"><span className="repository-icon" aria-hidden="true">⌘</span><div><div className="eyebrow">CURRENT REPOSITORY</div><h2 id="repository-heading"><span>{namingInfo.owner} /</span> {namingInfo.name}</h2></div></div>
            <span className="public-badge"><span className="status-dot" /> Public repository</span>
          </section>
          <section className="issues-panel" aria-labelledby="issues-heading">
            <div className="section-header"><div className="section-title"><h2 id="issues-heading">Open issues</h2>{!failed && <span className="count-badge">{issues.length}</span>}</div><span className="section-caption">Latest from GitHub</span></div>
            {/* A failed request takes precedence over an empty result set. */}
            {failed ? (
              <div className="empty-state" role="status"><h3>A small interruption</h3><p>Something went wrong loading issues. Please try again later.</p>
                <form method="get">
                  <input type="hidden" name="owner" value={owner}/>
                  <input type="hidden" name="repo" value={repo} />
                  <button className="retry-link" type="submit">Try again ↗</button>
                </form>
              </div>
              ) : issues.length === 0 ? (
                <div className="empty-state"><h3>Nothing to show just yet</h3><p>No open issues found in these results.</p></div>
              ) : (
                <ul className="issue-list">{issues.map((issue) => (
                  <li key={issue.id}><a className="issue-row" href={issue.html_url}><span className="issue-status" aria-hidden="true"><span /></span><div className="issue-content"><h3>{issue.title}</h3><p>{namingInfo.owner}/{namingInfo.name} <span aria-hidden="true">·</span> <span className="issue-label">Open issue</span></p></div><span className="row-arrow" aria-hidden="true">↗</span></a></li>
                ))}</ul>
              )}
              <div className="panel-footer"><span>Latest 5 entries · Pull requests excluded</span><a href={`${githubRepoURL}/issues`}>All issues ↗</a></div>
            </section>
          </>
        )}
        
        <div className="workspace-note"><span aria-hidden="true">✦</span><p>Small contributions make a difference. Start with something that sparks your curiosity.</p></div>
      </main>
      <footer className="app-footer"><span>IssuePilot</span><span>A calmer way to find your next contribution.</span></footer>
    </div>
  );
}


