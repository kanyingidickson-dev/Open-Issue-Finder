import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Hash, Code2, Layers, RefreshCcw, ChevronDown, X, Settings, BookOpen, ArrowDownUp, CheckCircle2, Keyboard, AlertTriangle, Zap, Bookmark, ExternalLink } from 'lucide-react';
import type { SearchFilters } from '../types/github';

type SelectOption = { label: string; value: string };

interface HoverSelectProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const HoverSelect: React.FC<HoverSelectProps> = ({ value, options, onChange, placeholder, disabled }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const selectedLabel = useMemo(() => {
        const found = options.find((o) => o.value === value);
        return found ? found.label : (placeholder ?? 'Select...');
    }, [options, placeholder, value]);

    useEffect(() => {
        if (!open) return;

        const onDocMouseDown = (e: MouseEvent) => {
            const el = wrapperRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) {
                setOpen(false);
            }
        };

        const onDocKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onDocMouseDown);
        document.addEventListener('keydown', onDocKeyDown);
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown);
            document.removeEventListener('keydown', onDocKeyDown);
        };
    }, [open]);

    return (
        <div
            ref={wrapperRef}
            className="hover-select"
        >
            <button
                type="button"
                className="custom-select hover-select-trigger"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((prev) => !prev);
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpen(true);
                    }
                    if (e.key === 'Escape') {
                        setOpen(false);
                    }
                }}
            >
                {selectedLabel}
            </button>
            <ChevronDown className="select-icon" size={14} />

            {open && (
                <div className="hover-select-menu" role="listbox">
                    {options.map((o) => (
                        <button
                            key={o.value}
                            type="button"
                            role="option"
                            aria-selected={o.value === value}
                            className={`hover-select-option ${o.value === value ? 'active' : ''}`}
                            onClick={() => {
                                onChange(o.value);
                                setOpen(false);
                            }}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FilterBarProps {
    onFilterChange: (filters: SearchFilters) => void;
    activeFilters?: SearchFilters;
    isLoading?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    onOpenSettings: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, activeFilters, isLoading, isOpen = false, onClose, onOpenSettings }) => {
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const handleClose = () => {
        onClose?.();
    };

    const query = activeFilters?.query || '';
    const language = activeFilters?.language || '';
    const label = activeFilters?.label || '';
    const sort = activeFilters?.sort || 'created';
    const state = activeFilters?.state || 'open';

    const languageOptions: SelectOption[] = [
        { label: 'All Languages', value: '' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Rust', value: 'rust' },
        { label: 'Go', value: 'go' },
        { label: 'Java', value: 'java' },
        { label: 'C++', value: 'c++' },
        { label: 'C#', value: 'c#' },
        { label: 'PHP', value: 'php' },
        { label: 'Ruby', value: 'ruby' },
        { label: 'Swift', value: 'swift' },
        { label: 'Kotlin', value: 'kotlin' },
        { label: 'Dart', value: 'dart' },
        { label: 'Scala', value: 'scala' },
        { label: 'Elixir', value: 'elixir' },
    ];

    const labels: SelectOption[] = [
        { label: 'All Issues', value: '' },
        { label: 'Beginner Friendly', value: 'beginner' },
        { label: 'Help Wanted', value: 'help_wanted' },
        { label: 'Bug', value: 'bug' },
        { label: 'Documentation', value: 'docs' },
        { label: 'Enhancement', value: 'enhancement' },
    ];

    const stateOptions: SelectOption[] = [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'All', value: 'all' },
    ];

    const sortOptions: SelectOption[] = [
        { label: 'Newest', value: 'created' },
        { label: 'Most Commented', value: 'comments' },
        { label: 'Recently Updated', value: 'updated' },
        { label: 'Health Score', value: 'health' },
    ];

    const handleFilterUpdate = (updates: Partial<SearchFilters>) => {
        const newFilters: SearchFilters = {
            query: updates.query !== undefined ? updates.query : query,
            language: updates.language !== undefined ? updates.language : language,
            label: updates.label !== undefined ? updates.label : label,
            sort: updates.sort !== undefined ? updates.sort : sort,
            state: updates.state !== undefined ? updates.state : state,
            order: 'desc'
        };

        onFilterChange(newFilters);
    };

    const clearAll = () => {
        handleFilterUpdate({ query: '', language: '', label: '', sort: 'created', state: 'open' });
    }

    return (
        <>
            {/* Guide Modal - Revamped */}
            {isGuideOpen && (
                <div className="sidebar-overlay open" style={{ zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setIsGuideOpen(false)}>
                    <div style={{ background: 'var(--color-bg-card)', padding: '0', borderRadius: 'var(--radius-lg)', maxWidth: '560px', width: '100%', border: '1px solid var(--color-border)', color: 'var(--color-text)', position: 'relative', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--color-primary), #6366f1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={20} color="white" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Getting Started</h2>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', margin: 0 }}>Master IssueFinder in 2 minutes</p>
                                </div>
                            </div>
                            <button onClick={() => setIsGuideOpen(false)} className="icon-btn"><X size={20} /></button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                            {/* Quick Start */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Zap size={14} /> Quick Start
                                </h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                        <div style={{ width: '28px', height: '28px', background: 'var(--color-bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Layers size={14} color="var(--color-primary)" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>Pick a Language</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Filter issues by your preferred programming language.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                        <div style={{ width: '28px', height: '28px', background: 'var(--color-bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Hash size={14} color="#22c55e" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>Choose a Focus</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Start with "Good First Issue" for beginner-friendly tasks.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                        <div style={{ width: '28px', height: '28px', background: 'var(--color-bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Bookmark size={14} color="#eab308" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>Save for Later</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Bookmark interesting issues to your Saved Collection.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                        <div style={{ width: '28px', height: '28px', background: 'var(--color-bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <ExternalLink size={14} color="#3b82f6" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>Jump to GitHub</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Click any issue to open it directly on GitHub.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Keyboard Shortcuts */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Keyboard size={14} /> Keyboard Shortcuts
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    {[
                                        { key: 'D', action: 'Discovery View' },
                                        { key: 'S', action: 'Saved View' },
                                        { key: 'T', action: 'Toggle Theme' },
                                        { key: '/', action: 'Focus Search' },
                                    ].map(shortcut => (
                                        <div key={shortcut.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                            <kbd style={{ padding: '0.2rem 0.5rem', background: 'var(--color-bg-elevated)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)', border: '1px solid var(--color-border)', minWidth: '24px', textAlign: 'center' }}>{shortcut.key}</kbd>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{shortcut.action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* API Rate Limit Warning */}
                            <div style={{ padding: '0.875rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem' }}>
                                <AlertTriangle size={18} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem', color: '#eab308' }}>GitHub API Rate Limits</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                        Without a token: 10 requests/min. For higher limits, add a <code style={{ background: 'var(--color-bg-elevated)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.7rem' }}>VITE_GITHUB_TOKEN</code> to your environment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                            <button onClick={() => setIsGuideOpen(false)} className="load-more-btn" style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1.5rem' }}>Got it, let's go!</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={handleClose}
            />

            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''} ${isOpen ? '' : 'collapsed'}`}>
                <div className="sidebar-header" style={{ paddingBottom: '1rem' }}>
                    <div className="flex items-center gap-3">
                        <div className="logo-box">
                            <Code2 color="white" size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold" style={{ fontSize: '1.25rem', lineHeight: 1 }}>IssueFinder</h1>
                            <p className="font-mono text-xs" style={{ color: 'var(--color-primary)', marginTop: '0.25rem', opacity: 0.9 }}>v2.1.1</p>
                        </div>
                    </div>
                    <button
                        className="icon-btn"
                        onClick={handleClose}
                        type="button"
                        style={{ marginLeft: 'auto' }}
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
                            <HoverSelect
                                value={language}
                                options={languageOptions}
                                onChange={(next) => handleFilterUpdate({ language: next })}
                                placeholder="All Languages"
                                disabled={Boolean(isLoading)}
                            />
                        </div>
                    </div>

                    {/* Focus Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <Hash size={12} /> Focus
                        </label>
                        <div className="custom-select-wrapper">
                            <HoverSelect
                                value={label}
                                options={labels}
                                onChange={(next) => handleFilterUpdate({ label: next })}
                                placeholder="All Issues"
                                disabled={Boolean(isLoading)}
                            />
                        </div>
                    </div>

                    {/* State Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <CheckCircle2 size={12} /> Status
                        </label>
                        <div className="custom-select-wrapper">
                            <HoverSelect
                                value={state}
                                options={stateOptions}
                                onChange={(next) => handleFilterUpdate({ state: next as 'open' | 'closed' | 'all' })}
                                placeholder="Open"
                                disabled={Boolean(isLoading)}
                            />
                        </div>
                    </div>

                    {/* Sort Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <ArrowDownUp size={12} /> Sort
                        </label>
                        <div className="custom-select-wrapper">
                            <HoverSelect
                                value={sort}
                                options={sortOptions}
                                onChange={(next) => handleFilterUpdate({ sort: next as 'created' | 'comments' | 'updated' | 'health' })}
                                placeholder="Newest"
                                disabled={Boolean(isLoading)}
                            />
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="filter-group">
                        <label className="section-label">
                            <Search size={12} /> Search
                        </label>
                        <div className="search-box">
                            <Search className="search-icon" size={16} />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="search-input"
                                value={query}
                                onChange={(e) => {
                                    handleFilterUpdate({ query: e.target.value });
                                }}
                            />
                            {query && (
                                <button
                                    className="icon-btn"
                                    type="button"
                                    onClick={() => handleFilterUpdate({ query: '' })}
                                    style={{ width: '28px', height: '28px' }}
                                    title="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        type="button"
                        className="load-more-btn"
                        onClick={clearAll}
                        disabled={Boolean(isLoading)}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1.5rem', opacity: isLoading ? 0.7 : 1 }}
                    >
                        <RefreshCcw size={14} />
                        Reset Filters
                    </button>
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
