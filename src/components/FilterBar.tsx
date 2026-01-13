import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface FilterBarProps {
    onFilterChange: (filters: { language?: string; label?: string; query?: string }) => void;
    isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, isLoading }) => {
    const [query, setQuery] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [label, setLabel] = React.useState('good first issue');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ query, language, label });
    };

    const languages = [
        { label: 'All Languages', value: '' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Go', value: 'go' },
        { label: 'Rust', value: 'rust' },
        { label: 'Java', value: 'java' },
        { label: 'C++', value: 'cpp' },
        { label: 'Ruby', value: 'ruby' },
        { label: 'PHP', value: 'php' },
        { label: 'Swift', value: 'swift' },
        { label: 'Kotlin', value: 'kotlin' },
    ];

    const labels = [
        { label: 'Good First Issue', value: 'good first issue' },
        { label: 'Help Wanted', value: 'help wanted' },
        { label: 'Bug', value: 'bug' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Enhancement', value: 'enhancement' },
        { label: 'First Timers Only', value: 'first-timers-only' },
    ];

    const handleChange = (type: 'language' | 'label', value: string) => {
        if (type === 'language') setLanguage(value);
        if (type === 'label') setLabel(value);

        onFilterChange({
            query,
            language: type === 'language' ? value : language,
            label: type === 'label' ? value : label
        });
    };

    return (
        <div className="glass p-6 md:p-8 rounded-[2rem] mb-12 shadow-2xl shadow-brand-primary/5">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-5">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Keywords</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Find specific issues..."
                            className="w-full bg-bg-accent/50 border border-border-subtle rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary focus:bg-bg-accent transition-all placeholder:text-text-muted/50"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Language</label>
                    <div className="relative">
                        <select
                            className="w-full bg-bg-accent/50 border border-border-subtle rounded-2xl py-3.5 px-4 text-white appearance-none focus:outline-none focus:border-brand-primary focus:bg-bg-accent transition-all cursor-pointer"
                            value={language}
                            onChange={(e) => handleChange('language', e.target.value)}
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Label</label>
                    <div className="relative">
                        <select
                            className="w-full bg-bg-accent/50 border border-border-subtle rounded-2xl py-3.5 px-4 text-white appearance-none focus:outline-none focus:border-brand-primary focus:bg-bg-accent transition-all cursor-pointer"
                            value={label}
                            onChange={(e) => handleChange('label', e.target.value)}
                        >
                            {labels.map((l) => (
                                <option key={l.value} value={l.value}>
                                    {l.label}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full aspect-square md:w-auto bg-brand-primary text-white rounded-2xl p-3.5 flex items-center justify-center hover:bg-brand-secondary transition-all disabled:opacity-50 group"
                        title="Refresh search"
                    >
                        <RefreshCw className={`transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};
