import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'rt4.pwa.install.seen';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function alreadyInstalled(): boolean {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in navigator &&
            (navigator as Navigator & { standalone?: boolean }).standalone ===
                true)
    );
}

export function usePwaInstall() {
    const [open, setOpen] = useState(false);
    const [promptEvent, setPromptEvent] =
        useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        if (alreadyInstalled() || localStorage.getItem(STORAGE_KEY)) {
            return;
        }

        const onPrompt = (event: Event) => {
            event.preventDefault();
            setPromptEvent(event as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', onPrompt);

        const timer = window.setTimeout(() => {
            setOpen(true);
        }, 1200);

        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.clearTimeout(timer);
        };
    }, []);

    const markSeen = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, '1');
    }, []);

    const dismiss = useCallback(() => {
        markSeen();
        setOpen(false);
    }, [markSeen]);

    const install = useCallback(async () => {
        if (!promptEvent) {
            dismiss();

            return;
        }

        await promptEvent.prompt();
        await promptEvent.userChoice;
        markSeen();
        setPromptEvent(null);
        setOpen(false);
    }, [dismiss, markSeen, promptEvent]);

    return {
        open,
        canInstall: promptEvent !== null,
        install,
        dismiss,
        onOpenChange: (next: boolean) => {
            if (next) {
                setOpen(true);

                return;
            }

            dismiss();
        },
    };
}
