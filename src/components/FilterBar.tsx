import React from 'react';
import { Search, Hash, Code2, Layers, RefreshCcw, ChevronDown } from 'lucide-react';

interface FilterBarProps {
    onFilterChange: (filters: { language?: string; label?: string; query?: string }) => void;
    isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, isLoading }) => {
    const [query, setQuery] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [label, setLabel] = React.useState('good first issue');



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
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-box">
                    <Code2 className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none">IssueFinder</h1>
                    <p className="text-xs text-brand-primary opacity-80 font-mono mt-1">v1.0.0</p>
                </div>
            </div>

            <div className="p-6 grid gap-8">
                {/* Getting Started Section - Movet to Top */}
                <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                    <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Getting Started?</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                        Pick a language and filter for "Good First Issue".
                    </p>
                    <button style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>
                        Read Guide →
                    </button>
                </div>

                {/* Focus Section - Reordered */}
                <div className="filter-group">
                    <label className="section-label">
                        <Hash size={12} /> Focus
                    </label>
                    <div className="chip-group">
                        {labels.map((l) => (
                            <button
                                key={l.value}
                                onClick={() => {
                                    setLabel(l.value);
                                    handleFilterUpdate({ label: l.value });
                                }}
                                className={`chip ${label === l.value ? 'active' : ''}`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Section */}
                <div className="filter-group">
                    <label className="section-label">
                        <Search size={12} /> Search
                    </label>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Keywords..."
                            className="search-input"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                handleFilterUpdate({ query: e.target.value });
                            }}
                        />
                        {isLoading && (
                            <RefreshCcw className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary animate-spin" size={14} />
                        )}
                    </div>
                </div>

                {/* Language Section - Dropdown */}
                <div className="filter-group">
                    <label className="section-label">
                        <Layers size={12} /> Languages
                    </label>
                    <div className="custom-select-wrapper">
                        <select
                            className="custom-select"
                            value={language}
                            onChange={(e) => {
                                setLanguage(e.target.value);
                                handleFilterUpdate({ language: e.target.value });
                            }}
                        >
                            <option value="">All Languages</option>
                            <option value="typescript">TypeScript</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="rust">Rust</option>
                            <option value="go">Go</option>
                            <option value="java">Java</option>
                            <option value="c++">C++</option>
                            <option value="c#">C#</option>
                            <option value="php">PHP</option>
                            <option value="ruby">Ruby</option>
                            <option value="swift">Swift</option>
                            <option value="kotlin">Kotlin</option>
                            <option value="dart">Dart</option>
                            <option value="scala">Scala</option>
                            <option value="elixir">Elixir</option>
                            <option value="ocaml">OCaml</option>
                            <option value="haskell">Haskell</option>
                            <option value="lua">Lua</option>
                            <option value="clojure">Clojure</option>
                            <option value="julia">Julia</option>
                            <option value="r">R</option>
                        </select>
                        <ChevronDown className="select-icon" size={14} />
                    </div>
                </div>
            </div>
        </aside>
    );
};
