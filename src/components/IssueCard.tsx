import type { GitHubIssue } from "@/lib/github";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";

export type IssueCardProps = {
    issue: GitHubIssue;
    owner: string;
    repo: string;
}

export default function IssueCard({
    issue,
    owner,
    repo,
}: IssueCardProps) {
    const description = issue.body?.trim() || "No description provided.";
    return (
        <li>
            <Link className="issue-row" href={`/repos/${owner}/${repo}/issues/${issue.number}`}>
                <span className="issue-status" aria-hidden="true">
                <span />
                </span>
                <div className="issue-content">
                    <h3>{issue.title}</h3>
                    <p>{owner}/{repo}<br/>#{issue.number}<span aria-hidden="true">·</span> <span className="issue-label">Open issue</span></p>
                    <MarkdownContent content={description} className="markdown-preview" disableLinks />
                    <div className="issue-labels">
                        {issue.labels.map((label) => (
                            <span style={{ borderColor: `#${label.color}` }} key={label.id} className="label-badge">{label.name}</span>
                        ))}
                    </div>
                </div>
                <span className="row-arrow" aria-hidden="true">↗</span>
            </Link>
        </li>
        
    );
}
