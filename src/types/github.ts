export interface GitHubIssue {
    id: number;
    title: string;
    html_url: string;
    state: 'open' | 'closed';
    user: {
        login: string;
        avatar_url: string;
    } | null;
    labels: {
        id?: number;
        name: string;
        color: string;
        description?: string;
    }[];
    repository_url: string;
    created_at: string;
    body: string | null;
    comments: number;
    number: number;
}

export interface RepositoryMetadata {
    full_name: string;
    language: string;
    stargazers_count: number;
    description: string;
    html_url: string;
}

export type SearchFilters = {
    language?: string;
    label?: string;
    query?: string;
    sort?: 'created' | 'comments' | 'updated';
    order?: 'desc' | 'asc';
    state?: 'open' | 'closed' | 'all';
    perPage?: number;
};

export interface SavedIssue extends GitHubIssue {
    savedAt: number;
}
