import { useState, useCallback } from 'react';

const GITHUB_API_URL = 'https://api.github.com';
const HEADERS = {
    Accept: 'application/vnd.github+json'
};

export function useGitHubData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (owner, repo) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const [repoRes, commitsRes, contributorsRes] = await Promise.all([
                fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, { headers: HEADERS }),
                fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=100&page=1`, { headers: HEADERS }),
                fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contributors?per_page=100`, { headers: HEADERS })
            ]);

            if (!repoRes.ok || !commitsRes.ok || !contributorsRes.ok) {
                let errorMsg = 'Failed to fetch repository data.';

                if (repoRes.status === 403 || commitsRes.status === 403 || contributorsRes.status === 403) {
                    errorMsg = 'GitHub API rate limit exceeded. Please try again later.';
                } else if (repoRes.status === 404) {
                    errorMsg = 'Repository not found or is private.';
                }
                throw new Error(errorMsg);
            }

            const [repoData, commitsData, contributorsData] = await Promise.all([
                repoRes.json(),
                commitsRes.json(),
                contributorsRes.json()
            ]);

            setData({
                repo: repoData,
                commits: commitsData,
                contributors: contributorsData
            });

        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchData };
}
