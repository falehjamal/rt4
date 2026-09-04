import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function PageLoader() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setLoading(true));
        const removeFinish = router.on('finish', () => setLoading(false));

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    if (!loading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-lg">
                <Spinner className="text-brand-500 size-8" />
                <p className="text-navy-700 text-sm font-medium">Memuat...</p>
            </div>
        </div>
    );
}
