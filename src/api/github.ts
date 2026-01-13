import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN || undefined,
});

export const fetchIssues = async (filters: { language?: string; label?: string; query?: string }) => {
    let queryString = 'is:open is:issue';

    if (filters.label) {
        queryString += ` label:"${filters.label}"`;
    }

    if (filters.language) {
        queryString += ` language:${filters.language}`;
    }

    if (filters.query) {
        queryString += ` ${filters.query}`;
    }

    try {
        const { data } = await octokit.rest.search.issuesAndPullRequests({
            q: queryString,
            sort: 'created',
            order: 'desc',
            per_page: 30,
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
