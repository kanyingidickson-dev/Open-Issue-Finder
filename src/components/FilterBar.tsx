import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
    onFilterChange: (filters: { language?: string; label?: string; query?: string }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const [query, setQuery] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [label, setLabel] = React.useState('good first issue');

    const handleSubmit = (e: React.FormEvent) => {
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
    ];

    const labels = [
        { label: 'Good First Issue', value: 'good first issue' },
        { label: 'Help Wanted', value: 'help wanted' },
        { label: 'Bug', value: 'bug' },
        { label: 'Enhancement', value: 'enhancement' },
    ];

    return (
        <div className="glass p-6 rounded-3xl mb-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search keywords or repositories..."
                        className="w-full bg-bg-accent border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <select
                        className="w-full bg-bg-accent border border-border-subtle rounded-2xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-brand-primary transition-all cursor-pointer"
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            onFilterChange({ query, language: e.target.value, label });
                        }}
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                </div>

                <div className="relative">
                    <select
                        className="w-full bg-bg-accent border border-border-subtle rounded-2xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-brand-primary transition-all cursor-pointer"
                        value={label}
                        onChange={(e) => {
                            setLabel(e.target.value);
                            onFilterChange({ query, language, label: e.target.value });
                        }}
                    >
                        {labels.map((l) => (
                            <option key={l.value} value={l.value}>
                                {l.label}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                </div>
            </form>
        </div>
    );
};
