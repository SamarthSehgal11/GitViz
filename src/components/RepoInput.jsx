import { useState, useEffect, useRef } from 'react';
import { Github, ArrowRight, Loader2 } from 'lucide-react';

export default function RepoInput({ onSubmit, isLoading }) {
    const [url, setUrl] = useState('');
    const canvasRef = useRef(null);

    // Particle Canvas Background
    useEffect(() => {
        if (window.innerWidth < 768) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(140, 160, 200, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(140, 160, 200, ${0.15 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onSubmit(url.trim());
        }
    };

    const setExample = (exampleUrl) => {
        setUrl(exampleUrl);
        onSubmit(exampleUrl);
    };

    return (
        <div className="hero-container">
            <canvas ref={canvasRef} className="particle-canvas hidden md:block" />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px' }}>
                <h1 className="hero-title">Git History, Visualized</h1>
                <p className="hero-subtitle">Explore commits, contributors & activity of any public GitHub repo</p>

                <form onSubmit={handleSubmit} className="repo-input-wrapper">
                    <Github className="w-6 h-6 input-icon" />
                    <input
                        type="text"
                        placeholder="https://github.com/facebook/react"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !url.trim()} className="visualize-btn">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <span className="hidden sm:inline">Visualize</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="example-chips">
                    {[
                        { label: 'facebook/react', url: 'https://github.com/facebook/react' },
                        { label: 'torvalds/linux', url: 'https://github.com/torvalds/linux' },
                        { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
                        { label: 'microsoft/vscode', url: 'https://github.com/microsoft/vscode' }
                    ].map((example) => (
                        <button
                            key={example.label}
                            onClick={() => setExample(example.url)}
                            disabled={isLoading}
                            className="chip"
                        >
                            <span className="chip-icon">▶</span>
                            {example.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
