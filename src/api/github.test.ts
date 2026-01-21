import { describe, expect, it, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  issuesAndPullRequestsMock: vi.fn(),
  reposGetMock: vi.fn(),
}));

vi.mock('@octokit/rest', () => {
  return {
    Octokit: class {
      rest = {
        search: {
          issuesAndPullRequests: mocks.issuesAndPullRequestsMock,
        },
        repos: {
          get: mocks.reposGetMock,
        },
      };
    },
  };
});

import { fetchIssues } from './github';

beforeEach(() => {
  mocks.issuesAndPullRequestsMock.mockReset();
  mocks.reposGetMock.mockReset();
});

describe('fetchIssues', () => {
  it('expands normalized beginner label into OR clause', async () => {
    mocks.issuesAndPullRequestsMock.mockResolvedValue({ data: { items: [] } });

    await fetchIssues({ label: 'beginner', state: 'open' }, 1);

    expect(mocks.issuesAndPullRequestsMock).toHaveBeenCalledTimes(1);
    const args = mocks.issuesAndPullRequestsMock.mock.calls[0]?.[0];
    expect(args.q).toContain('is:open is:issue');
    expect(args.q).toContain('label:"good first issue"');
    expect(args.q).toContain('OR');
    expect(args.q).toContain('archived:false');
  });

  it('maps health sort to updated for GitHub API', async () => {
    mocks.issuesAndPullRequestsMock.mockResolvedValue({ data: { items: [] } });

    await fetchIssues({ sort: 'health', state: 'open' }, 1);

    const args = mocks.issuesAndPullRequestsMock.mock.calls[0]?.[0];
    expect(args.sort).toBe('updated');
  });
});
