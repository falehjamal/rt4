import { Form, Head, Link, router } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpDown,
    ArrowUpRight,
    ChevronDown,
    Eye,
    Pencil,
    Plus,
    Trash2,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import Widget from '@/components/horizon/widget';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { Spinner } from '@/components/ui/spinner';
import { destroy, index, store, update } from '@/routes/keuangan/kas';

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
    created_at: string | null;
    updated_at: string | null;
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
    search: string;
    sort: string;
    direction: 'asc' | 'desc';
};

type Ringkasan = {
    saldo: string;
    masuk_bulan_ini: string;
    keluar_bulan_ini: string;
};

function formatRupiah(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export default function KasIndex({
    kas,
    ringkasan,
    jenisOptions,
    kategoriOptions,
    filters,
    canManage,
}: {
    kas: Paginator;
    ringkasan: Ringkasan;
    jenisOptions: Option[];
    kategoriOptions: Option[];
    filters: Filters;
    canManage: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<KasRow | null>(null);
    const [detail, setDetail] = useState<KasRow | null>(null);

    function openCreate(): void {
        setEditing(null);
        setOpen(true);
    }

    function openEdit(row: KasRow): void {
        setDetail(null);
        setEditing(row);
        setOpen(true);
    }

    function openDetail(row: KasRow): void {
        setDetail(row);
    }

    function sortHref(column: string): string {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        return index.url({
            query: {
                search: filters.search || undefined,
                sort: column,
                direction,
            },
        });
    }

    function deleteKas(row: KasRow): void {
        if (
            !window.confirm(
                `Yakin mau hapus mutasi ${row.jenis_label.toLowerCase()} ${formatRupiah(row.nominal)}? Nggak bisa di-undo loh.`,
            )
        ) {
            return;
        }

        router.delete(destroy.url(row.id), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Kas RT" />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <Widget
                        icon={<Wallet className="size-7" />}
                        title="Saldo kas"
                        subtitle={formatRupiah(ringkasan.saldo)}
                    />
                    <Widget
                        icon={<ArrowDownRight className="size-7" />}
                        title="Masuk bulan ini"
                        subtitle={formatRupiah(ringkasan.masuk_bulan_ini)}
                    />
                    <Widget
                        icon={<ArrowUpRight className="size-7" />}
                        title="Keluar bulan ini"
                        subtitle={formatRupiah(ringkasan.keluar_bulan_ini)}
                    />
                </div>

                <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-navy-700 text-xl font-bold">
                                Kas RT
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Buku kas bersama. Iuran tercatat terpisah, setor
                                ke kas lewat mutasi masuk.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Form
                                action={index.url()}
                                method="get"
                                className="flex gap-2"
                            >
                                <Input
                                    type="search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Cari jenis, kategori, ket..."
                                    className="w-full sm:w-64"
                                />
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
                                    Cari
                                </Button>
                            </Form>

                            {canManage && (
                                <Button
                                    type="button"
                                    onClick={openCreate}
                                    className="bg-brand-500 hover:bg-brand-600"
                                >
                                    <Plus className="size-4" />
                                    Tambah
                                </Button>
                            )}
                        </div>
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
                                {kas.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-horizon-gray py-10 text-center"
                                        >
                                            Belum ada mutasi kas.
                                        </td>
                                    </tr>
                                ) : (
                                    kas.data.map((row) => (
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
                                                                openDetail(row)
                                                            }
                                                        >
                                                            <Eye />
                                                            Detail
                                                        </DropdownMenuItem>
                                                        {canManage && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    className="text-amber-600 focus:bg-amber-50 focus:text-amber-700 [&_svg]:text-amber-600"
                                                                    onClick={() =>
                                                                        openEdit(
                                                                            row,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:bg-red-50 focus:text-red-700 [&_svg]:text-red-600"
                                                                    onClick={() =>
                                                                        deleteKas(
                                                                            row,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
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
                                                {row.kategori_label}
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
                            {kas.total === 0
                                ? 'Tidak ada data'
                                : `Menampilkan ${kas.from}-${kas.to} dari ${kas.total}`}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {kas.links.map((link, linkIndex) =>
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

            {canManage && (
                <Dialog
                    open={open}
                    onOpenChange={(nextOpen) => {
                        setOpen(nextOpen);

                        if (!nextOpen) {
                            setEditing(null);
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? 'Edit mutasi kas' : 'Tambah mutasi kas'}
                            </DialogTitle>
                            <DialogDescription>
                                Catat uang masuk atau keluar. Keterangan dan
                                bukti boleh dikosongin.
                            </DialogDescription>
                        </DialogHeader>

                        <Form
                            key={editing ? `edit-${editing.id}` : 'create'}
                            {...(editing
                                ? update.form(editing.id)
                                : store.form())}
                            encType="multipart/form-data"
                            options={{ preserveScroll: true }}
                            className="grid gap-4"
                            onSuccess={() => {
                                setOpen(false);
                                setEditing(null);
                            }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="jenis">Jenis</Label>
                                        <select
                                            id="jenis"
                                            name="jenis"
                                            required
                                            defaultValue={
                                                editing?.jenis ?? ''
                                            }
                                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                        >
                                            <option value="" disabled>
                                                Pilih jenis
                                            </option>
                                            {jenisOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.jenis} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="kategori">
                                            Kategori
                                        </Label>
                                        <select
                                            id="kategori"
                                            name="kategori"
                                            required
                                            defaultValue={
                                                editing?.kategori ?? ''
                                            }
                                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                        >
                                            <option value="" disabled>
                                                Pilih kategori
                                            </option>
                                            {kategoriOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.kategori} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nominal">Nominal</Label>
                                        <Input
                                            id="nominal"
                                            name="nominal"
                                            type="number"
                                            min="0"
                                            step="1000"
                                            required
                                            defaultValue={
                                                editing?.nominal ?? ''
                                            }
                                            placeholder="50000"
                                        />
                                        <InputError message={errors.nominal} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tanggal">Tanggal</Label>
                                        <Input
                                            id="tanggal"
                                            name="tanggal"
                                            type="date"
                                            required
                                            defaultValue={
                                                editing?.tanggal ?? ''
                                            }
                                        />
                                        <InputError message={errors.tanggal} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="keterangan">
                                            Keterangan
                                        </Label>
                                        <Input
                                            id="keterangan"
                                            name="keterangan"
                                            defaultValue={
                                                editing?.keterangan ?? ''
                                            }
                                            placeholder="Opsional"
                                        />
                                        <InputError
                                            message={errors.keterangan}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bukti">Bukti</Label>
                                        <Input
                                            id="bukti"
                                            name="bukti"
                                            type="file"
                                            accept="image/*"
                                        />
                                        {editing?.bukti_url && (
                                            <a
                                                href={editing.bukti_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-brand-500 text-sm hover:underline"
                                            >
                                                Lihat bukti sekarang
                                            </a>
                                        )}
                                        <InputError message={errors.bukti} />
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-brand-500 hover:bg-brand-600"
                                        >
                                            {processing && <Spinner />}
                                            {editing ? 'Simpan' : 'Tambah'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

KasIndex.layout = {
    breadcrumbs: [
        {
            title: 'Keuangan',
            href: index(),
        },
        {
            title: 'Kas RT',
            href: index(),
        },
    ],
};
