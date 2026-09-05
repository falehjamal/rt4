import { Form, Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    Ban,
    CheckCircle2,
    ChevronDown,
    Eye,
    Pencil,
    Plus,
} from 'lucide-react';
import { useState } from 'react';
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
import {
    index,
    store,
    toggleActive,
    update,
} from '@/routes/manajemen/users';

type Option = {
    value: string;
    label: string;
};

type UserRow = {
    id: number;
    name: string;
    username: string;
    phone: string;
    email: string;
    role: string;
    role_label: string;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    can_update: boolean;
    can_toggle: boolean;
};

type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginator = {
    data: UserRow[];
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

export default function UsersIndex({
    users,
    roleOptions,
    filters,
    canCreate,
}: {
    users: Paginator;
    roleOptions: Option[];
    filters: Filters;
    canCreate: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UserRow | null>(null);
    const [detail, setDetail] = useState<UserRow | null>(null);

    function openCreate(): void {
        setEditing(null);
        setOpen(true);
    }

    function openEdit(row: UserRow): void {
        setDetail(null);
        setEditing(row);
        setOpen(true);
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

    function toggleUser(row: UserRow): void {
        const next = row.is_active ? 'nonaktifkan' : 'aktifkan';

        if (
            !window.confirm(
                `Yakin mau ${next} ${row.name}? ${row.is_active ? 'Dia nggak bisa login lagi.' : 'Dia bisa login lagi.'}`,
            )
        ) {
            return;
        }

        router.patch(toggleActive.url(row.id), {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Users" />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-navy-700 text-xl font-bold">
                                Users
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Kelola akun superadmin, admin, dan member. User
                                nonaktif nggak bisa masuk.
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
                                    placeholder="Cari nama, username, HP..."
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

                            {canCreate && (
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
                                            ['name', 'Nama'],
                                            ['username', 'Username'],
                                            ['role', 'Peran'],
                                            ['is_active', 'Status'],
                                        ] as const
                                    ).map(([column, label]) => (
                                        <th
                                            key={column}
                                            className="text-horizon-gray pb-3 font-medium"
                                        >
                                            <Link
                                                href={sortHref(column)}
                                                preserveScroll
                                                className="hover:text-navy-700 inline-flex items-center gap-1"
                                            >
                                                {label}
                                                <ArrowUpDown className="size-3.5" />
                                            </Link>
                                        </th>
                                    ))}
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        HP
                                    </th>
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-horizon-gray py-10 text-center"
                                        >
                                            Belum ada user.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((row) => (
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
                                                        {row.can_update && (
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
                                                        )}
                                                        {row.can_toggle && (
                                                            <DropdownMenuItem
                                                                className={
                                                                    row.is_active
                                                                        ? 'text-red-600 focus:bg-red-50 focus:text-red-700 [&_svg]:text-red-600'
                                                                        : 'text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 [&_svg]:text-emerald-600'
                                                                }
                                                                onClick={() =>
                                                                    toggleUser(
                                                                        row,
                                                                    )
                                                                }
                                                            >
                                                                {row.is_active ? (
                                                                    <Ban />
                                                                ) : (
                                                                    <CheckCircle2 />
                                                                )}
                                                                {row.is_active
                                                                    ? 'Nonaktifkan'
                                                                    : 'Aktifkan'}
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                            <td className="py-3 font-semibold">
                                                {row.id}
                                            </td>
                                            <td className="py-3">{row.name}</td>
                                            <td className="py-3">
                                                {row.username}
                                            </td>
                                            <td className="py-3">
                                                {row.role_label}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        row.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-red-50 text-red-700'
                                                    }`}
                                                >
                                                    {row.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                {row.phone}
                                            </td>
                                            <td className="py-3">
                                                {row.email}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-horizon-gray text-sm">
                            {users.total === 0
                                ? 'Tidak ada data'
                                : `Menampilkan ${users.from}-${users.to} dari ${users.total}`}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {users.links.map((link, linkIndex) =>
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
                        <DialogTitle>Detail user</DialogTitle>
                        <DialogDescription>
                            Data akun dan status aktif.
                        </DialogDescription>
                    </DialogHeader>

                    {detail && (
                        <dl className="grid gap-3 text-sm">
                            <div>
                                <dt className="text-horizon-gray">Nama</dt>
                                <dd className="text-navy-700 font-semibold">
                                    {detail.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Username</dt>
                                <dd className="text-navy-700">
                                    {detail.username}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Peran</dt>
                                <dd className="text-navy-700">
                                    {detail.role_label}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Status</dt>
                                <dd className="text-navy-700">
                                    {detail.is_active ? 'Aktif' : 'Nonaktif'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">HP</dt>
                                <dd className="text-navy-700">
                                    {detail.phone}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-horizon-gray">Email</dt>
                                <dd className="text-navy-700">
                                    {detail.email}
                                </dd>
                            </div>
                        </dl>
                    )}
                </DialogContent>
            </Dialog>

            {canCreate && (
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
                                {editing ? 'Edit user' : 'Tambah user'}
                            </DialogTitle>
                            <DialogDescription>
                                Isi data akun. Password wajib saat tambah, boleh
                                dikosongin saat edit.
                            </DialogDescription>
                        </DialogHeader>

                        <Form
                            key={editing ? `edit-${editing.id}` : 'create'}
                            {...(editing
                                ? update.form(editing.id)
                                : store.form())}
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
                                        <Label htmlFor="name">Nama</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={editing?.name ?? ''}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            required
                                            defaultValue={
                                                editing?.username ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.username}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">HP</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            defaultValue={editing?.phone ?? ''}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={editing?.email ?? ''}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Peran</Label>
                                        <select
                                            id="role"
                                            name="role"
                                            required
                                            defaultValue={editing?.role ?? ''}
                                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                        >
                                            <option value="" disabled>
                                                Pilih peran
                                            </option>
                                            {roleOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.role} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password
                                            {editing ? ' (opsional)' : ''}
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required={!editing}
                                            autoComplete="new-password"
                                        />
                                        <InputError
                                            message={errors.password}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            required={!editing}
                                            autoComplete="new-password"
                                        />
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

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen',
            href: index(),
        },
        {
            title: 'Users',
            href: index(),
        },
    ],
};
