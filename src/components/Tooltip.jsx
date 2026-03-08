export default function Tooltip({ visible, x, y, children }) {
    if (!visible) return null;

    return (
        <div
            className="absolute glass-card px-4 py-3 text-sm text-text-primary z-50 pointer-events-none transform transition-all duration-150 ease-out shadow-2xl"
            style={{
                left: x + 15,
                top: y + 15,
                whiteSpace: 'pre-wrap',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
            }}
        >
            {typeof children === 'string' ? (
                <div className="font-mono text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: children }} />
            ) : children}
        </div>
    );
}
