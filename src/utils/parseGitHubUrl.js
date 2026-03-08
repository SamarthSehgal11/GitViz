export function parseGitHubUrl(url) {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname !== 'github.com') {
            return null;
        }
        const parts = parsedUrl.pathname.split('/').filter(Boolean);
        if (parts.length < 2) {
            return null;
        }
        return {
            owner: parts[0],
            repo: parts[1]
        };
    } catch (error) {
        if (typeof url === 'string') {
            const parts = url.replace('https://github.com/', '').split('/').filter(Boolean);
            if (parts.length >= 2) {
                return {
                    owner: parts[0],
                    repo: parts[1]
                };
            }
        }
        return null;
    }
}
