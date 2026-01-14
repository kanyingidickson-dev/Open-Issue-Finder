import React from 'react';
import { ExternalLink, MessageSquare, GitBranch, Copy, Check, Bookmark } from 'lucide-react';
import type { GitHubIssue } from '../types/github';

interface IssueRowProps {
    issue: GitHubIssue;
    isSaved: boolean;
    onToggleSave: (issue: GitHubIssue) => void;
}

const getLabelColor = (name: string, defaultColor: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('bug')) return 'ef4444'; // Red
    if (lower.includes('good first issue')) return 'a855f7'; // Purple
    if (lower.includes('help wanted')) return '22c55e'; // Green
    if (lower.includes('documentation')) return 'eab308'; // Yellow
    if (lower.includes('enhancement') || lower.includes('feature')) return '3b82f6'; // Blue
    if (lower.includes('question')) return 'd946ef'; // Magenta
    return defaultColor;
};

export const IssueRow: React.FC<IssueRowProps> = ({ issue, isSaved, onToggleSave }) => {
    const [copied, setCopied] = React.useState(false);

    const createdAt = new Date(issue.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const [owner, repo] = issue.repository_url.split('/').slice(-2);

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(issue.html_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSave(issue);
    }

    return (
        <tr className="issue-row group">
            {/* Repo Info */}
            <td className="cell-repo">
                <div className="flex items-center gap-3">
                    <div className="repo-icon" title={`${owner}/${repo}`}>
                        {/* Use owner avatar if possible, else icon */}
                        <img
                            src={`https://github.com/${owner}.png`}
                            alt=""
                            className="avatar-small"
                            style={{ borderRadius: '4px', border: 'none', width: '28px', height: '28px' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.classList.add('fallback-icon');
                            }}
                        />
                        <GitBranch size={14} className="hidden-fallback" style={{ display: 'none' }} />
                    </div>
                    <div className="flex flex-col" style={{ minWidth: 0 }}>
                        <span className="text-dim text-xs truncate" title={owner}>
                            {owner}
                        </span>
                        <span className="font-bold text-white text-sm truncate" title={repo}>
                            {repo}
                        </span>
                    </div>
                </div>
            </td>

            {/* Title & Labels */}
            <td className="cell-main">
                <div className="flex flex-col gap-1">
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="issue-title-link" title={issue.title}>
                        {issue.title}
                    </a>
                    <div className="flex flex-wrap gap-1.5">
                        {issue.state === 'closed' && (
                            <span className="table-label" style={{ '--label-color': '#a1a1aa' } as React.CSSProperties}>
                                Closed
                            </span>
                        )}
                        {issue.labels?.slice(0, 3).map((label: any) => (
                            <span
                                key={label.id || label.name}
                                className="table-label"
                                style={{
                                    '--label-color': `#${getLabelColor(label.name, label.color)}`,
                                } as React.CSSProperties}
                            >
                                {label.name}
                            </span>
                        ))}
                        {(issue.labels?.length || 0) > 3 && (
                            <span className="table-label-more" title={`+${(issue.labels?.length || 0) - 3} more labels`}>
                                +{(issue.labels?.length || 0) - 3}
                            </span>
                        )}
                    </div>
                </div>
            </td>

            {/* Author */}
            <td className="cell-author">
                <div className="flex items-center gap-2" title={`Opened by ${issue.user?.login}`}>
                    <img src={issue.user?.avatar_url} alt="" className="avatar-small" />
                    <span className="text-sm font-medium text-muted truncate">
                        {issue.user?.login}
                    </span>
                </div>
            </td>

            {/* Comments */}
            <td className="cell-comments">
                <div className={`flex items-center justify-center gap-1.5 text-xs font-bold ${issue.comments > 0 ? 'text-white' : 'text-dim'}`}>
                    <MessageSquare size={14} style={{ color: issue.comments > 0 ? 'var(--color-primary)' : 'inherit' }} />
                    {issue.comments}
                </div>
            </td>

            {/* Date */}
            <td className="cell-date">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-muted">{createdAt}</span>
                    <span className="text-dim" style={{ fontSize: '10px' }}>{timeAgo(issue.created_at)}</span>
                </div>
            </td>

            {/* Action */}
            <td className="cell-action">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={handleSave}
                        className="icon-btn"
                        title={isSaved ? "Remove from Saved" : "Save Issue"}
                        style={{ width: '28px', height: '28px', color: isSaved ? 'var(--color-primary)' : 'inherit' }}
                    >
                        <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="icon-btn"
                        title="Copy Link"
                        style={{ width: '28px', height: '28px' }}
                    >
                        {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                    </button>
                    <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn"
                        title="Open on GitHub"
                        style={{ width: '28px', height: '28px', color: 'var(--color-primary)' }}
                    >
                        <ExternalLink size={16} />
                    </a>
                </div>
            </td>
        </tr>
    );
};
