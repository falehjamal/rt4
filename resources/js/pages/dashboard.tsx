import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Landmark,
    Users,
    Wallet,
} from 'lucide-react';
import { dashboard } from '@/routes';
import { index as iuranIndex } from '@/routes/keuangan/iuran';
import { index as kasIndex } from '@/routes/keuangan/kas';

type Stat = {
    key: string;
    title: string;
    value: string;
};

type IuranRingkas = {
    id: number;
    member: string;
    username?: string;
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

const statThemes: Record<
    string,
    {
        icon: typeof Users;
        iconWrap: string;
        iconColor: string;
        caption: (value: string) => string;
        format: (value: string) => string;
    }
> = {
    warga: {
        icon: Users,
        iconWrap: 'bg-sky-50',
        iconColor: 'text-sky-500',
        caption: () => 'Warga aktif terdaftar',
        format: (value) => `${value} orang`,
    },
    iuran: {
        icon: Wallet,
        iconWrap: 'bg-violet-50',
        iconColor: 'text-violet-500',
        caption: () => 'Tercatat bulan ini',
        format: formatRupiah,
    },
    total: {
        icon: Wallet,
        iconWrap: 'bg-violet-50',
        iconColor: 'text-violet-500',
        caption: () => 'Semua setoran kamu',
        format: formatRupiah,
    },
    semua: {
        icon: Users,
        iconWrap: 'bg-sky-50',
        iconColor: 'text-sky-500',
        caption: () => 'Akumulasi setoran seluruh member',
        format: formatRupiah,
    },
    saldo: {
        icon: Landmark,
        iconWrap: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        caption: (value) =>
            Number(value) > 0 ? 'Aman & terverifikasi' : 'Perlu perhatian',
        format: formatRupiah,
    },
    keluar: {
        icon: ArrowUpRight,
        iconWrap: 'bg-rose-50',
        iconColor: 'text-rose-500',
        caption: () => 'Pengeluaran bulan ini',
        format: formatRupiah,
    },
};

const avatarColors = [
    'bg-amber-100 text-amber-700',
    'bg-sky-100 text-sky-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
];

const badgeColors = [
    'bg-emerald-50 text-emerald-700',
    'bg-violet-50 text-violet-700',
    'bg-sky-50 text-sky-700',
    'bg-amber-50 text-amber-700',
];

function formatRupiah(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function initial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?';
}

function colorByText(name: string, palette: string[]): string {
    let hash = 0;

    for (const char of name) {
        hash = (hash + char.charCodeAt(0)) % palette.length;
    }

    return palette[hash] ?? palette[0];
}

function rankColor(index: number): string {
    if (index === 0) {
        return 'bg-amber-100 text-amber-700';
    }

    if (index === 1) {
        return 'bg-slate-100 text-slate-600';
    }

    if (index === 2) {
        return 'bg-orange-100 text-orange-700';
    }

    return 'bg-gray-50 text-gray-500';
}

type IuranTerbanyak = {
    id: number;
    member: string;
    username: string;
    nominal: string;
};

export default function Dashboard({
    canManage,
    stats,
    iurans,
    iuranTerbanyak,
    mutasi,
}: {
    canManage: boolean;
    stats: Stat[];
    iurans: IuranRingkas[];
    iuranTerbanyak: IuranTerbanyak[];
    mutasi: MutasiRingkas[];
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div
                    className={`grid grid-cols-1 gap-5 md:grid-cols-2 ${canManage ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}
                >
                    {stats.map((stat) => {
                        const theme = statThemes[stat.key] ?? statThemes.iuran;
                        const Icon = theme.icon;

                        return (
                            <div
                                key={stat.key}
                                className="relative rounded-[20px] bg-white p-5 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]"
                            >
                                <div
                                    className={`absolute top-4 right-4 flex size-11 items-center justify-center rounded-full ${theme.iconWrap}`}
                                >
                                    <Icon
                                        className={`size-5 ${theme.iconColor}`}
                                    />
                                </div>
                                <p className="text-[11px] font-semibold tracking-[0.14em] text-gray-400 uppercase">
                                    {stat.title}
                                </p>
                                <p className="text-navy-700 mt-3 pr-12 text-2xl leading-tight font-bold">
                                    {theme.format(stat.value)}
                                </p>
                                <p
                                    className={`mt-3 text-xs font-medium ${
                                        stat.key === 'saldo' &&
                                        Number(stat.value) <= 0
                                            ? 'text-rose-600'
                                            : 'text-emerald-600'
                                    }`}
                                >
                                    {theme.caption(stat.value)}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div
                    className={
                        canManage
                            ? 'grid grid-cols-1 gap-5 lg:grid-cols-5'
                            : undefined
                    }
                >
                    {canManage && (
                        <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] lg:col-span-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-navy-700 text-lg font-bold">
                                        Iuran Terbaru
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Setoran member yang baru tercatat.
                                    </p>
                                </div>
                                <Link
                                    href={iuranIndex()}
                                    className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600"
                                >
                                    Iuran Member
                                </Link>
                            </div>

                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full min-w-[520px] text-left text-sm">
                                    <thead>
                                        <tr className="text-horizon-gray border-b border-gray-100">
                                            <th className="pb-3 font-medium">
                                                Member
                                            </th>
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
                                                    colSpan={4}
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
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorByText(row.member, avatarColors)}`}
                                                            >
                                                                {initial(
                                                                    row.member,
                                                                )}
                                                            </span>
                                                            <div>
                                                                <p className="font-semibold">
                                                                    {row.member}
                                                                </p>
                                                                {row.username && (
                                                                    <p className="text-xs text-gray-400">
                                                                        @
                                                                        {
                                                                            row.username
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 font-semibold text-sky-600">
                                                        {formatRupiah(
                                                            row.nominal,
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-gray-500">
                                                        {row.tanggal_label ??
                                                            '-'}
                                                    </td>
                                                    <td className="py-3">
                                                        {row.keterangan ? (
                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorByText(row.keterangan, badgeColors)}`}
                                                            >
                                                                {row.keterangan}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Link
                                href={iuranIndex()}
                                className="mt-5 inline-flex text-sm font-semibold text-sky-600"
                            >
                                Lihat seluruh riwayat →
                            </Link>
                        </div>
                    )}

                    <div
                        className={`rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] ${canManage ? 'lg:col-span-2' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-navy-700 text-lg font-bold">
                                    5 Iuran Terbanyak
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Member dengan total setoran tertinggi.
                                </p>
                            </div>
                            {canManage ? (
                                <Link
                                    href={iuranIndex()}
                                    className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600"
                                >
                                    Ranking
                                </Link>
                            ) : (
                                <Link
                                    href={iuranIndex()}
                                    className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600"
                                >
                                    Iuran Saya
                                </Link>
                            )}
                        </div>

                        <div className="mt-5 space-y-4">
                            {iuranTerbanyak.length === 0 ? (
                                <p className="text-horizon-gray text-sm">
                                    Belum ada data iuran.
                                </p>
                            ) : (
                                iuranTerbanyak.map((row, index) => (
                                    <div
                                        key={row.id}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankColor(index)}`}
                                            >
                                                {index + 1}
                                            </span>
                                            <span
                                                className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${colorByText(row.member, avatarColors)}`}
                                            >
                                                {initial(row.member)}
                                            </span>
                                            <div>
                                                <p className="text-navy-700 text-sm font-semibold">
                                                    {row.member}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    @{row.username}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-violet-600">
                                            {formatRupiah(row.nominal)}
                                        </span>
                                    </div>
                                ))
                            )}

                            {canManage &&
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        aria-hidden
                                        className="pointer-events-none flex items-center justify-between gap-3 opacity-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="size-8 rounded-full bg-gray-100" />
                                            <span className="size-10 rounded-full bg-gray-100" />
                                            <div className="space-y-2">
                                                <span className="block h-3 w-28 rounded bg-gray-100" />
                                                <span className="block h-2 w-16 rounded bg-gray-100" />
                                            </div>
                                        </div>
                                        <span className="h-3 w-16 rounded bg-gray-100" />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {canManage && (
                    <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-navy-700 text-lg font-bold">
                                    Mutasi Kas
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Uang masuk dan keluar terbaru.
                                </p>
                            </div>
                            <Link
                                href={kasIndex()}
                                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                            >
                                Kas RT
                            </Link>
                        </div>

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr className="text-horizon-gray border-b border-gray-100">
                                        <th className="pb-3 font-medium">
                                            Jenis
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Kategori
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Tanggal
                                        </th>
                                        <th className="pb-3 text-right font-medium">
                                            Nominal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mutasi.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-horizon-gray py-8 text-center"
                                            >
                                                Belum ada mutasi kas.
                                            </td>
                                        </tr>
                                    ) : (
                                        mutasi.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="text-navy-700 border-b border-gray-50 last:border-0"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`flex size-10 items-center justify-center rounded-full ${
                                                                row.jenis ===
                                                                'masuk'
                                                                    ? 'bg-emerald-50 text-emerald-600'
                                                                    : 'bg-rose-50 text-rose-500'
                                                            }`}
                                                        >
                                                            {row.jenis ===
                                                            'masuk' ? (
                                                                <ArrowDownLeft className="size-4" />
                                                            ) : (
                                                                <ArrowUpRight className="size-4" />
                                                            )}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {row.jenis_label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    {row.kategori_label}
                                                </td>
                                                <td className="py-3 text-gray-500">
                                                    {row.tanggal_label ?? '-'}
                                                </td>
                                                <td
                                                    className={`py-3 text-right font-bold ${
                                                        row.jenis === 'masuk'
                                                            ? 'text-emerald-600'
                                                            : 'text-rose-500'
                                                    }`}
                                                >
                                                    {row.jenis === 'masuk'
                                                        ? '+'
                                                        : '-'}
                                                    {formatRupiah(row.nominal)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Link
                            href={kasIndex()}
                            className="mt-5 inline-flex text-sm font-semibold text-sky-600"
                        >
                            Buka buku kas →
                        </Link>
                    </div>
                )}
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
