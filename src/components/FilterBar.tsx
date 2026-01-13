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
        <aside className="sidebar flex flex-col z-30">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                        <Code2 className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">IssueFinder</h1>
                        <p className="text-xs text-brand-primary font-bold uppercase tracking-widest opacity-80">v1.0.0</p>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Search Section */}
                    <div className="grid gap-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Search size={12} /> Search
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Keywords..."
                                className="w-full bg-bg-elevated border border-border-subtle rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
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
                    <div className="grid gap-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Layers size={12} /> Languages
                        </label>
                        <div className="grid gap-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.value}
                                    onClick={() => {
                                        setLanguage(lang.value);
                                        handleFilterUpdate({ language: lang.value });
                                    }}
                                    className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${language === lang.value
                                            ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                                            : 'text-text-secondary hover:bg-bg-accent hover:text-text-primary'
                                        }`}
                                >
                                    {lang.label}
                                    {language === lang.value && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Labels Section */}
                    <div className="grid gap-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Hash size={12} /> Focus
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
                                            ? 'bg-brand-primary text-white'
                                            : 'bg-bg-elevated text-text-muted border border-border-subtle hover:text-text-secondary'
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
                <div className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle">
                    <p className="text-xs font-bold text-brand-primary mb-1">Getting Started?</p>
                    <p className="text-sm text-text-muted mb-3">
                        Pick a language and filter for "Good First Issue".
                    </p>
                    <button className="text-xs font-bold text-white hover:underline">
                        Read Guide →
                    </button>
                </div>
            </div>
        </aside>
    );
};
