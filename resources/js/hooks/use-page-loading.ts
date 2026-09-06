import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export type PageLoading = {
    loading: boolean;
    showSkeleton: boolean;
    path: string;
};

function visitPath(url: string | URL): string {
    const raw = typeof url === 'string' ? url : url.toString();

    try {
        return new URL(raw, window.location.origin).pathname;
    } catch {
        return raw;
    }
}

export function usePageLoading(): PageLoading {
    const [loading, setLoading] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [path, setPath] = useState('');

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            const visit = event.detail.visit;

            if (visit.prefetch) {
                return;
            }

            setPath(visitPath(visit.url));
            setLoading(true);
            setShowSkeleton(String(visit.method).toLowerCase() === 'get');
        });

        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.prefetch) {
                return;
            }

            setLoading(false);
            setShowSkeleton(false);
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return { loading, showSkeleton, path };
}
