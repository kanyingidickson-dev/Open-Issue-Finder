import { useState } from 'react';
import { Github, Rocket, Sparkles, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen pb-20 selection:bg-brand-primary selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-8 animate-fade-in shadow-inner">
            <Sparkles size={16} />
            <span>Empowering Open Source Contributors</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Issue Finder
          </h1>
          <p className="text-text-secondary text-lg md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Skip the noise and find meaningful issues. We surface the best
            <span className="text-brand-primary font-medium"> good first issues</span> across the GitHub ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://github.com/kanyingidickson-dev/Open-Issue-Finder"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              <Github size={20} />
              Star on GitHub
            </a>
            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-brand-primary/50 hover:bg-bg-accent/50 transition-all font-semibold active:scale-95">
              <Rocket size={20} />
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container relative">
        <FilterBar onFilterChange={handleFilterChange} isLoading={loading} />

        {loading && issues.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass h-[280px] rounded-2xl animate-pulse bg-bg-accent/30" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[2.5rem] border-red-500/20">
            <div className="p-6 rounded-3xl bg-red-500/10 text-red-500 mb-6 ring-8 ring-red-500/5">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Api Limit Reached?</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              {error} If you see this frequently, try adding a GitHub token to your environment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {issues.map((issue, index) => (
                <div key={issue.id} className="animate-fade-in" style={{ animationDelay: `${(index % 9) * 0.05}s` }}>
                  <IssueCard issue={issue} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-brand-primary hover:bg-brand-primary/5 transition-all font-bold disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Loading more...
                    </>
                  ) : (
                    <>
                      Explore More Issues
                      <ChevronDown className="group-hover:translate-y-1 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && issues.length === 0 && (
          <div className="text-center py-32 glass rounded-[2.5rem]">
            <div className="text-text-muted text-lg font-light">
              No issues found matching your current filters.<br />
              <button
                onClick={() => handleFilterChange({ label: 'good first issue' })}
                className="mt-4 text-brand-primary hover:underline font-medium"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-border-subtle py-16 bg-bg-secondary/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-4 items-center md:items-start">
              <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
                <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                  <Sparkles size={20} className="text-white fill-white" />
                </div>
                IssueFinder
              </div>
              <p className="text-text-muted text-sm max-w-xs text-center md:text-left font-light leading-relaxed">
                Building a better community through open source discovery and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-white uppercase tracking-widest text-[10px]">Product</span>
                <a href="#" className="text-text-muted hover:text-brand-primary transition-colors">Features</a>
                <a href="#" className="text-text-muted hover:text-brand-primary transition-colors">Discovery</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-white uppercase tracking-widest text-[10px]">Community</span>
                <a href="https://github.com/kanyingidickson-dev/Open-Issue-Finder" className="text-text-muted hover:text-brand-primary transition-colors">GitHub</a>
                <a href="#" className="text-text-muted hover:text-brand-primary transition-colors">Discord</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-white uppercase tracking-widest text-[10px]">Legal</span>
                <a href="#" className="text-text-muted hover:text-brand-primary transition-colors">Privacy</a>
                <a href="#" className="text-text-muted hover:text-brand-primary transition-colors">Terms</a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border-subtle/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted font-light">
            <p>&copy; 2026 Open Issue Finder. All rights reserved.</p>
            <p>Built by <a href="#" className="text-brand-primary hover:underline">Dickson Kanyingi</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
