import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    Home,
    Megaphone,
    Users,
    Wallet,
} from 'lucide-react';
import Widget from '@/components/horizon/widget';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

type Stat = {
    key: string;
    title: string;
    value: string;
};

type Warga = {
    id: number;
    name: string;
    username: string;
    phone: string;
    joined: string | null;
};

const statIcons: Record<string, typeof Users> = {
    warga: Users,
    iuran: Wallet,
    pengaduan: Megaphone,
    kegiatan: Activity,
};

export default function Dashboard({
    stats,
    wargaTerbaru,
}: {
    stats: Stat[];
    wargaTerbaru: Warga[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div className="from-brand-500 to-brand-700 relative overflow-hidden rounded-[20px] bg-gradient-to-br px-6 py-8 text-white">
                    <p className="text-sm font-medium text-white/80">
                        Selamat datang
                    </p>
                    <h2 className="mt-1 text-3xl font-bold">
                        {auth.user.name}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/80">
                        Ringkasan aktivitas RT 4. Gunakan menu di samping untuk
                        mengelola data warga dan layanan lingkungan.
                    </p>
                    <Home className="absolute right-8 bottom-6 size-24 text-white/10" />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = statIcons[stat.key] ?? Users;

                        return (
                            <Widget
                                key={stat.key}
                                icon={<Icon className="size-7" />}
                                title={stat.title}
                                subtitle={stat.value}
                            />
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] xl:col-span-3">
                        <h3 className="text-navy-700 text-lg font-bold">
                            Warga terbaru
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Akun yang baru terdaftar di sistem.
                        </p>

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[520px] text-left text-sm">
                                <thead>
                                    <tr className="text-horizon-gray border-b border-gray-100">
                                        <th className="pb-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Username
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Nomor HP
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Bergabung
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wargaTerbaru.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-horizon-gray py-8 text-center"
                                            >
                                                Belum ada data warga.
                                            </td>
                                        </tr>
                                    ) : (
                                        wargaTerbaru.map((warga) => (
                                            <tr
                                                key={warga.id}
                                                className="text-navy-700 border-b border-gray-50 last:border-0"
                                            >
                                                <td className="py-3 font-semibold">
                                                    {warga.name}
                                                </td>
                                                <td className="py-3">
                                                    {warga.username}
                                                </td>
                                                <td className="py-3">
                                                    {warga.phone}
                                                </td>
                                                <td className="py-3">
                                                    {warga.joined}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] xl:col-span-2">
                        <h3 className="text-navy-700 text-lg font-bold">
                            Aktivitas
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Status layanan lingkungan minggu ini.
                        </p>
                        <div className="mt-6 space-y-4">
                            {[
                                { label: 'Iuran terkumpul', value: 20 },
                                { label: 'Kegiatan terlaksana', value: 45 },
                                { label: 'Pengaduan selesai', value: 70 },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="text-navy-700 font-medium">
                                            {item.label}
                                        </span>
                                        <span className="text-horizon-gray">
                                            {item.value}%
                                        </span>
                                    </div>
                                    <div className="bg-light-primary h-2 rounded-full">
                                        <div
                                            className="from-brand-400 to-brand-600 h-2 rounded-full bg-gradient-to-r"
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
