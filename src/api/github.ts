import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN || undefined,
});

export const fetchIssues = async (filters: { language?: string; label?: string; query?: string; sort?: 'created' | 'comments' | 'updated'; order?: 'desc' | 'asc'; state?: 'open' | 'closed' | 'all'; perPage?: number }, page = 1) => {
    const state = filters.state || 'open';
    let queryString = `is:${state} is:issue`;

    if (filters.label) {
        queryString += ` label:"${filters.label}"`;
    }

    if (filters.language) {
        queryString += ` language:${filters.language}`;
    }

    if (filters.query) {
        queryString += ` ${filters.query}`;
    }

    // Default to 'no:assignee' to find help wanted? No, let's keep it broad.
    // Maybe add 'archived:false'?
    queryString += ' archived:false';

    try {
        const { data } = await octokit.rest.search.issuesAndPullRequests({
            q: queryString,
            sort: filters.sort || 'created',
            order: filters.order || 'desc',
            per_page: filters.perPage || 30,
            page,
        });

        return data.items;
    } catch (error) {
        console.error('Error fetching issues:', error);
        throw error;
    }
};

export const fetchRepoDetails = async (repoUrl: string) => {
    const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/');
    const [owner, repo] = parts;

    try {
        const { data } = await octokit.rest.repos.get({
            owner,
            repo,
        });
        return data;
    } catch (error) {
        console.error('Error fetching repo details:', error);
        return null;
    }
};
