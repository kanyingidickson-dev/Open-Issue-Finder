import { useState } from 'react';
import { Github, Rocket, Sparkles, AlertCircle } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { IssueCard } from './components/IssueCard';
import { useIssues } from './hooks/useIssues';
import type { SearchFilters } from './types/github';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    label: 'good first issue',
  });

  const { issues, loading, error } = useIssues(filters);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full" />
        </div>

        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={16} />
            <span>Discover your next contribution</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Open Issue Finder
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The easiest way to find beginner-friendly issues across the GitHub ecosystem.
            Start contributing to open source today.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/kanyingidickson-dev/Open-Issue-Finder"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all"
            >
              <Github size={20} />
              Star on GitHub
            </a>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-brand-primary/50 transition-all">
              <Rocket size={20} />
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">
        <FilterBar onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass h-[200px] rounded-2xl animate-pulse bg-bg-accent/50" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
            <p className="text-text-secondary">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        {!loading && issues.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            No issues found matching your filters. Try broadening your search.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border-subtle py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            IssueFinder
          </div>
          <p className="text-text-muted text-sm">
            &copy; 2026 Open Issue Finder. Built for the community.
          </p>
          <div className="flex gap-6 text-text-muted hover:text-white transition-colors">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
