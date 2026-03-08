import { useState, useEffect } from 'react';

export function useCountUp(end, duration = 1200) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const animateCount = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            const percentage = Math.min(progress / duration, 1);

            // easeOutExpo
            const easing = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            setCount(Math.floor(end * easing));

            if (progress < duration) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [end, duration]);

    return count;
}
