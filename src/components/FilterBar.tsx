import React, { useState } from 'react';
import { Search, Hash, Code2, Layers, RefreshCcw, ChevronDown, X, Settings, BookOpen, ArrowDownUp, CheckCircle2 } from 'lucide-react';
import type { SearchFilters } from '../types/github';

interface FilterBarProps {
    onFilterChange: (filters: SearchFilters) => void;
    isLoading?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    onOpenSettings: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, isLoading, isOpen = false, onClose, onOpenSettings }) => {
    const [query, setQuery] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [label, setLabel] = React.useState('');
    const [sort, setSort] = React.useState<'created' | 'comments' | 'updated'>('created');
    const [state, setState] = React.useState<'open' | 'closed' | 'all'>('open');
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const labels = [
        { label: 'All Issues', value: '' },
        { label: 'Good First Issue', value: 'good first issue' },
        { label: 'Help Wanted', value: 'help wanted' },
        { label: 'Bug', value: 'bug' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Enhancement', value: 'enhancement' },
    ];

    const sortOptions = [
        { label: 'Newest', value: 'created' },
        { label: 'Most Commented', value: 'comments' },
        { label: 'Recently Updated', value: 'updated' },
    ];

    const handleFilterUpdate = (updates: Partial<SearchFilters>) => {
        const newFilters: SearchFilters = {
            query: updates.query !== undefined ? updates.query : query,
            language: updates.language !== undefined ? updates.language : language,
            label: updates.label !== undefined ? updates.label : label,
            sort: updates.sort !== undefined ? updates.sort : sort,
            state: updates.state !== undefined ? updates.state : state,
            // Default order to desc unless specified? For now hardcode or add toggle later if requested.
            // Let's stick to desc for 'newest' and 'most commented' usually.
            order: 'desc'
        };

        onFilterChange(newFilters);
    };

    const clearAll = () => {
        setQuery('');
        setLanguage('');
        setLabel('');
        setSort('created');
        setState('open');
        handleFilterUpdate({ query: '', language: '', label: '', sort: 'created', state: 'open' });
    }

    return (
        <>
            {/* Guide Modal */}
            {isGuideOpen && (
                <div className="sidebar-overlay open" style={{ zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsGuideOpen(false)}>
                    <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', maxWidth: '500px', width: '90%', border: '1px solid var(--color-border)', color: 'var(--color-text)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsGuideOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <BookOpen size={24} color="var(--color-primary)" />
                            Quick Guide
                        </h2>
                        <div style={{ lineHeight: 1.6, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            <p style={{ marginBottom: '1rem' }}>Welcome to <strong>IssueFinder</strong>! Here is how to get started:</p>
                            <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>Use the <strong>Language</strong> filter to find issues in your preferred stack.</li>
                                <li>The <strong>Focus</strong> filter helps you find "Good First Issues" or specific labels.</li>
                                <li>You can search by keyword in the <strong>Search</strong> bar.</li>
                                <li>Click the <strong>Copy</strong> icon to grab the issue link, or the row to view details.</li>
                            </ul>
                            <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-text-dim)' }}>PRO TIP: Hover over truncated titles to see the full content.</p>
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsGuideOpen(false)} className="load-more-btn" style={{ padding: '0.5rem 1.5rem' }}>Got it</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header" style={{ paddingBottom: '1rem' }}>
                    <div className="flex items-center gap-3">
                        <div className="logo-box">
                            <Code2 color="white" size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold" style={{ fontSize: '1.25rem', lineHeight: 1 }}>IssueFinder</h1>
                            <p className="font-mono text-xs" style={{ color: 'var(--color-primary)', marginTop: '0.25rem', opacity: 0.9 }}>v2.0.0</p>
                        </div>
                    </div>
                    <button
                        className="icon-btn lg:hidden ml-auto"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1 }}>
                    {/* Language Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <Layers size={12} /> Language
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
                            </select>
                            <ChevronDown className="select-icon" size={14} />
                        </div>
                    </div>

                    {/* Focus Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <Hash size={12} /> Focus
                        </label>
                        <div className="custom-select-wrapper">
                            <select
                                className="custom-select"
                                value={label}
                                onChange={(e) => {
                                    setLabel(e.target.value);
                                    handleFilterUpdate({ label: e.target.value });
                                }}
                            >
                                {labels.map((l) => (
                                    <option key={l.value} value={l.value}>{l.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="select-icon" size={14} />
                        </div>
                    </div>

                    {/* State Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <CheckCircle2 size={12} /> Status
                        </label>
                        <div className="custom-select-wrapper">
                            <select
                                className="custom-select"
                                value={state}
                                onChange={(e) => {
                                    const val = e.target.value as 'open' | 'closed' | 'all';
                                    setState(val);
                                    handleFilterUpdate({ state: val });
                                }}
                            >
                                <option value="open">Open Issues</option>
                                <option value="closed">Closed Issues</option>
                                <option value="all">All Issues</option>
                            </select>
                            <ChevronDown className="select-icon" size={14} />
                        </div>
                    </div>

                    {/* Sort Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <ArrowDownUp size={12} /> Sort By
                        </label>
                        <div className="custom-select-wrapper">
                            <select
                                className="custom-select"
                                value={sort}
                                onChange={(e) => {
                                    const val = e.target.value as 'created' | 'comments' | 'updated';
                                    setSort(val);
                                    handleFilterUpdate({ sort: val });
                                }}
                            >
                                {sortOptions.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="select-icon" size={14} />
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="filter-group" style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <label className="section-label" style={{ marginBottom: 0 }}>
                                <Search size={12} /> Search
                            </label>
                            {(query || language || label || state !== 'open' || sort !== 'created') && (
                                <button
                                    onClick={clearAll}
                                    style={{ fontSize: '0.65rem', color: 'var(--color-primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
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
                                <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
                                    <RefreshCcw className="animate-spin" size={14} color="var(--color-primary)" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer with Settings */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto', background: 'var(--color-bg-subtle)' }}>
                    <button
                        onClick={() => setIsGuideOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s', background: 'transparent', cursor: 'pointer', border: 'none' }}
                    >
                        <BookOpen size={16} />
                        Guide
                    </button>
                    <button
                        onClick={onOpenSettings}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--color-text-dim)', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-text-dim)'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    >
                        <Settings size={16} />
                        Settings
                    </button>
                </div>
            </aside>
        </>
    );
};
