import { Spinner } from '@/components/ui/spinner';
import { usePageLoading } from '@/hooks/use-page-loading';

export default function PageLoader() {
    const { loading } = usePageLoading();

    if (!loading) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-50">
            <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5">
                <Spinner className="text-brand-500 size-5" />
                <span className="sr-only">Memuat</span>
            </div>
        </div>
    );
}
