import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthHorizonLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative flex min-h-svh bg-white">
            <div className="mx-auto flex min-h-svh w-full max-w-[1383px] flex-col justify-start px-5 pt-12 md:max-w-[75%] md:px-12 lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:px-0 xl:pl-[70px]">
                <div className="mb-auto flex flex-col lg:max-w-[48%] xl:max-w-full">
                    <Link
                        href={home()}
                        className="mt-0 flex w-max items-center gap-3 lg:pt-10"
                    >
                        <span className="bg-brand-500 flex size-10 items-center justify-center rounded-xl text-white">
                            <AppLogoIcon className="size-5 fill-current" />
                        </span>
                        <span className="text-navy-700 text-lg font-bold">
                            {name}
                        </span>
                    </Link>

                    <div className="mt-[10vh] w-full max-w-full xl:max-w-[420px]">
                        <h1 className="text-navy-700 mb-2.5 text-4xl font-bold">
                            {title}
                        </h1>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                            {description}
                        </p>
                        {children}
                    </div>
                </div>
            </div>

            <div className="from-brand-400 to-brand-600 absolute top-0 right-0 hidden h-full min-h-svh bg-gradient-to-br lg:block lg:w-[49vw] lg:rounded-bl-[120px] xl:w-[44vw] xl:rounded-bl-[200px]">
                <div className="flex h-full flex-col items-center justify-center px-10 text-center text-white">
                    <p className="text-sm font-medium tracking-[0.3em] uppercase opacity-80">
                        Sistem Informasi
                    </p>
                    <h2 className="mt-3 text-4xl font-bold">RT 4</h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                        Kelola data warga, iuran, dan kegiatan lingkungan dari
                        satu dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}
