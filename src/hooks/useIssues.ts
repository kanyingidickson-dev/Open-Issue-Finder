import { useState, useEffect, useCallback } from 'react';
import { fetchIssues } from '../api/github';
import type { GitHubIssue, SearchFilters } from '../types/github';

export const useIssues = (filters: SearchFilters) => {
    const [issues, setIssues] = useState<GitHubIssue[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

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
            const data = await fetchIssues(filters, currentPage);
            const newIssues = data as GitHubIssue[];

            if (isMore) {
                setIssues(prev => [...prev, ...newIssues]);
                setPage(currentPage);
            } else {
                setIssues(newIssues);
            }

            setHasMore(newIssues.length === 30);
        } catch (err) {
            setError('Failed to fetch issues. Please try again later.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters.language, filters.label, filters.query, page]);

    const loadMore = () => {
        if (!loading && !loadingMore && hasMore) {
            loadIssues(true);
        }
    };

    useEffect(() => {
        loadIssues();
    }, [filters.language, filters.label, filters.query]);

    return { issues, loading, loadingMore, error, hasMore, refetch: loadIssues, loadMore };
};
