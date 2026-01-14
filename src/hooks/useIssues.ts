import { useState, useEffect, useCallback } from 'react';
import { fetchIssues } from '../api/github';
import type { GitHubIssue, SearchFilters } from '../types/github';
import { useDebounce } from './useDebounce';

export const useIssues = (filters: SearchFilters) => {
    const [issues, setIssues] = useState<GitHubIssue[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Debounce the query to avoid excessive API calls
    const debouncedQuery = useDebounce(filters.query, 300);

    const loadIssues = useCallback(async (isMore = false) => {
        if (isMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setPage(1);
        }

        setError(null);
        try {
            const currentPage = isMore ? page + 1 : 1;
            const data = await fetchIssues({
                ...filters,
                query: debouncedQuery
            }, currentPage);
            const newIssues = data as GitHubIssue[];

            if (isMore) {
                setIssues(prev => [...prev, ...newIssues]);
                setPage(currentPage);
            } else {
                setIssues(newIssues);
            }

            const perPage = filters.perPage || 30;
            setHasMore(newIssues.length === perPage);
        } catch (err) {
            console.error('Failed to fetch issues:', err);
            setError('Failed to fetch issues. Please try again later.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters.language, filters.label, debouncedQuery, filters.sort, filters.order, filters.state, filters.perPage, page]);

    const loadMore = () => {
        if (!loading && !loadingMore && hasMore) {
            loadIssues(true);
        }
    };

    useEffect(() => {
        loadIssues();
    }, [filters.language, filters.label, debouncedQuery, filters.sort, filters.order, filters.state, filters.perPage]);

    return { issues, loading, loadingMore, error, hasMore, refetch: loadIssues, loadMore };
};

