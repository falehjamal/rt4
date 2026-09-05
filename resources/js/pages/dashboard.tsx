import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CalendarDays,
    Home,
    Landmark,
    ListChecks,
    Users,
    Wallet,
} from 'lucide-react';
import Widget from '@/components/horizon/widget';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index as iuranIndex } from '@/routes/keuangan/iuran';
import { index as kasIndex } from '@/routes/keuangan/kas';
import type { Auth } from '@/types';

type Stat = {
    key: string;
    title: string;
    value: string;
};

type IuranRingkas = {
    id: number;
    member: string;
    nominal: string;
    tanggal_label: string | null;
    keterangan: string | null;
};

type MutasiRingkas = {
    id: number;
    jenis: 'masuk' | 'keluar';
    jenis_label: string;
    kategori_label: string;
    nominal: string;
    tanggal_label: string | null;
};

const statIcons: Record<string, typeof Users> = {
    warga: Users,
    iuran: Wallet,
    saldo: Landmark,
    keluar: ArrowUpRight,
    bulan: CalendarDays,
    jumlah: ListChecks,
    terakhir: CalendarDays,
};

function formatRupiah(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatStat(stat: Stat): string {
    if (['iuran', 'saldo', 'keluar', 'bulan'].includes(stat.key)) {
        return formatRupiah(stat.value);
    }

    return stat.value;
}

export default function Dashboard({
    canManage,
    stats,
    iurans,
    mutasi,
}: {
    canManage: boolean;
    stats: Stat[];
    iurans: IuranRingkas[];
    mutasi: MutasiRingkas[];
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
                        {canManage
                            ? 'Ringkasan iuran dan kas RT. Kelola data lewat menu di samping.'
                            : 'Cek iuran yang sudah kamu bayar. Detail lengkap ada di menu Iuran Saya.'}
                    </p>
                    <Home className="absolute right-8 bottom-6 size-24 text-white/10" />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = statIcons[stat.key] ?? Wallet;

                        return (
                            <Widget
                                key={stat.key}
                                icon={<Icon className="size-7" />}
                                title={stat.title}
                                subtitle={formatStat(stat)}
                            />
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] xl:col-span-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-navy-700 text-lg font-bold">
                                    {canManage
                                        ? 'Iuran terbaru'
                                        : 'Iuran kamu'}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {canManage
                                        ? 'Setoran member yang baru tercatat.'
                                        : 'Riwayat setoran iuran milikmu.'}
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href={iuranIndex()}>
                                    {canManage ? 'Iuran Member' : 'Iuran Saya'}
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[520px] text-left text-sm">
                                <thead>
                                    <tr className="text-horizon-gray border-b border-gray-100">
                                        {canManage && (
                                            <th className="pb-3 font-medium">
                                                Member
                                            </th>
                                        )}
                                        <th className="pb-3 font-medium">
                                            Nominal
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Tanggal
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {iurans.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={canManage ? 4 : 3}
                                                className="text-horizon-gray py-8 text-center"
                                            >
                                                Belum ada iuran.
                                            </td>
                                        </tr>
                                    ) : (
                                        iurans.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="text-navy-700 border-b border-gray-50 last:border-0"
                                            >
                                                {canManage && (
                                                    <td className="py-3 font-semibold">
                                                        {row.member}
                                                    </td>
                                                )}
                                                <td className="py-3 font-semibold">
                                                    {formatRupiah(row.nominal)}
                                                </td>
                                                <td className="py-3">
                                                    {row.tanggal_label ?? '-'}
                                                </td>
                                                <td className="py-3">
                                                    {row.keterangan ?? '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] xl:col-span-2">
                        {canManage ? (
                            <>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-navy-700 text-lg font-bold">
                                            Mutasi kas
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Uang masuk dan keluar terbaru.
                                        </p>
                                    </div>
                                    <Button variant="outline" asChild>
                                        <Link href={kasIndex()}>Kas RT</Link>
                                    </Button>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {mutasi.length === 0 ? (
                                        <p className="text-horizon-gray text-sm">
                                            Belum ada mutasi kas.
                                        </p>
                                    ) : (
                                        mutasi.map((row) => (
                                            <div
                                                key={row.id}
                                                className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                                            >
                                                <div>
                                                    <p className="text-navy-700 text-sm font-semibold">
                                                        {row.kategori_label}
                                                    </p>
                                                    <p className="text-horizon-gray text-xs">
                                                        {row.tanggal_label} ·{' '}
                                                        {row.jenis_label}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        row.jenis === 'masuk'
                                                            ? 'text-emerald-700'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {row.jenis === 'masuk'
                                                        ? '+'
                                                        : '-'}
                                                    {formatRupiah(row.nominal)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-navy-700 text-lg font-bold">
                                    Iuran Saya
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Menu yang bisa kamu buka. Data iuran hanya
                                    milikmu.
                                </p>
                                <Button
                                    asChild
                                    className="bg-brand-500 hover:bg-brand-600 mt-5"
                                >
                                    <Link href={iuranIndex()}>
                                        Buka Iuran Saya
                                    </Link>
                                </Button>
                            </>
                        )}
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
