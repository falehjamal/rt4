import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export default function PwaInstallPrompt() {
    const { open, canInstall, install, dismiss, onOpenChange } =
        usePwaInstall();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[20px] sm:max-w-md">
                <DialogHeader>
                    <div className="mb-2 flex size-12 items-center justify-center overflow-hidden rounded-2xl bg-navy-900">
                        <img
                            src="/logo.png"
                            alt=""
                            className="size-10 object-contain"
                        />
                    </div>
                    <DialogTitle>Pasang RT 04 di desktop</DialogTitle>
                    <DialogDescription>
                        {canInstall
                            ? 'Install aplikasi ini di komputer agar bisa dibuka langsung, tanpa ketik alamat di browser.'
                            : 'Di Chrome atau Edge, klik ikon install di bilah alamat, atau buka menu browser lalu pilih Install RT 04.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={dismiss}>
                        Nanti
                    </Button>
                    {canInstall ? (
                        <Button
                            type="button"
                            className="bg-brand-500 hover:bg-brand-600"
                            onClick={() => void install()}
                        >
                            <Download />
                            Install
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="bg-brand-500 hover:bg-brand-600"
                            onClick={dismiss}
                        >
                            Mengerti
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
