import { useState, useEffect, useMemo, useCallback, type ChangeEvent } from 'react';
import { Github, Sparkles, AlertCircle, Loader2, LayoutGrid, Moon, Sun, X, Check, Bookmark, Trash2, Info, Settings } from 'lucide-react';
import { FilterBar } from './components/FilterBar';
import { IssueRow } from './components/IssueRow';
import { useIssues } from './hooks/useIssues';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { fetchRepoDetails } from './api/github';
import type { SearchFilters, GitHubIssue, SavedIssue, SavedSearch } from './types/github';

type RepoScoreInput = {
  archived?: boolean;
  stargazers_count?: number;
  pushed_at?: string | null;
  updated_at?: string | null;
};

const createSavedSearchId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const nowMs = () => Date.now();

const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  language: '',
  label: '',
  sort: 'created',
  order: 'desc',
  state: 'open'
};

const getInitialStateFromUrl = (): { filters: SearchFilters; perPage: number } => {
  if (typeof window === 'undefined') {
    return { filters: DEFAULT_FILTERS, perPage: 30 };
  }

  const url = new URL(window.location.href);
  const q = url.searchParams.get('q') || '';
  const language = url.searchParams.get('lang') || '';
  const label = url.searchParams.get('label') || '';

  const sortRaw = url.searchParams.get('sort') || '';
  const sort: SearchFilters['sort'] = (sortRaw === 'created' || sortRaw === 'comments' || sortRaw === 'updated' || sortRaw === 'health') ? sortRaw : DEFAULT_FILTERS.sort;

  const stateRaw = url.searchParams.get('state') || '';
  const state: SearchFilters['state'] = (stateRaw === 'open' || stateRaw === 'closed' || stateRaw === 'all') ? stateRaw : DEFAULT_FILTERS.state;

  const perPageRaw = url.searchParams.get('perPage');
  const perPageNum = perPageRaw ? Number(perPageRaw) : null;
  const perPage = perPageNum && Number.isFinite(perPageNum) ? perPageNum : 30;

  const nextFilters: SearchFilters = {
    ...DEFAULT_FILTERS,
    query: q,
    language,
    label,
    sort,
    state,
    order: 'desc'
  };

  return { filters: nextFilters, perPage };
};

function App() {
  const [filters, setFilters] = useState<SearchFilters>(() => getInitialStateFromUrl().filters);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(() => getInitialStateFromUrl().perPage);
  const [view, setView] = useState<'discover' | 'saved'>('discover');
  const [savedIssues, setSavedIssues] = useState<SavedIssue[]>(() => {
    const saved = localStorage.getItem('issuefinder_saved');
    return safeJsonParse<SavedIssue[]>(saved, []);
  });
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const raw = localStorage.getItem('issuefinder_saved_searches');
    return safeJsonParse<SavedSearch[]>(raw, []);
  });
  const [newSearchName, setNewSearchName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const [repoHealth, setRepoHealth] = useState<Record<string, { score: number; fetchedAt: number }>>(() => {
    const raw = localStorage.getItem('issuefinder_repo_health');
    return safeJsonParse<Record<string, { score: number; fetchedAt: number }>>(raw, {});
  });

  const { issues, loading, loadingMore, error, hasMore, loadMore } = useIssues({ ...filters, perPage: rowsPerPage });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('issuefinder_saved', JSON.stringify(savedIssues));
  }, [savedIssues]);

  useEffect(() => {
    localStorage.setItem('issuefinder_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    localStorage.setItem('issuefinder_repo_health', JSON.stringify(repoHealth));
  }, [repoHealth]);

  useEffect(() => {
    const uniqueRepoUrls = Array.from(new Set(issues.map((i: GitHubIssue) => i.repository_url).filter(Boolean)));
    if (uniqueRepoUrls.length === 0) return;

    const now = Date.now();
    const ttlMs = 12 * 60 * 60 * 1000;

    const toFetch = uniqueRepoUrls.filter((repoUrl: string) => {
      const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/');
      const fullName = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : repoUrl;
      const cached = repoHealth[fullName];
      return !cached || (now - cached.fetchedAt) > ttlMs;
    });

    if (toFetch.length === 0) return;

    let cancelled = false;

    const computeScore = (repo: RepoScoreInput) => {
      if (!repo || repo.archived) return 0;
      const stars = typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0;

      const pushedAt = repo.pushed_at ? new Date(repo.pushed_at).getTime() : 0;
      const updatedAt = repo.updated_at ? new Date(repo.updated_at).getTime() : 0;
      const activityAt = Math.max(pushedAt, updatedAt);
      const daysSinceActivity = activityAt ? (now - activityAt) / (1000 * 60 * 60 * 24) : 9999;

      const activityScore = Math.max(0, Math.min(1, 1 - (daysSinceActivity / 365)));
      const starScore = Math.max(0, Math.min(1, Math.log10(stars + 1) / 4));

      return Math.round((activityScore * 70 + starScore * 30) * 100) / 100;
    };

    (async () => {
      const next: Record<string, { score: number; fetchedAt: number }> = {};

      for (const repoUrl of toFetch.slice(0, 20)) {
        const details = await fetchRepoDetails(repoUrl as string);
        if (!details) continue;
        const fullName = details.full_name || repoUrl;
        next[fullName] = {
          score: computeScore(details),
          fetchedAt: now
        };
      }

      if (cancelled) return;
      if (Object.keys(next).length > 0) {
        setRepoHealth((prev: Record<string, { score: number; fetchedAt: number }>) => ({ ...prev, ...next }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [issues, repoHealth]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const next = new URL(url.origin + url.pathname);

    if (filters.query) next.searchParams.set('q', filters.query);
    if (filters.language) next.searchParams.set('lang', filters.language);
    if (filters.label) next.searchParams.set('label', filters.label);
    if (filters.sort && filters.sort !== DEFAULT_FILTERS.sort) next.searchParams.set('sort', filters.sort);
    if (filters.state && filters.state !== DEFAULT_FILTERS.state) next.searchParams.set('state', filters.state);
    if (rowsPerPage !== 30) next.searchParams.set('perPage', String(rowsPerPage));

    const nextUrl = next.pathname + (next.search ? next.search : '') + window.location.hash;
    const currentUrl = url.pathname + (url.search ? url.search : '') + window.location.hash;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [filters.query, filters.language, filters.label, filters.sort, filters.state, rowsPerPage]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleTheme = () => {
    setTheme((prev: 'dark' | 'light') => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters((prev: SearchFilters) => ({ ...prev, ...newFilters }));
    // If we are in saved view, maybe we should switch back to discover? 
    // Or maybe apply filters to saved? For now simple switch back.
    if (view === 'saved') setView('discover');
    // setIsSidebarOpen(false); // Valid choice to keep sidebar open if user is refining
  };

  const buildShareUrl = (targetFilters: SearchFilters, perPage: number) => {
    const url = new URL(window.location.href);
    const next = new URL(url.origin + url.pathname);

    if (targetFilters.query) next.searchParams.set('q', targetFilters.query);
    if (targetFilters.language) next.searchParams.set('lang', targetFilters.language);
    if (targetFilters.label) next.searchParams.set('label', targetFilters.label);
    if (targetFilters.sort && targetFilters.sort !== DEFAULT_FILTERS.sort) next.searchParams.set('sort', targetFilters.sort);
    if (targetFilters.state && targetFilters.state !== DEFAULT_FILTERS.state) next.searchParams.set('state', targetFilters.state);
    if (perPage !== 30) next.searchParams.set('perPage', String(perPage));

    next.hash = window.location.hash;
    return next.toString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const saveCurrentSearch = () => {
    const name = newSearchName.trim();
    if (!name) {
      showToast('Please enter a name for this search', 'info');
      return;
    }

    const id = createSavedSearchId();
    const saved: SavedSearch = {
      id,
      name,
      filters: { ...filters, perPage: rowsPerPage },
      createdAt: nowMs()
    };

    setSavedSearches((prev: SavedSearch[]) => [saved, ...prev]);
    setNewSearchName('');
    showToast('Search saved', 'success');
  };

  const applySavedSearch = (search: SavedSearch) => {
    setFilters((prev: SearchFilters) => ({
      ...prev,
      ...search.filters,
      order: 'desc'
    }));
    if (search.filters.perPage) {
      setRowsPerPage(search.filters.perPage);
    }
    if (view === 'saved') setView('discover');
    showToast('Search applied', 'success');
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((prev: SavedSearch[]) => prev.filter((s: SavedSearch) => s.id !== id));
    showToast('Search deleted', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const toggleSaveIssue = (issue: GitHubIssue) => {
    const exists = savedIssues.find(i => i.id === issue.id);
    if (exists) {
      setSavedIssues((prev: SavedIssue[]) => prev.filter((i: SavedIssue) => i.id !== issue.id));
      showToast('Issue removed from saved items', 'info');
    } else {
      setSavedIssues((prev: SavedIssue[]) => [...prev, { ...issue, savedAt: Date.now() }]);
      showToast('Issue saved successfully', 'success');
    }
  };

  const clearSaved = () => {
    if (confirm('Are you sure you want to clear all saved issues?')) {
      setSavedIssues([]);
      showToast('All saved issues cleared', 'info');
    }
  };

  // Keyboard shortcuts for power users
  const shortcuts = useMemo(() => ({
    'd': () => setView('discover'),
    's': () => setView('saved'),
    't': () => toggleTheme(),
    '/': () => {
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      searchInput?.focus();
    }
  }), []);

  useKeyboardShortcuts(shortcuts, !isSettingsOpen);

  const healthScoreForIssue = useCallback((issue: GitHubIssue) => {
    const parts = issue.repository_url.replace('https://api.github.com/repos/', '').split('/');
    const fullName = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : issue.repository_url;
    return repoHealth[fullName]?.score;
  }, [repoHealth]);

  const displayIssues = useMemo(() => {
    if (filters.sort !== 'health') return issues;
    const copy = [...issues];
    copy.sort((a, b) => {
      const aScore = healthScoreForIssue(a) ?? -1;
      const bScore = healthScoreForIssue(b) ?? -1;
      return bScore - aScore;
    });
    return copy;
  }, [filters.sort, healthScoreForIssue, issues]);

  return (
    <div className="dashboard-grid">
      <FilterBar
        onFilterChange={handleFilterChange}
        activeFilters={filters}
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

      {/* Settings Modal - Enhanced */}
      {isSettingsOpen && (
        <div className="sidebar-overlay open" style={{ zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setIsSettingsOpen(false)}>
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', pointerEvents: 'auto', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                  <Settings size={20} color="var(--color-text-muted)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Settings</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', margin: 0 }}>Customize your experience</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="icon-btn"><X size={20} /></button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>

              {/* Appearance Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Appearance</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Theme</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setTheme('light')}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `2px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--color-border)'}`, background: theme === 'light' ? 'var(--color-primary-dim)' : 'var(--color-bg-subtle)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Sun size={18} /> Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `2px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)'}`, background: theme === 'dark' ? 'var(--color-primary-dim)' : 'var(--color-bg-subtle)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Moon size={18} /> Dark
                    </button>
                  </div>
                </div>
              </div>

              {/* Display Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Display</h3>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Issues Per Page</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="custom-select"
                    style={{ width: '100%' }}
                  >
                    <option value={10}>10 Issues</option>
                    <option value={20}>20 Issues</option>
                    <option value={30}>30 Issues (Default)</option>
                    <option value={50}>50 Issues</option>
                    <option value={100}>100 Issues</option>
                  </select>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                    Higher values may take longer to load.
                  </p>
                </div>
              </div>

              {/* Data Management */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Data Management</h3>
                <div style={{ padding: '0.875rem', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Saved Issues</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{savedIssues.length} issues bookmarked locally</p>
                    </div>
                    <Bookmark size={20} color="var(--color-primary)" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        const dataStr = JSON.stringify(savedIssues, null, 2);
                        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                        const link = document.createElement('a');
                        link.setAttribute('href', dataUri);
                        link.setAttribute('download', 'issuefinder-saved.json');
                        link.click();
                        showToast('Saved issues exported!', 'success');
                      }}
                      disabled={savedIssues.length === 0}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: savedIssues.length === 0 ? 'not-allowed' : 'pointer', opacity: savedIssues.length === 0 ? 0.5 : 1, color: 'var(--color-text)' }}
                    >
                      Export JSON
                    </button>
                    <button
                      onClick={clearSaved}
                      disabled={savedIssues.length === 0}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', cursor: savedIssues.length === 0 ? 'not-allowed' : 'pointer', opacity: savedIssues.length === 0 ? 0.5 : 1, color: '#ef4444' }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div style={{ padding: '0.875rem', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Saved Searches</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{savedSearches.length} presets stored locally</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      value={newSearchName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSearchName(e.target.value)}
                      placeholder="Name this search..."
                      style={{ flex: 1, padding: '0.6rem 0.75rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: '0.8rem' }}
                    />
                    <button
                      onClick={saveCurrentSearch}
                      style={{ padding: '0.6rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, background: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'white' }}
                    >
                      Save
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {savedSearches.length === 0 ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', margin: 0 }}>
                        Save a search to quickly re-apply it later.
                      </p>
                    ) : (
                      savedSearches.map((s: SavedSearch) => (
                        <div key={s.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.75rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{new Date(s.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => applySavedSearch(s)}
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-text)' }}
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => {
                                const url = buildShareUrl(s.filters, s.filters.perPage || 30);
                                void (async () => {
                                  const ok = await copyToClipboard(url);
                                  showToast(ok ? 'Share link copied' : 'Failed to copy link', ok ? 'success' : 'error');
                                })();
                              }}
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-text)' }}
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => deleteSavedSearch(s.id)}
                              className="icon-btn"
                              title="Delete"
                              style={{ width: '28px', height: '28px', color: '#ef4444' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>IssueFinder</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>Version 2.1.1</p>
              </div>
              <a href="https://github.com/kanyingidickson-dev/Open-Issue-Finder" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Github size={14} /> View on GitHub
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        {/* Dynamic Header */}
        <header className="app-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="icon-btn"
              style={{ border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <LayoutGrid size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <img
                src={`${import.meta.env.BASE_URL}logo.svg`}
                alt="IssueFinder"
                width={28}
                height={28}
                style={{ display: 'block' }}
              />
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
                        {displayIssues.map((issue) => (
                          <IssueRow
                            key={issue.id}
                            issue={issue}
                            healthScore={healthScoreForIssue(issue)}
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
                          healthScore={healthScoreForIssue(issue)}
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
