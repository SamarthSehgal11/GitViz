export default function Loader() {
    return (
        <div className="w-full max-w-7xl mx-auto mt-12 space-y-8 animate-in fade-in duration-500">
            {/* Repo Info Skeleton */}
            <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent -translate-x-full animate-shimmer"></div>

                <div className="w-20 h-20 rounded-full bg-[#ffffff0a] shrink-0"></div>
                <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                    <div className="h-8 bg-[#ffffff0a] rounded-md w-3/4 mx-auto sm:mx-0"></div>
                    <div className="h-4 bg-[#ffffff0a] rounded-md w-full max-w-2xl mx-auto sm:mx-0"></div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                        <div className="h-8 w-24 bg-[#ffffff0a] rounded-full"></div>
                        <div className="h-8 w-24 bg-[#ffffff0a] rounded-full"></div>
                        <div className="h-8 w-24 bg-[#ffffff0a] rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Timeline Skeleton */}
            <div className="glass-card p-6 h-[400px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent -translate-x-full animate-shimmer"></div>
                <div className="h-6 w-48 bg-[#ffffff0a] rounded-md mb-8"></div>
                <div className="w-full h-full border-b border-l border-[#ffffff0a] flex items-end justify-between px-4 pb-4">
                    {/* Fake bars/dots */}
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="w-2 bg-[#ffffff0a] rounded-t-sm" style={{ height: `${Math.random() * 60 + 10}%` }}></div>
                    ))}
                </div>
            </div>

            {/* Bottom Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="glass-card p-6 h-[450px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent -translate-x-full animate-shimmer"></div>
                    <div className="h-6 w-48 bg-[#ffffff0a] rounded-md mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#ffffff0a]"></div>
                                <div className="h-6 bg-[#ffffff0a] rounded-md flex-grow" style={{ width: `${80 - i * 5}%` }}></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card p-6 h-[450px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent -translate-x-full animate-shimmer"></div>
                    <div className="h-6 w-48 bg-[#ffffff0a] rounded-md mb-8"></div>
                    <div className="w-full h-4/5 bg-[#ffffff05] rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
