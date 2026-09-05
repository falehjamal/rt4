import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpDown,
    ArrowUpRight,
    ChevronDown,
    Eye,
    Landmark,
    Scale,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import Widget from '@/components/horizon/widget';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { laporan } from '@/routes/keuangan';

type Option = {
    value: string;
    label: string;
};

type KasRow = {
    id: number;
    jenis: 'masuk' | 'keluar';
    jenis_label: string;
    kategori: string;
    kategori_label: string;
    nominal: string;
    tanggal: string;
    tanggal_label: string;
    keterangan: string | null;
    bukti_url: string | null;
    dari_iuran: boolean;
    iuran_member: string | null;
};

type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginator = {
    data: KasRow[];
    links: PaginatorLink[];
    from: number | null;
    to: number | null;
    total: number;
};

type Filters = {
    dari: string;
    sampai: string;
    jenis: string;
    kategori: string;
    search: string;
    sort: string;
    direction: 'asc' | 'desc';
};

type Ringkasan = {
    saldo_awal: string;
    masuk: string;
    keluar: string;
    saldo_akhir: string;
};

type Rincian = {
    iuran: string;
    iuran_member: number;
    pemasukan_lain: string;
};

function formatRupiah(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export default function LaporanKeuanganIndex({
    mutasi,
    ringkasan,
    rincian,
    jenisOptions,
    kategoriOptions,
    filters,
}: {
    mutasi: Paginator;
    ringkasan: Ringkasan;
    rincian: Rincian;
    jenisOptions: Option[];
    kategoriOptions: Option[];
    filters: Filters;
}) {
    const [detail, setDetail] = useState<KasRow | null>(null);

    function sortHref(column: string): string {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        return laporan.url({
            query: {
                dari: filters.dari,
                sampai: filters.sampai,
                jenis: filters.jenis || undefined,
                kategori: filters.kategori || undefined,
                search: filters.search || undefined,
                sort: column,
                direction,
            },
        });
    }

    return (
        <>
            <Head title="Laporan Keuangan" />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <Widget
                        icon={<Scale className="size-7" />}
                        title="Saldo awal"
                        subtitle={formatRupiah(ringkasan.saldo_awal)}
                    />
                    <Widget
                        icon={<ArrowDownRight className="size-7" />}
                        title="Masuk periode"
                        subtitle={formatRupiah(ringkasan.masuk)}
                    />
                    <Widget
                        icon={<ArrowUpRight className="size-7" />}
                        title="Keluar periode"
                        subtitle={formatRupiah(ringkasan.keluar)}
                    />
                    <Widget
                        icon={<Landmark className="size-7" />}
                        title="Saldo akhir"
                        subtitle={formatRupiah(ringkasan.saldo_akhir)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Widget
                        icon={<Wallet className="size-7" />}
                        title={`Iuran periode ini (${rincian.iuran_member} member)`}
                        subtitle={formatRupiah(rincian.iuran)}
                    />
                    <Widget
                        icon={<ArrowDownRight className="size-7" />}
                        title="Pemasukan lain (donasi, dll)"
                        subtitle={formatRupiah(rincian.pemasukan_lain)}
                    />
                </div>

                <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-navy-700 text-xl font-bold">
                                Laporan Keuangan
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Ringkasan kas RT per periode. Semua iuran member
                                sudah otomatis terhitung di saldo.
                            </p>
                        </div>

                        <Form
                            {...laporan.form()}
                            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6"
                        >
                            <div className="grid gap-1">
                                <Label htmlFor="dari">Dari</Label>
                                <Input
                                    id="dari"
                                    type="date"
                                    name="dari"
                                    defaultValue={filters.dari}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="sampai">Sampai</Label>
                                <Input
                                    id="sampai"
                                    type="date"
                                    name="sampai"
                                    defaultValue={filters.sampai}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="jenis">Jenis</Label>
                                <select
                                    id="jenis"
                                    name="jenis"
                                    defaultValue={filters.jenis}
                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Semua</option>
                                    {jenisOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="kategori">Kategori</Label>
                                <select
                                    id="kategori"
                                    name="kategori"
                                    defaultValue={filters.kategori}
                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Semua</option>
                                    {kategoriOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="search">Cari</Label>
                                <Input
                                    id="search"
                                    type="search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Keterangan..."
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <input
                                    type="hidden"
                                    name="sort"
                                    value={filters.sort}
                                />
                                <input
                                    type="hidden"
                                    name="direction"
                                    value={filters.direction}
                                />
                                <Button type="submit" variant="outline">
                                    Terapkan
                                </Button>
                                <Button type="button" variant="ghost" asChild>
                                    <Link href={laporan.url()}>Reset</Link>
                                </Button>
                            </div>
                        </Form>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-horizon-gray w-16 pb-3 font-medium">
                                        Aksi
                                    </th>
                                    {(
                                        [
                                            ['id', 'ID'],
                                            ['jenis', 'Jenis'],
                                            ['kategori', 'Kategori'],
                                            ['nominal', 'Nominal'],
                                            ['tanggal', 'Tanggal'],
                                        ] as const
                                    ).map(([column, label]) => (
                                        <th
                                            key={column}
                                            className="text-horizon-gray pb-3 font-medium"
                                        >
                                            <Link
                                                href={sortHref(column)}
                                                preserveScroll
                                                className="inline-flex items-center gap-1 hover:text-navy-700"
                                            >
                                                {label}
                                                <ArrowUpDown className="size-3.5" />
                                            </Link>
                                        </th>
                                    ))}
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        Keterangan
                                    </th>
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        Bukti
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {mutasi.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-horizon-gray py-10 text-center"
                                        >
                                            Tidak ada mutasi di periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    mutasi.data.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="text-navy-700 border-b border-gray-50 last:border-0"
                                        >
                                            <td className="py-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className="size-8"
                                                        >
                                                            <ChevronDown className="size-4" />
                                                            <span className="sr-only">
                                                                Aksi
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start">
                                                        <DropdownMenuItem
                                                            className="text-sky-600 focus:bg-sky-50 focus:text-sky-700 [&_svg]:text-sky-600"
                                                            onClick={() =>
                                                                setDetail(row)
                                                            }
                                                        >
                                                            <Eye />
                                                            Detail
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                            <td className="py-3 font-semibold">
                                                {row.id}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        row.jenis === 'masuk'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-red-50 text-red-700'
                                                    }`}
                                                >
                                                    {row.jenis_label}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span className="flex flex-wrap items-center gap-1.5">
                                                    {row.kategori_label}
                                                    {row.dari_iuran && (
                                                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                                            dari iuran
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-3 font-semibold">
                                                {formatRupiah(row.nominal)}
                                            </td>
                                            <td className="py-3">
                                                {row.tanggal_label}
                                            </td>
                                            <td className="py-3">
                                                {row.keterangan ?? '-'}
                                            </td>
                                            <td className="py-3">
                                                {row.bukti_url ? (
                                                    <a
                                                        href={row.bukti_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-brand-500 font-medium hover:underline"
                                                    >
                                                        Lihat
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-horizon-gray text-sm">
                            {mutasi.total === 0
                                ? 'Tidak ada data'
                                : `Menampilkan ${mutasi.from}-${mutasi.to} dari ${mutasi.total}`}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {mutasi.links.map((link, linkIndex) =>
                                link.url ? (
                                    <Link
                                        key={`${link.label}-${linkIndex}`}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded-lg px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-brand-500 text-white'
                                                : 'text-navy-700 hover:bg-light-primary bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={`${link.label}-${linkIndex}`}
                                        className="rounded-lg px-3 py-1.5 text-sm text-gray-400"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={detail !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setDetail(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail mutasi kas</DialogTitle>
                        <DialogDescription>
                            Ringkasan uang masuk atau keluar kas RT.
                        </DialogDescription>
                    </DialogHeader>

                    {detail && (
                        <dl className="grid gap-3 text-sm">
                            <div>
                                <dt className="text-horizon-gray">Jenis</dt>
                                <dd className="text-navy-700 font-semibold">
                                    {detail.jenis_label}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Kategori</dt>
                                <dd className="text-navy-700">
                                    {detail.kategori_label}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Sumber</dt>
                                <dd className="text-navy-700">
                                    {detail.dari_iuran
                                        ? `Iuran ${detail.iuran_member ?? 'member'}`
                                        : 'Dicatat manual di Kas RT'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Nominal</dt>
                                <dd className="text-navy-700 font-semibold">
                                    {formatRupiah(detail.nominal)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Tanggal</dt>
                                <dd className="text-navy-700">
                                    {detail.tanggal_label}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">
                                    Keterangan
                                </dt>
                                <dd className="text-navy-700">
                                    {detail.keterangan ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Bukti</dt>
                                <dd>
                                    {detail.bukti_url ? (
                                        <a
                                            href={detail.bukti_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-brand-500 font-medium hover:underline"
                                        >
                                            Lihat bukti
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                        </dl>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

LaporanKeuanganIndex.layout = {
    breadcrumbs: [
        {
            title: 'Keuangan',
            href: laporan(),
        },
        {
            title: 'Laporan Keuangan',
            href: laporan(),
        },
    ],
};
