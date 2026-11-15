import { fetchGitHubIssue } from "@/lib/github";
import Link from "next/link";
import SummarizeIssue from "@/components/IssueSummaryPanel";
import MarkdownContent from "@/components/MarkdownContent";

export default async function IssuePage({ params }: PageProps<"/repos/[owner]/[repo]/issues/[number]">) {
  const { owner, repo, number } = await params;
  let details;

  try {
    details = await fetchGitHubIssue(owner, repo, number);
  } catch {
    return (
      <main className="workspace issue-detail-workspace">
        <Link className="detail-back-link" href={`/?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`}>
          <span aria-hidden="true">←</span> Back to {owner}/{repo}
        </Link>
        <section className="detail-card detail-error" role="alert">
          <span className="detail-eyebrow">ISSUEPILOT</span>
          <h1>We couldn&apos;t load this issue</h1>
          <p>Check the repository and issue number, then try again.</p>
        </section>
      </main>
    );
  }

  const description = details.body?.trim() || "No description provided.";

  return (
    <main className="workspace issue-detail-workspace">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href={`/?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`}>
          <span aria-hidden="true">←</span> {owner}/{repo}
        </Link>
        <span aria-hidden="true">/</span>
        <span>Issue #{details.number}</span>
      </nav>

      <article className="detail-card">
        <div className="detail-card-header">
          <div className="detail-eyebrow">
            <span className="detail-open-dot" /> OPEN ISSUE
            <span className="detail-header-dot" aria-hidden="true">·</span>
            <span className="detail-header-repository">{owner}/{repo}</span>
            <span className="detail-header-dot" aria-hidden="true">·</span>
            #{details.number}
          </div>
          <a className="detail-github-link" href={details.html_url} target="_blank" rel="noreferrer">
            View on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>

        <h1 className="detail-title">{details.title}</h1>

        {details.labels.length > 0 && (
          <div className="detail-labels" aria-label="Issue labels">
            {details.labels.map((label) => (
              <span key={label.id} className="label-badge" style={{ borderColor: `#${label.color}` }}>
                {label.name}
              </span>
            ))}
          </div>
        )}

        <div className="detail-divider-line" />
        <section className="detail-description" aria-labelledby="description-heading">
          <h2 id="description-heading">Description</h2>
          <MarkdownContent content={description} />
        </section>

        <SummarizeIssue
          input={{
            title: details.title,
            body: details.body,
            labels: details.labels.map((label) => label.name),
          }}
        />
      </article>
    </main>
  );
}
