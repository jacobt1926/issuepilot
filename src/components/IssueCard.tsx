import type { GitHubIssue } from "@/lib/github";

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
    let preview: string;
    if (description.length > 180) {
    preview = description.slice(0, 180) + "...";
    } else {
    preview = description;
    }
    return (
        <li>
            <a className="issue-row" href={issue.html_url}>
                <span className="issue-status" aria-hidden="true">
                <span />
                </span>
                <div className="issue-content">
                    <h3>{issue.title}</h3>
                    <p>{owner}/{repo}<br/>#{issue.number}<span aria-hidden="true">·</span> <span className="issue-label">Open issue</span></p>
                    <p>{preview}</p>
                    <div className="issue-labels">
                        {issue.labels.map((label) => (
                        <span style={{ borderColor: `#${label.color}` }} key={label.id} className="label-badge">{label.name}</span>
                        ))}
                    </div>
                </div>
                <span className="row-arrow" aria-hidden="true">↗</span>
            </a>
        </li>
    );
}