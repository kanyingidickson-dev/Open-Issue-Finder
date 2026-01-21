import { Octokit } from '@octokit/rest';

const getGithubToken = () => {
    const metaEnv = (import.meta as unknown as { env?: { VITE_GITHUB_TOKEN?: string } }).env;
    if (metaEnv?.VITE_GITHUB_TOKEN) return metaEnv.VITE_GITHUB_TOKEN;

    return undefined;
};

const octokit = new Octokit({
    auth: getGithubToken(),
});

const buildLabelClause = (label: string) => {
    const normalized = label.trim().toLowerCase();

    const variants: Record<string, string[]> = {
        beginner: [
            'good first issue',
            'good-first-issue',
            'beginner',
            'beginner friendly',
            'easy',
            'starter',
            'first-timers-only',
            'up-for-grabs',
        ],
        help_wanted: ['help wanted', 'help-wanted'],
        docs: ['documentation', 'docs'],
        enhancement: ['enhancement', 'feature', 'feature request'],
        bug: ['bug', 'type: bug'],
    };

    if (!normalized) return '';

    const expanded = variants[normalized];
    if (!expanded) {
        return ` label:"${label}"`;
    }

    const orParts = expanded.map(v => `label:"${v}"`).join(' OR ');
    return ` (${orParts})`;
};

export const fetchIssues = async (filters: { language?: string; label?: string; query?: string; sort?: 'created' | 'comments' | 'updated' | 'health'; order?: 'desc' | 'asc'; state?: 'open' | 'closed' | 'all'; perPage?: number }, page = 1) => {
    const state = filters.state || 'open';
    let queryString = `is:${state} is:issue`;

    if (filters.label) {
        queryString += buildLabelClause(filters.label);
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
        const sort = filters.sort === 'health' ? 'updated' : (filters.sort || 'created');
        const { data } = await octokit.rest.search.issuesAndPullRequests({
            q: queryString,
            sort,
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
