import { useState } from 'react';
import { Github, Sparkles, AlertCircle, ChevronDown, Loader2, LayoutGrid, ListFilter, Activity } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { IssueCard } from './components/IssueCard';
import { useIssues } from './hooks/useIssues';
import type { SearchFilters } from './types/github';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    label: 'good first issue',
  });

  const { issues, loading, loadingMore, error, hasMore, loadMore } = useIssues(filters);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="dashboard-grid selection:bg-brand-primary selection:text-white">
      {/* Persistent Sidebar */}
      <FilterBar onFilterChange={handleFilterChange} isLoading={loading} />

      {/* Main Scalable Content */}
      <main className="lg:ml-0 bg-bg-base min-h-screen relative flex flex-col">
        {/* Dynamic Header */}
        <header className="sticky top-0 z-20 glass border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <LayoutGrid size={14} className="text-brand-primary" />
                Discovery Pipeline
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Activity size={10} className="text-green-500" /> Live Feed
                </span>
                <span className="opacity-20">•</span>
                <span>{issues.length} Results Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-border-subtle text-xs font-bold hover:bg-bg-accent transition-all">
              <ListFilter size={14} />
              Sort: Newest
            </button>
            <a
              href="https://github.com/kanyingidickson-dev/Open-Issue-Finder"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:scale-105 transition-all active:scale-95"
            >
              <Github size={14} />
              Repository
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-10 max-w-[var(--container-max)] mx-auto w-full flex-grow">
          {/* Mobile Welcome (Small screens only) */}
          <div className="lg:hidden mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Discover Opportunities.</h1>
            <p className="text-text-secondary text-sm">Find your next technical challenge in open source.</p>
          </div>

          {/* Grid Layout */}
          {loading && issues.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="glass-card h-[280px] rounded-[1.5rem] animate-pulse bg-bg-elevated" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-[2rem] border-red-500/10">
              <div className="p-6 rounded-3xl bg-red-500/10 text-red-500 mb-6 border border-red-500/20">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Sync Failure</h3>
              <p className="text-text-muted max-w-md mx-auto text-sm leading-relaxed">
                {error} We're having trouble reaching the GitHub API. Please check your network or try again later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {issues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${(index % 9) * 0.05}s` }}
                  >
                    <IssueCard issue={issue} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-16 mb-12 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="group btn-secondary min-w-[240px] flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="animate-spin text-brand-primary" size={18} />
                        Syncing Page {Math.ceil(issues.length / 30) + 1}...
                      </>
                    ) : (
                      <>
                        Sync More Results
                        <ChevronDown className="group-hover:translate-y-1 transition-transform" size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && issues.length === 0 && (
            <div className="text-center py-32 glass-card rounded-[2rem]">
              <div className="text-text-muted text-sm font-medium">
                No active issues identified for this search criteria.<br />
                <button
                  onClick={() => handleFilterChange({ label: 'good first issue' })}
                  className="mt-6 text-brand-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border-b border-brand-primary/30"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <footer className="mt-auto border-t border-border-subtle bg-bg-surface/30 px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-text-dim font-bold uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span>© 2026 IssueFinder Protocol</span>
            <span className="opacity-10 hidden md:block">|</span>
            <a href="#" className="hover:text-text-muted transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-muted transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-1">
            Data Provisioned by
            <a href="https://github.com/kanyingidickson-dev" className="text-brand-primary/80 hover:text-brand-primary hover:underline transition-all">[Kanyingidickson-dev]</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
