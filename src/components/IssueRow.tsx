import React from 'react';
import { ExternalLink, MessageSquare, GitBranch } from 'lucide-react';
import type { GitHubIssue } from '../types/github';

interface IssueRowProps {
    issue: GitHubIssue;
}

export const IssueRow: React.FC<IssueRowProps> = ({ issue }) => {
    const createdAt = new Date(issue.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const repoName = issue.repository_url.split('/').slice(-2).join('/');
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

    return (
        <tr className="issue-row group">
            {/* Repo Info */}
            <td className="cell-repo">
                <div className="flex items-center gap-3">
                    <div className="repo-icon">
                        <GitBranch size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm truncate max-w-[140px]" title={repoName}>
                            {repoName}
                        </span>
                        <span className="text-[10px] text-text-dim uppercase tracking-wider font-bold">
                            #{issue.number}
                        </span>
                    </div>
                </div>
            </td>

            {/* Title & Labels */}
            <td className="cell-main">
                <div className="flex flex-col gap-1.5">
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="issue-title-link">
                        {issue.title}
                    </a>
                    <div className="flex flex-wrap gap-1.5">
                        {issue.labels?.slice(0, 4).map((label: any) => (
                            <span
                                key={label.id || label.name}
                                className="table-label"
                                style={{
                                    '--label-color': `#${label.color}`,
                                } as React.CSSProperties}
                            >
                                {label.name}
                            </span>
                        ))}
                        {(issue.labels?.length || 0) > 4 && (
                            <span className="table-label-more">
                                +{(issue.labels?.length || 0) - 4}
                            </span>
                        )}
                    </div>
                </div>
            </td>

            {/* Author */}
            <td className="cell-author">
                <div className="flex items-center gap-2" title={`Opened by ${issue.user?.login}`}>
                    <img src={issue.user?.avatar_url} alt="" className="w-6 h-6 rounded-full ring-2 ring-bg-elevated" />
                    <span className="text-sm font-medium text-text-muted truncate max-w-[100px]">
                        {issue.user?.login}
                    </span>
                </div>
            </td>

            {/* Comments */}
            <td className="cell-comments">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${issue.comments > 0 ? 'text-text-primary' : 'text-text-dim'}`}>
                    <MessageSquare size={14} className={issue.comments > 0 ? 'text-brand-primary' : ''} />
                    {issue.comments}
                </div>
            </td>

            {/* Date */}
            <td className="cell-date">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-text-muted">{createdAt}</span>
                    <span className="text-[10px] text-text-dim">{timeAgo(issue.created_at)}</span>
                </div>
            </td>

            {/* Action */}
            <td className="cell-action">
                <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                >
                    <ExternalLink size={16} />
                </a>
            </td>
        </tr>
    );
};
