import { useState, useEffect, useCallback } from 'react';
import { fetchIssues } from '../api/github';
import type { GitHubIssue, SearchFilters } from '../types/github';

export const useIssues = (filters: SearchFilters) => {
    const [issues, setIssues] = useState<GitHubIssue[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadIssues = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchIssues(filters);
            setIssues(data as GitHubIssue[]);
        } catch (err) {
            setError('Failed to fetch issues. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [filters.language, filters.label, filters.query]);

    useEffect(() => {
        loadIssues();
    }, [loadIssues]);

    return { issues, loading, error, refetch: loadIssues };
};
