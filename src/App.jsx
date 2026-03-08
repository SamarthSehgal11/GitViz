import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

import RepoInput from './components/RepoInput';
import Loader from './components/Loader';
import ErrorBanner from './components/ErrorBanner';
import RepoInfoCard from './components/RepoInfoCard';
import CommitTimeline from './components/CommitTimeline';
import ContributorsChart from './components/ContributorsChart';
import CommitHeatmap from './components/CommitHeatmap';
import Tooltip from './components/Tooltip';

import { useGitHubData } from './hooks/useGitHubData';
import { parseGitHubUrl } from './utils/parseGitHubUrl';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'about'
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [urlError, setUrlError] = useState('');
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  const { data, loading, error, fetchData } = useGitHubData();

  useEffect(() => {
    if (data && !loading && !error) {
      setIsDashboardVisible(true);
      setAnimatingOut(false);
    }
  }, [data, loading, error]);

  const handleSearch = (url) => {
    setUrlError('');
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      setUrlError('Invalid GitHub repository URL. Please try: https://github.com/facebook/react');
      return;
    }
    setAnimatingOut(true);
    fetchData(parsed.owner, parsed.repo);
  };

  const handleReset = () => {
    setIsDashboardVisible(false);
    setAnimatingOut(false);
    setTimeout(() => {
      fetchData('', '');
    }, 500);
  };

  const showHero = !isDashboardVisible && !loading && page === 'home';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

      {/* Sticky Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5, 7, 9, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⬡</span>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '16px',
            background: 'linear-gradient(135deg, #58a6ff, #bc8cff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>GitViz</span>
        </div>

        {/* Right: Nav links */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setPage('home')} className={`nav-link ${page === 'home' ? 'active' : ''}`}>Home</button>
          <button onClick={() => setPage('about')} className={`nav-link ${page === 'about' ? 'active' : ''}`}>About</button>
          <a href="https://github.com/SamarthSehgal11" target="_blank" rel="noopener noreferrer" className="nav-github-btn">
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* About Page View */}
      {page === 'about' && (
        <div className="about-page animate-in fade-in duration-500">
          {/* Hero */}
          <div className="about-hero">
            <div className="about-avatar-ring">
              <div className="about-avatar-placeholder">SS</div>
            </div>
            <h1 className="about-name">Samarth Sehgal</h1>
            <p className="about-role">Computer Science Engineer · Web Developer</p>
            <p className="about-bio">
              3rd year B.Tech CSE student passionate about data visualization,
              developer tools, and building experiences that make complex
              information beautiful and intuitive.
            </p>
          </div>

          {/* Project Info */}
          <div className="about-card">
            <h2 className="about-section-title">About GitViz</h2>
            <p>
              GitViz is an interactive GitHub repository history visualizer built
              with React, D3.js, and the GitHub REST API. It transforms raw commit
              data into rich visual insights — including commit timelines,
              contributor rankings, and activity heatmaps.
            </p>
            <div className="about-tech-stack">
              {['React 18', 'D3.js v7', 'Vite', 'GitHub REST API',
                'Space Grotesk', 'JetBrains Mono'].map(tech => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
            </div>
          </div>

          {/* Contact */}
          <div className="about-card contact-card">
            <h2 className="about-section-title">Get In Touch</h2>
            <p style={{ color: '#7d8590', marginBottom: '20px' }}>
              Have feedback, want to collaborate, or just say hi?
            </p>
            <div className="contact-buttons">
              <a href="mailto:Samarthsehgal19@gmail.com" className="contact-btn primary">
                ✉ Samarthsehgal19@gmail.com
              </a>
              <a href="https://github.com/SamarthSehgal11"
                target="_blank" rel="noopener noreferrer" className="contact-btn secondary">
                ⬡ github.com/SamarthSehgal11
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section Container with Transitions (Only show on Home page) */}
      {page === 'home' && (
        <div
          className={`fixed inset-0 pt-[60px] w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${showHero && !animatingOut ? 'opacity-100 translate-y-0 visible z-20' : 'opacity-0 -translate-y-12 invisible pointer-events-none z-0'}`}
        >
          <RepoInput onSubmit={handleSearch} isLoading={loading} />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
            <ErrorBanner message={urlError || error} />
          </div>
        </div>
      )}

      {/* Loading Skeleton Transition Container */}
      {page === 'home' && loading && (
        <div className="min-h-screen pt-[120px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto absolute inset-0 z-30 pointer-events-none">
          <div className={`transition-all duration-300 ${loading ? 'opacity-100 filter blur-0 scale-100' : 'opacity-0 filter blur-sm scale-[0.98]'}`}>
            <Loader />
          </div>
        </div>
      )}

      {/* Dashboard View */}
      {page === 'home' && isDashboardVisible && !loading && data && (
        <main className="dashboard pt-12 relative z-10">

          <div className="flex justify-between items-center mb-4 mt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors hover:shadow-glow-blue border border-transparent hover:border-border-hover px-4 py-2 rounded-full glass-card bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">New Repo</span>
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-top-8 duration-[800ms] fill-mode-forwards opacity-0 translate-y-8 [animation-delay:0ms]">
            <RepoInfoCard repo={data.repo} />
          </div>

          <div className="animate-in fade-in slide-in-from-left-8 duration-[800ms] fill-mode-forwards opacity-0 translate-x-8 [animation-delay:150ms]">
            <CommitTimeline data={data.commits} setTooltip={setTooltip} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 items-start">
            <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] fill-mode-forwards opacity-0 -translate-x-8 [animation-delay:300ms]">
              <ContributorsChart data={data.contributors} setTooltip={setTooltip} />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-[800ms] fill-mode-forwards opacity-0 translate-y-8 [animation-delay:450ms]">
              <CommitHeatmap data={data.commits} setTooltip={setTooltip} />
            </div>
          </div>

        </main>
      )}

      {/* Global Glassmorphic Tooltip */}
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.content}
      </Tooltip>

    </div>
  );
}
