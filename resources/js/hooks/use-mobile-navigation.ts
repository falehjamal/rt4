import { useCallback } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export type CleanupFn = () => void;

export function useMobileNavigation(): CleanupFn {
    const { setOpenMobile } = useSidebar();

    return useCallback(() => {
        setOpenMobile(false);
        document.body.style.removeProperty('pointer-events');
    }, [setOpenMobile]);
}
