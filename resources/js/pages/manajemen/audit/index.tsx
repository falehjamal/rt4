import { Form, Head, Link } from '@inertiajs/react';
import { ArrowUpDown, ChevronDown, Eye } from 'lucide-react';
import { useState } from 'react';
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
import { audit } from '@/routes/manajemen';

type Option = {
    value: string;
    label: string;
};

type Actor = {
    id: number;
    name: string;
    username: string;
};

type AuditRow = {
    id: number;
    actor_name: string | null;
    actor_username: string | null;
    actor_role: string | null;
    action: string;
    action_label: string;
    subject_label: string | null;
    description: string;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    device: string | null;
    browser: string | null;
    platform: string | null;
    url: string | null;
    method: string | null;
    created_at: string | null;
};

type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginator = {
    data: AuditRow[];
    links: PaginatorLink[];
    from: number | null;
    to: number | null;
    total: number;
};

type Filters = {
    search: string;
    action: string;
    user_id: number | '';
    dari: string;
    sampai: string;
    sort: string;
    direction: 'asc' | 'desc';
};

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    if (typeof value === 'boolean') {
        return value ? 'Ya' : 'Tidak';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

export default function AuditLogIndex({
    logs,
    actors,
    actionOptions,
    filters,
}: {
    logs: Paginator;
    actors: Actor[];
    actionOptions: Option[];
    filters: Filters;
}) {
    const [detail, setDetail] = useState<AuditRow | null>(null);

    function sortHref(column: string): string {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        return audit.url({
            query: {
                search: filters.search || undefined,
                action: filters.action || undefined,
                user_id: filters.user_id || undefined,
                dari: filters.dari || undefined,
                sampai: filters.sampai || undefined,
                sort: column,
                direction,
            },
        });
    }

    return (
        <>
            <Head title="Audit Log" />

            <div className="flex flex-1 flex-col gap-5 p-4">
                <div className="rounded-[20px] bg-white p-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-navy-700 text-xl font-bold">
                                Audit Log
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Jejak lengkap aktivitas user: siapa, kapan (WIB),
                                apa yang berubah, IP, dan nama perangkat.
                            </p>
                        </div>

                        <Form
                            {...audit.form()}
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
                                <Label htmlFor="action">Aksi</Label>
                                <select
                                    id="action"
                                    name="action"
                                    defaultValue={filters.action}
                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Semua</option>
                                    {actionOptions.map((option) => (
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
                                <Label htmlFor="user_id">Pelaku</Label>
                                <select
                                    id="user_id"
                                    name="user_id"
                                    defaultValue={filters.user_id}
                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                >
                                    <option value="">Semua</option>
                                    {actors.map((actor) => (
                                        <option
                                            key={actor.id}
                                            value={actor.id}
                                        >
                                            {actor.name}
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
                                    placeholder="Deskripsi, IP..."
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <Button
                                    type="submit"
                                    className="bg-brand-500 hover:bg-brand-600"
                                >
                                    Terapkan
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={audit.url()}>Reset</Link>
                                </Button>
                            </div>
                        </Form>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-horizon-gray w-16 pb-3 font-medium">
                                        Aksi
                                    </th>
                                    {(
                                        [
                                            ['created_at', 'Waktu'],
                                            ['actor_name', 'Pelaku'],
                                            ['action', 'Aktivitas'],
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
                                        Subjek
                                    </th>
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        IP
                                    </th>
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        Perangkat
                                    </th>
                                    <th className="text-horizon-gray pb-3 font-medium">
                                        Browser
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-horizon-gray py-10 text-center"
                                        >
                                            Belum ada jejak aktivitas.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((row) => (
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
                                            <td className="py-3 whitespace-nowrap">
                                                {row.created_at}
                                            </td>
                                            <td className="py-3">
                                                <div className="font-semibold">
                                                    {row.actor_name ?? '-'}
                                                </div>
                                                <div className="text-horizon-gray text-xs">
                                                    {row.actor_username
                                                        ? `@${row.actor_username}`
                                                        : row.actor_role ?? ''}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {row.action_label}
                                            </td>
                                            <td className="py-3">
                                                {row.subject_label ??
                                                    row.description}
                                            </td>
                                            <td className="py-3">
                                                {row.ip_address ?? '-'}
                                            </td>
                                            <td className="py-3">
                                                <div>{row.device ?? '-'}</div>
                                                <div className="text-horizon-gray text-xs">
                                                    {row.platform ?? ''}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {row.browser ?? '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-horizon-gray text-sm">
                            {logs.total === 0
                                ? 'Tidak ada data'
                                : `Menampilkan ${logs.from}-${logs.to} dari ${logs.total}`}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {logs.links.map((link, linkIndex) =>
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
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail jejak</DialogTitle>
                        <DialogDescription>
                            Perubahan, pelaku, dan perangkat yang dipakai.
                        </DialogDescription>
                    </DialogHeader>

                    {detail && (
                        <div className="grid gap-4 text-sm">
                            <p className="text-navy-700 font-medium">
                                {detail.description}
                            </p>
                            <dl className="grid gap-3">
                                <div>
                                    <dt className="text-horizon-gray">
                                        Waktu
                                    </dt>
                                    <dd className="text-navy-700">
                                        {detail.created_at}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">
                                        Pelaku
                                    </dt>
                                    <dd className="text-navy-700">
                                        {detail.actor_name ?? '-'}
                                        {detail.actor_username
                                            ? ` (@${detail.actor_username})`
                                            : ''}
                                        {detail.actor_role
                                            ? ` · ${detail.actor_role}`
                                            : ''}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">
                                        Aktivitas
                                    </dt>
                                    <dd className="text-navy-700">
                                        {detail.action_label}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">
                                        Subjek
                                    </dt>
                                    <dd className="text-navy-700">
                                        {detail.subject_label ?? '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">IP</dt>
                                    <dd className="text-navy-700">
                                        {detail.ip_address ?? '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">
                                        Perangkat
                                    </dt>
                                    <dd className="text-navy-700">
                                        {detail.device ?? '-'}
                                        {detail.platform
                                            ? ` · ${detail.platform}`
                                            : ''}
                                        {detail.browser
                                            ? ` · ${detail.browser}`
                                            : ''}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">
                                        User agent
                                    </dt>
                                    <dd className="text-navy-700 break-all">
                                        {detail.user_agent ?? '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-horizon-gray">
                                        Request
                                    </dt>
                                    <dd className="text-navy-700 break-all">
                                        {detail.method ?? '-'} {detail.url ?? ''}
                                    </dd>
                                </div>
                            </dl>

                            {(detail.old_values || detail.new_values) && (
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                        <p className="text-horizon-gray mb-1 font-medium">
                                            Sebelum
                                        </p>
                                        <pre className="rounded-md bg-gray-50 p-3 text-xs whitespace-pre-wrap">
                                            {detail.old_values
                                                ? Object.entries(
                                                      detail.old_values,
                                                  )
                                                      .map(
                                                          ([key, value]) =>
                                                              `${key}: ${formatValue(value)}`,
                                                      )
                                                      .join('\n')
                                                : '-'}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="text-horizon-gray mb-1 font-medium">
                                            Sesudah
                                        </p>
                                        <pre className="rounded-md bg-gray-50 p-3 text-xs whitespace-pre-wrap">
                                            {detail.new_values
                                                ? Object.entries(
                                                      detail.new_values,
                                                  )
                                                      .map(
                                                          ([key, value]) =>
                                                              `${key}: ${formatValue(value)}`,
                                                      )
                                                      .join('\n')
                                                : '-'}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

AuditLogIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen',
            href: audit(),
        },
        {
            title: 'Audit Log',
            href: audit(),
        },
    ],
};
