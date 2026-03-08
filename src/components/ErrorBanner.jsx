import { AlertTriangle } from 'lucide-react';

export default function ErrorBanner({ message }) {
    if (!message) return null;

    return (
        <div className="flex items-center gap-3 bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded-md my-6 w-full max-w-2xl mx-auto shadow-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
