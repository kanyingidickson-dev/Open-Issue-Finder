import { useState, useEffect } from 'react';
import { Github, Sparkles, AlertCircle, Loader2, LayoutGrid, Activity, Moon, Sun, Settings, X, Check, Bookmark, Trash2 } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { IssueRow } from './components/IssueRow';
import { useIssues } from './hooks/useIssues';
import type { SearchFilters, GitHubIssue, SavedIssue } from './types/github';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    label: '',
    sort: 'created',
    order: 'desc',
    state: 'open'
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [view, setView] = useState<'discover' | 'saved'>('discover');
  const [savedIssues, setSavedIssues] = useState<SavedIssue[]>(() => {
    const saved = localStorage.getItem('issuefinder_saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const { issues, loading, loadingMore, error, hasMore, loadMore } = useIssues({ ...filters, perPage: rowsPerPage });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('issuefinder_saved', JSON.stringify(savedIssues));
  }, [savedIssues]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // If we are in saved view, maybe we should switch back to discover? 
    // Or maybe apply filters to saved? For now simple switch back.
    if (view === 'saved') setView('discover');
    // setIsSidebarOpen(false); // Valid choice to keep sidebar open if user is refining
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const toggleSaveIssue = (issue: GitHubIssue) => {
    const exists = savedIssues.find(i => i.id === issue.id);
    if (exists) {
      setSavedIssues(prev => prev.filter(i => i.id !== issue.id));
      showToast('Issue removed from saved items', 'info');
    } else {
      setSavedIssues(prev => [...prev, { ...issue, savedAt: Date.now() }]);
      showToast('Issue saved successfully', 'success');
    }
  };

  const clearSaved = () => {
    if (confirm('Are you sure you want to clear all saved issues?')) {
      setSavedIssues([]);
      showToast('All saved issues cleared', 'info');
    }
  };

  return (
    <div className="dashboard-grid">
      <FilterBar
        onFilterChange={handleFilterChange}
        isLoading={loading}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 200,
          maxWidth: '300px'
        }}>
          {toast.type === 'success' ? <Check size={18} color="#22c55e" /> : <Info size={18} color="var(--color-primary)" />}
          <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</p>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="sidebar-overlay open" style={{ zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '400px', padding: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="icon-btn"><X size={20} /></button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>APPLICATION THEME</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setTheme('light')}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)', border: `1px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--color-border)'}`, background: 'var(--color-bg-subtle)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                  <Sun size={16} /> Light {theme === 'light' && <Check size={14} color="var(--color-primary)" />}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)', border: `1px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)'}`, background: 'var(--color-bg-subtle)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                  <Moon size={16} /> Dark {theme === 'dark' && <Check size={14} color="var(--color-primary)" />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>ISSUES PER PAGE</label>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value={10}>10 Issues</option>
                <option value={20}>20 Issues</option>
                <option value={30}>30 Issues</option>
                <option value={50}>50 Issues</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                Note: Changing this will apply to next search.
              </p>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textAlign: 'center' }}>
                IssueFinder v2.0.0
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        {/* Dynamic Header */}
        <header className="app-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hidden-desktop icon-btn"
              style={{ border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <LayoutGrid size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ lineHeight: 1 }}>{view === 'discover' ? 'Discovery Pipeline' : 'Saved Collection'}</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 500, marginTop: '2px' }}>
                  {view === 'discover' ? 'Explore open requests' : 'Your personal bookmarks'}
                </span>
              </div>

              <div className="hidden-mobile" style={{ display: 'flex', padding: '0.25rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setView('discover')}
                  style={{
                    padding: '0.4rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: view === 'discover' ? 'var(--color-bg-elevated)' : 'transparent',
                    color: view === 'discover' ? 'var(--color-text)' : 'var(--color-text-dim)',
                    border: view === 'discover' ? '1px solid var(--color-border)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: view === 'discover' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <LayoutGrid size={14} /> Discovery
                </button>
                <button
                  onClick={() => setView('saved')}
                  style={{
                    padding: '0.4rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: view === 'saved' ? 'var(--color-bg-elevated)' : 'transparent',
                    color: view === 'saved' ? 'var(--color-text)' : 'var(--color-text-dim)',
                    border: view === 'saved' ? '1px solid var(--color-border)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: view === 'saved' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <Bookmark size={14} /> Saved <span style={{ background: 'var(--color-primary)', color: 'white', padding: '0 0.35rem', borderRadius: '4px', fontSize: '0.65rem' }}>{savedIssues.length}</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setView(view === 'discover' ? 'saved' : 'discover')}
              className="icon-btn hidden-desktop"
            >
              {view === 'discover' ? <Bookmark size={18} /> : <LayoutGrid size={18} />}
            </button>

            <button
              onClick={toggleTheme}
              className="icon-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 0.25rem' }}></div>

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
          {view === 'discover' ? (
            // DISCOVERY VIEW
            <>
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
                          <th className="cell-repo">Repository</th>
                          <th className="cell-main">Issue</th>
                          <th className="cell-author">Author</th>
                          <th className="cell-comments">Comments</th>
                          <th className="cell-date">Created</th>
                          <th className="cell-action"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map((issue) => (
                          <IssueRow
                            key={issue.id}
                            issue={issue}
                            isSaved={savedIssues.some(saved => saved.id === issue.id)}
                            onToggleSave={toggleSaveIssue}
                          />
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
            </>
          ) : (
            // SAVED VIEW
            <>
              {savedIssues.length === 0 ? (
                <div className="loader-container">
                  <div style={{ padding: '2rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', maxWidth: '400px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--color-bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                      <Bookmark size={24} color="var(--color-text-dim)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Saved Issues</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      You haven't bookmarked any issues yet. Click the bookmark icon on any issue to save it for later.
                    </p>
                    <button onClick={() => setView('discover')} className="load-more-btn" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                      Start Discovering
                    </button>
                  </div>
                </div>
              ) : (
                <div className="issues-table-container">
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-elevated)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bookmark size={16} color="var(--color-primary)" />
                      Saved Collection ({savedIssues.length})
                    </h3>
                    <button
                      onClick={clearSaved}
                      style={{ fontSize: '0.75rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                    >
                      <Trash2 size={12} /> Clear All
                    </button>
                  </div>
                  <table className="issues-table">
                    <thead>
                      <tr>
                        <th className="cell-repo">Repository</th>
                        <th className="cell-main">Issue</th>
                        <th className="cell-author">Author</th>
                        <th className="cell-comments">Comments</th>
                        <th className="cell-date">Created</th>
                        <th className="cell-action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedIssues.map((issue) => (
                        <IssueRow
                          key={issue.id}
                          issue={issue}
                          isSaved={true}
                          onToggleSave={toggleSaveIssue}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </div>

        {/* Minimal Footer */}
        <footer className="app-footer">
          <div className="footer-links" style={{ display: 'flex', gap: '1rem', fontWeight: 600 }}>
            <span>© 2026 IssueFinder</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Built by
            <a href="https://github.com/kanyingidickson-dev" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>@kanyingidickson-dev</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
