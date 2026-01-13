import React from 'react';
import { ExternalLink, MessageSquare, Clock, User } from 'lucide-react';
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

    return (
        <div className="glass p-6 rounded-2xl transition-all duration-300 hover:border-brand-primary/50 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-text-muted text-sm border-b border-transparent group-hover:border-text-muted/20 pb-1 transition-all">
                    <User size={14} />
                    <span>{issue.user?.login || 'anonymous'}</span>
                </div>
                <span className="text-text-muted text-xs flex items-center gap-1">
                    <Clock size={12} />
                    {createdAt}
                </span>
            </div>

            <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                {issue.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
                {issue.labels?.map((label: any) => (
                    <span
                        key={label.id}
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

            <div className="mt-auto flex justify-between items-center">
                <div className="flex items-center gap-3 text-text-muted text-sm">
                    <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {issue.comments}
                    </div>
                </div>
                <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-bg-accent hover:bg-brand-primary/20 hover:text-brand-primary transition-all"
                >
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
};
