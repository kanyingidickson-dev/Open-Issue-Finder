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

      <main className="main-content">
        {/* Dynamic Header */}
        <header className="app-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="lg:hidden" style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="white" />
            </div>
            <div className="title">
              <LayoutGrid size={16} color="var(--color-primary)" />
              <h2>Discovery Pipeline</h2>
            </div>
            <div className="status-badge">
              <Activity size={12} color="#22c55e" /> {issues.length} Active
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="https://github.com/kanyingidickson-dev/Open-Issue-Finder"
              target="_blank"
              className="github-btn"
            >
              <Github size={16} />
              Repository
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-grid">
          {loading && issues.length === 0 ? (
            <div className="issues-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="issue-card" style={{ height: '300px', opacity: 0.5, animation: 'pulse 2s infinite' }} />
              ))}
            </div>
          ) : error ? (
            <div className="loader-container">
              <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sync Failure</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
            </div>
          ) : (
            <>
              <div className="issues-grid">
                {issues.map((issue, index) => (
                  <div key={issue.id} className="animate-fade-in" style={{ animationDelay: `${(index % 9) * 0.05}s` }}>
                    <IssueCard issue={issue} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="load-more-container">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="load-more-btn"
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
        <footer className="app-footer">
          <div className="footer-links">
            <span>© 2026 IssueFinder</span>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Built by
            <a href="https://github.com/kanyingidickson-dev" style={{ color: 'var(--color-primary)' }}>[Kanyingidickson-dev]</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
