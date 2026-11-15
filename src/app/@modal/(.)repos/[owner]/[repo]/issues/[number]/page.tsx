import Link from "next/link";
import { fetchGitHubIssue } from "@/lib/github";
import type { GitHubIssue } from "@/lib/github";
import SummarizeIssue from "@/components/IssueSummaryPanel";
import MarkdownContent from "@/components/MarkdownContent";

export const instant = false;

export default async function Backdrop({ params }: PageProps<"/repos/[owner]/[repo]/issues/[number]">) {
    const { owner, repo, number } = await params;
    let details: GitHubIssue | null = null;
    try {
        details = await fetchGitHubIssue(owner, repo, number);
    } catch {
        details = null;
    }

    const description = details?.body?.trim() || "No description provided.";

    return (
        <div className="issue-modal-backdrop">
            <section
                className="issue-modal detail-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby={details ? "modal-issue-title" : undefined}
                aria-label={details ? undefined : "Issue preview"}
            >
                {details ? (
                    <>
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

                        <h1 className="detail-title" id="modal-issue-title">{details.title}</h1>

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
                        <section className="detail-description" aria-labelledby="modal-description-heading">
                            <h2 id="modal-description-heading">Description</h2>
                            <MarkdownContent content={description} />
                        </section>

                        <SummarizeIssue
                            input={{
                                title: details.title,
                                body: details.body,
                                labels: details.labels.map((label) => label.name),
                            }}
                        />
                    </>
                ) : (
                    <p role="alert">Issue details couldn&apos;t load.</p>
                )}
                <Link className="detail-back-link issue-modal-back-link" href={`/?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`}>
                    <span aria-hidden="true">←</span> Back to {owner}/{repo}
                </Link>
            </section>
        </div>
);
}
