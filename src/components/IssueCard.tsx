import React from 'react';
import { ExternalLink, MessageSquare, Clock, User, Folder } from 'lucide-react';
import type { GitHubIssue } from '../types/github';

interface IssueCardProps {
    issue: GitHubIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const createdAt = new Date(issue.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const repoName = issue.repository_url.split('/').slice(-2).join('/');

    return (
        <div className="glass p-6 rounded-2xl transition-all duration-300 hover:border-brand-primary/50 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-text-muted text-sm group-hover:text-text-secondary transition-colors">
                    <User size={14} />
                    <span>{issue.user?.login || 'anonymous'}</span>
                </div>
                <span className="text-text-muted text-xs flex items-center gap-1">
                    <Clock size={12} />
                    {createdAt}
                </span>
            </div>

            <div className="flex items-center gap-2 text-brand-primary/80 text-xs font-semibold uppercase tracking-wider mb-2">
                <Folder size={12} />
                <span>{repoName}</span>
            </div>

            <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                {issue.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
                {issue.labels?.map((label: any) => (
                    <span
                        key={label.id || label.name}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                        style={{
                            borderColor: `#${label.color}44`,
                            backgroundColor: `#${label.color}11`,
                            color: `#${label.color}`,
                        }}
                    >
                        {label.name}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-3 text-text-muted text-sm">
                    <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span>{issue.comments} comments</span>
                    </div>
                </div>
                <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-bg-accent hover:bg-brand-primary/20 hover:text-brand-primary transition-all flex items-center gap-2 text-sm font-medium"
                >
                    View Issue
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};
