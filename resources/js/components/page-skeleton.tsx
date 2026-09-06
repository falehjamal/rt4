import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function Card({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] ${className}`}
        >
            {children}
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-5 p-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="flex items-center py-5">
                        <Skeleton className="size-14 rounded-full" />
                        <div className="ml-4 flex flex-1 flex-col gap-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="mt-2 h-3 w-64" />
                    <div className="mt-6 flex flex-col gap-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex flex-1 flex-col gap-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="lg:col-span-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="mt-2 h-3 w-56" />
                    <div className="mt-6 flex flex-col gap-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-8 rounded-full" />
                                    <Skeleton className="size-10 rounded-full" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-3 w-28" />
                                        <Skeleton className="h-2 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-3 w-48" />
                <div className="mt-6 flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-4"
                        >
                            <div className="flex flex-1 flex-col gap-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function TablePageSkeleton({
    showWidgets = false,
}: {
    showWidgets?: boolean;
}) {
    return (
        <div className="flex flex-1 flex-col gap-5 p-4">
            {showWidgets && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="flex items-center py-5">
                            <Skeleton className="size-14 rounded-full" />
                            <div className="ml-4 flex flex-1 flex-col gap-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-6 w-28" />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-3 w-72" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-3 flex-1" />
                        ))}
                    </div>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Skeleton className="size-8 rounded-md" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function SettingsSkeleton() {
    return (
        <div className="px-4 py-6">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-36" />
                <Skeleton className="h-4 w-72" />
            </div>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex w-full flex-col gap-2 lg:w-48">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-9 w-full" />
                    ))}
                </div>

                <div className="flex-1 md:max-w-2xl">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                        ))}
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PageSkeleton({ path }: { path: string }) {
    if (path.startsWith('/settings')) {
        return <SettingsSkeleton />;
    }

    if (path === '/' || path === '/dashboard') {
        return <DashboardSkeleton />;
    }

    if (path.startsWith('/keuangan/laporan')) {
        return <TablePageSkeleton showWidgets />;
    }

    return <TablePageSkeleton />;
}
