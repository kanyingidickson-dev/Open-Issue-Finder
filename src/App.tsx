import { useState } from 'react';
import { Github, Sparkles, AlertCircle, Loader2, LayoutGrid, Activity } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { IssueRow } from './components/IssueRow';
import { useIssues } from './hooks/useIssues';
import type { SearchFilters } from './types/github';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({ label: 'good first issue' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { issues, loading, loadingMore, error, hasMore, loadMore } = useIssues(filters);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setIsSidebarOpen(false); // Close sidebar on filter change
  };

  return (
    <div className="dashboard-grid">
      <FilterBar
        onFilterChange={handleFilterChange}
        isLoading={loading}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Dynamic Header */}
        <header className="app-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
              style={{ width: '32px', height: '32px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}>
              <LayoutGrid size={18} />
            </button>
            <div className="title">
              {/* <LayoutGrid size={16} color="var(--color-primary)" /> */}
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
        <div className="content-wrapper">
          {loading && issues.length === 0 ? (
            <div className="issues-table-container">
              <table className="issues-table">
                <thead>
                  <tr>
                    <th style={{ width: '220px' }}>Repository</th>
                    <th>Issue</th>
                    <th style={{ width: '150px' }}>Author</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Comments</th>
                    <th style={{ textAlign: 'right' }}>Created</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td colSpan={6} style={{ padding: '1.5rem' }}>
                        <div style={{ height: '24px', background: 'var(--color-bg-elevated)', borderRadius: '4px', opacity: 0.3, animation: 'pulse 1.5s infinite' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : error ? (
            <div className="loader-container">
              <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sync Failure</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
            </div>
          ) : issues.length === 0 ? (
            /* Empty State */
            <div className="loader-container">
              <div style={{ padding: '2rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', maxWidth: '400px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--color-bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <Sparkles size={24} color="var(--color-text-dim)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Issues Found</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  We couldn't find any issues matching your specific filters. Try adjusting your search query or selecting a different language.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="issues-table-container">
                <table className="issues-table">
                  <thead>
                    <tr>
                      <th>Repository</th>
                      <th>Issue</th>
                      <th>Author</th>
                      <th style={{ textAlign: 'center' }}>Comments</th>
                      <th style={{ textAlign: 'right' }}>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <IssueRow key={issue.id} issue={issue} />
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMore && (
                <div className="load-more-container">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? <Loader2 className="animate-spin" size={16} /> : <span>Load More Issues</span>}
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
