import Link from "next/link";
import { fetchGitHubIssue } from "@/lib/github";
import type { GitHubIssue } from "@/lib/github";

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
            <section className="issue-modal" role="dialog" aria-modal="true">
                {details ? (
                    <>
                        <h1>{details.title}</h1>
                        <br/>
                        <p>{details.number}</p>
                        <br/>
                        <p>{description}</p>
                        <br/>
                        <div className="detail-labels" aria-label="Issue labels">
                            {details.labels.map((label) => (
                                <span key={label.id} className="label-badge" style={{ borderColor: `#${label.color}` }}>
                                    {label.name}
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <p role="alert">Issue details couldn&apos;t load.</p>
                )}
                <br/>
                <Link href={`/?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`}>
                    ← Back to repository
                </Link>
            </section>
        </div>
);
}