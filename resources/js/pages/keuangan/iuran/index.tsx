import { Form, Head, Link, router, setLayoutProps } from '@inertiajs/react';
import {
    ArrowUpDown,
    ChevronDown,
    Eye,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import RupiahInput from '@/components/rupiah-input';
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
import { destroy, index, store, update } from '@/routes/keuangan/iuran';

type Member = {
    id: number;
    name: string;
    username: string;
};

type IuranRow = {
    id: number;
    user_id: number;
    member: Member;
    nominal: string;
    tanggal_iuran: string;
    tanggal_iuran_label: string;
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
    data: IuranRow[];
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

function formatRupiah(value: string): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export default function IuranIndex({
    iurans,
    members,
    filters,
    canManage,
}: {
    iurans: Paginator;
    members: Member[];
    filters: Filters;
    canManage: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<IuranRow | null>(null);
    const [detail, setDetail] = useState<IuranRow | null>(null);

    function openCreate(): void {
        setEditing(null);
        setOpen(true);
    }

    function openEdit(row: IuranRow): void {
        setDetail(null);
        setEditing(row);
        setOpen(true);
    }

    function openDetail(row: IuranRow): void {
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

    const pageTitle = canManage ? 'Iuran Member' : 'Iuran Saya';

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Keuangan',
                href: index(),
            },
            {
                title: pageTitle,
                href: index(),
            },
        ],
    });

    function deleteIuran(row: IuranRow): void {
        if (
            !window.confirm(
                `Yakin mau hapus iuran ${row.member.name}? Nggak bisa di-undo loh.`,
            )
        ) {
            return;
        }

        router.delete(destroy.url(row.id), { preserveScroll: true });
    }

    return (
        <>
            <Head title={pageTitle} />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-navy-700 text-xl font-bold">
                                {pageTitle}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {canManage
                                    ? 'Iuran warga/member untuk agustusan tahun depan. Setiap iuran otomatis nambah saldo Kas RT.'
                                    : 'Riwayat iuran yang sudah kamu bayar untuk agustusan tahun depan.'}
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
                                    placeholder="Cari nama, username, ket..."
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
                                            ['member', 'Member'],
                                            ['nominal', 'Nominal'],
                                            [
                                                'tanggal_iuran',
                                                'Tanggal iuran',
                                            ],
                                        ] as const
                                    ).map(([column, label]) => (
                                        <th
                                            key={column}
                                            className="text-horizon-gray pb-3 font-medium"
                                        >
                                            {column === 'member' ? (
                                                label
                                            ) : (
                                                <Link
                                                    href={sortHref(column)}
                                                    preserveScroll
                                                    className="inline-flex items-center gap-1 hover:text-navy-700"
                                                >
                                                    {label}
                                                    <ArrowUpDown className="size-3.5" />
                                                </Link>
                                            )}
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
                                {iurans.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-horizon-gray py-10 text-center"
                                        >
                                            Belum ada data iuran.
                                        </td>
                                    </tr>
                                ) : (
                                    iurans.data.map((row) => (
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
                                                                        deleteIuran(
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
                                                <p className="font-semibold">
                                                    {row.member.name}
                                                </p>
                                                <p className="text-horizon-gray text-xs">
                                                    @{row.member.username}
                                                </p>
                                            </td>
                                            <td className="py-3 font-semibold">
                                                {formatRupiah(row.nominal)}
                                            </td>
                                            <td className="py-3">
                                                {row.tanggal_iuran_label}
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
                            {iurans.total === 0
                                ? 'Tidak ada data'
                                : `Menampilkan ${iurans.from}-${iurans.to} dari ${iurans.total}`}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {iurans.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={`${link.label}-${index}`}
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
                                        key={`${link.label}-${index}`}
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
                        <DialogTitle>Detail iuran</DialogTitle>
                        <DialogDescription>
                            Ringkasan data iuran member.
                        </DialogDescription>
                    </DialogHeader>

                    {detail && (
                        <dl className="grid gap-3 text-sm">
                            <div>
                                <dt className="text-horizon-gray">Member</dt>
                                <dd className="text-navy-700 font-semibold">
                                    {detail.member.name} (@
                                    {detail.member.username})
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Nominal</dt>
                                <dd className="text-navy-700 font-semibold">
                                    {formatRupiah(detail.nominal)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">
                                    Tanggal iuran
                                </dt>
                                <dd className="text-navy-700">
                                    {detail.tanggal_iuran_label}
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
                                {editing ? 'Edit iuran' : 'Tambah iuran'}
                            </DialogTitle>
                            <DialogDescription>
                                Isi data iuran member. Nominalnya langsung jadi
                                mutasi masuk di Kas RT. Keterangan dan bukti
                                boleh dikosongin.
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
                                        <Label htmlFor="user_id">Member</Label>
                                        <select
                                            id="user_id"
                                            name="user_id"
                                            required
                                            defaultValue={
                                                editing?.user_id ?? ''
                                            }
                                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                        >
                                            <option value="" disabled>
                                                Pilih member
                                            </option>
                                            {members.map((member) => (
                                                <option
                                                    key={member.id}
                                                    value={member.id}
                                                >
                                                    {member.name} (@
                                                    {member.username})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.user_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nominal">Nominal</Label>
                                        <RupiahInput
                                            id="nominal"
                                            name="nominal"
                                            required
                                            defaultValue={
                                                editing?.nominal ?? ''
                                            }
                                            placeholder="0"
                                        />
                                        <InputError message={errors.nominal} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tanggal_iuran">
                                            Tanggal iuran
                                        </Label>
                                        <Input
                                            id="tanggal_iuran"
                                            name="tanggal_iuran"
                                            type="date"
                                            required
                                            defaultValue={
                                                editing?.tanggal_iuran ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.tanggal_iuran}
                                        />
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

IuranIndex.layout = {
    breadcrumbs: [
        {
            title: 'Keuangan',
            href: index(),
        },
        {
            title: 'Iuran Saya',
            href: index(),
        },
    ],
};
