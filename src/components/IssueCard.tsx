import React from 'react';
import { ExternalLink, MessageSquare, Clock, GitBranch, Terminal } from 'lucide-react';
import type { GitHubIssue } from '../types/github';

interface IssueCardProps {
    issue: GitHubIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const createdAt = new Date(issue.created_at).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });

    const repoName = issue.repository_url.split('/').slice(-2).join('/');

    return (
        <div className="issue-card">
            {/* Background Accent */}
            <div className="glow" />

            {/* Header: User & Date */}
            <div className="card-header">
                <div className="user-info">
                    <img className="avatar" src={issue.user?.avatar_url} alt={issue.user?.login} loading="lazy" />
                    <div className="user-details">
                        <span className="username">{issue.user?.login || 'anonymous'}</span>
                        <span className="post-date">
                            <Clock size={10} style={{ marginRight: '4px', display: 'inline' }} /> {createdAt}
                        </span>
                    </div>
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>
                    <Terminal size={14} />
                </div>
            </div>

            {/* Content: Title & Repo */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="repo-badge">
                    <GitBranch size={12} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {repoName}
                    </span>
                </div>
                <h3 className="issue-title">
                    {issue.title}
                </h3>

                {/* Labels */}
                <div className="label-container">
                    {issue.labels?.slice(0, 3).map((label: any) => (
                        <span
                            key={label.id || label.name}
                            className="issue-label"
                            style={{
                                backgroundColor: `#${label.color}15`,
                                color: `#${label.color}`,
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                    {(issue.labels?.length || 0) > 3 && (
                        <span className="issue-label" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                            +{(issue.labels?.length || 0) - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer: Metadata & Link */}
            <div className="card-footer">
                <div className="meta-item">
                    <MessageSquare size={14} style={{ color: 'var(--color-primary)' }} />
                    {issue.comments} <span style={{ opacity: 0.6, fontWeight: 400 }}>COMMENTS</span>
                </div>
                <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="review-btn"
                >
                    Review Issue
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};
