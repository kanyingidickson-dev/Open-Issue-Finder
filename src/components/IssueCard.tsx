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
        <div className="glass-card p-6 rounded-[1.5rem] transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.02] group flex flex-col h-full relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-brand-primary/10 transition-colors" />

            {/* Header: User & Date */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-border-subtle overflow-hidden">
                        <img src={issue.user?.avatar_url} alt={issue.user?.login} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-primary leading-tight">{issue.user?.login || 'anonymous'}</span>
                        <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                            <Clock size={10} /> {createdAt}
                        </span>
                    </div>
                </div>
                <div className="p-2 rounded-lg bg-bg-accent/50 border border-border-subtle group-hover:border-brand-primary/50 transition-all">
                    <Terminal size={14} className="text-text-muted group-hover:text-brand-primary" />
                </div>
            </div>

            {/* Content: Title & Repo */}
            <div className="mb-6 flex-grow">
                <div className="flex items-center gap-1.5 text-brand-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                    <GitBranch size={12} />
                    <span className="truncate max-w-[200px]">{repoName}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 mb-4">
                    {issue.title}
                </h3>
            </div>

            {/* Labels */}
            <div className="flex flex-wrap gap-2 mb-8">
                {issue.labels?.slice(0, 3).map((label: any) => (
                    <span
                        key={label.id || label.name}
                        className="px-3 py-1 rounded-full text-[10px] font-bold border border-white/[0.05] transition-colors"
                        style={{
                            backgroundColor: `#${label.color}15`,
                            color: `#${label.color}`,
                        }}
                    >
                        {label.name}
                    </span>
                ))}
                {(issue.labels?.length || 0) > 3 && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold text-text-muted bg-white/[0.05]">
                        +{(issue.labels?.length || 0) - 3}
                    </span>
                )}
            </div>

            {/* Footer: Metadata & Link */}
            <div className="mt-auto pt-6 border-t border-white/[0.05] flex justify-between items-center">
                <div className="flex items-center gap-4 text-text-muted">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <MessageSquare size={14} className="text-brand-primary" />
                        {issue.comments} <span className="text-[10px] font-normal opacity-60">COMMENTS</span>
                    </div>
                </div>
                <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-white bg-white/[0.05] hover:bg-brand-primary py-2 px-4 rounded-xl transition-all active:scale-95"
                >
                    Review Issue
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};
