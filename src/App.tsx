import { useState } from 'react';
import { Github, Sparkles, AlertCircle, ChevronDown, Loader2, LayoutGrid, Activity } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { IssueCard } from './components/IssueCard';
import { useIssues } from './hooks/useIssues';
import type { SearchFilters } from './types/github';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({ label: 'good first issue' });
  const { issues, loading, loadingMore, error, hasMore, loadMore } = useIssues(filters);

  const handleFilterChange = (newFilters: SearchFilters) => setFilters(newFilters);

  return (
    <div className="dashboard-grid">
      <FilterBar onFilterChange={handleFilterChange} isLoading={loading} />

      <main className="main-content flex flex-col relative">
        {/* Dynamic Header */}
        <header className="sticky top-0 z-20 glass p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="grid">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <LayoutGrid size={14} className="text-brand-primary" />
                Discovery Pipeline
              </h2>
              <div className="flex items-center gap-2 text-xs text-text-muted font-bold uppercase tracking-widest">
                <Activity size={10} color="#22c55e" /> {issues.length} Results Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/kanyingidickson-dev/Open-Issue-Finder"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:scale-105 transition-all"
            >
              <Github size={14} />
              Repository
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-10 container flex-grow">
          {loading && issues.length === 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card h-[280px] rounded-2xl animate-pulse bg-bg-elevated" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-2xl p-10">
              <AlertCircle size={48} color="#ef4444" className="mb-6" />
              <h3 className="text-2xl font-bold mb-2">Sync Failure</h3>
              <p className="text-text-muted max-w-sm mx-auto text-sm">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {issues.map((issue, index) => (
                  <div key={issue.id} className="animate-slide-up" style={{ animationDelay: `${(index % 9) * 0.05}s` }}>
                    <IssueCard issue={issue} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-16 mb-12 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-10 py-5 rounded-2xl bg-bg-elevated border border-border-subtle hover:border-brand-primary transition-all font-bold text-white flex items-center gap-3"
                  >
                    {loadingMore ? <Loader2 className="animate-spin" size={18} /> : <span>Load More Issues</span>}
                    {!loadingMore && <ChevronDown size={18} />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Minimal Footer */}
        <footer className="mt-auto border-t border-border-subtle bg-bg-surface p-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
          <div className="flex items-center gap-6">
            <span>© 2026 IssueFinder</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-2">
            Built by
            <a href="https://github.com/kanyingidickson-dev" className="text-brand-primary hover:underline">[Kanyingidickson-dev]</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
