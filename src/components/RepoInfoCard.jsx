import { Star, GitFork, CircleDot, Code } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

function CountUpBadge({ icon, value, label }) {
    const count = useCountUp(value);

    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50px', padding: '5px 14px', fontSize: '13px',
            fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3'
        }}>
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span>{count.toLocaleString()} {label}</span>
        </div>
    );
}

export default function RepoInfoCard({ repo }) {
    if (!repo) return null;

    return (
        <div className="repo-info-card">
            <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer">
                <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login} avatar`}
                    className="repo-avatar"
                />
            </a>

            <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 truncate font-display" style={{ color: 'var(--text-primary)' }}>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
                        {repo.full_name}
                    </a>
                </h2>

                <p className="text-text-secondary mb-6 max-w-3xl leading-relaxed text-base font-light">
                    {repo.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-3">
                    <CountUpBadge icon="⭐" value={repo.stargazers_count} />
                    <CountUpBadge icon="🍴" value={repo.forks_count} />
                    <CountUpBadge icon="🎯" value={repo.open_issues_count} />
                    {repo.language && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50px', padding: '5px 14px', fontSize: '13px',
                            fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3'
                        }}>
                            <span style={{ fontSize: '16px' }}>💻</span>
                            <span className="font-semibold text-text-primary">{repo.language}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
