import React from 'react';
import { Search, Hash, Code2, Layers, RefreshCcw } from 'lucide-react';

interface FilterBarProps {
    onFilterChange: (filters: { language?: string; label?: string; query?: string }) => void;
    isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, isLoading }) => {
    const [query, setQuery] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [label, setLabel] = React.useState('good first issue');

    const languages = [
        { label: 'All Languages', value: '' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Rust', value: 'rust' },
        { label: 'Go', value: 'go' },
        { label: 'Java', value: 'java' },
        { label: 'C++', value: 'cpp' },
    ];

    const labels = [
        { label: 'Good First Issue', value: 'good first issue' },
        { label: 'Help Wanted', value: 'help wanted' },
        { label: 'Bug', value: 'bug' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Enhancement', value: 'enhancement' },
    ];

    const handleFilterUpdate = (updates: Partial<{ query: string; language: string; label: string }>) => {
        const newQuery = updates.query !== undefined ? updates.query : query;
        const newLanguage = updates.language !== undefined ? updates.language : language;
        const newLabel = updates.label !== undefined ? updates.label : label;

        onFilterChange({ query: newQuery, language: newLanguage, label: newLabel });
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)] hidden lg:flex flex-col border-r border-border-subtle bg-bg-surface/50 backdrop-blur-xl z-30 overflow-y-auto">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                        <Code2 className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">IssueFinder</h1>
                        <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.2em]">v1.0.0</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Search Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Search size={12} /> Search
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Keywords..."
                                className="w-full bg-bg-elevated border border-border-subtle rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-primary transition-all pr-10 focus:ring-4 focus:ring-brand-primary/10"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    handleFilterUpdate({ query: e.target.value });
                                }}
                            />
                            {isLoading && (
                                <RefreshCcw className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary animate-spin" size={16} />
                            )}
                        </div>
                    </div>

                    {/* Language Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Layers size={12} /> Languages
                        </label>
                        <div className="grid grid-cols-1 gap-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.value}
                                    onClick={() => {
                                        setLanguage(lang.value);
                                        handleFilterUpdate({ language: lang.value });
                                    }}
                                    className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${language === lang.value
                                        ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary font-semibold'
                                        : 'text-text-secondary hover:bg-bg-accent hover:text-text-primary'
                                        }`}
                                >
                                    {lang.label}
                                    {language === lang.value && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-glow shadow-brand-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Labels Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Hash size={12} /> Issue Impact
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {labels.map((l) => (
                                <button
                                    key={l.value}
                                    onClick={() => {
                                        setLabel(l.value);
                                        handleFilterUpdate({ label: l.value });
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${label === l.value
                                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                                        : 'bg-bg-elevated text-text-muted border border-border-subtle hover:border-text-muted hover:text-text-secondary'
                                        }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-8 pt-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/5 border border-brand-primary/10">
                    <p className="text-xs font-bold text-brand-primary mb-1">New to OS?</p>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                        Start with "Good First Issue" to build your confidence.
                    </p>
                    <button className="text-[11px] font-bold text-white hover:underline flex items-center gap-1">
                        Read Guide →
                    </button>
                </div>
            </div>
        </aside>
    );
};
