<?php

namespace App\Http\Controllers;

use App\Enums\KasJenis;
use App\Enums\KasKategori;
use App\Models\Iuran;
use App\Models\Kas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LaporanKeuanganController extends Controller
{
    /**
     * Display the financial report.
     */
    public function __invoke(Request $request): Response
    {
        Gate::authorize('viewAny', Kas::class);

        $request->validate([
            'dari' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:dari'],
            'jenis' => ['nullable', Rule::enum(KasJenis::class)],
            'kategori' => ['nullable', Rule::enum(KasKategori::class)],
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'string'],
            'direction' => ['nullable', 'in:asc,desc'],
        ]);

        $dari = $request->date('dari')?->toDateString() ?? now()->startOfMonth()->toDateString();
        $sampai = $request->date('sampai')?->toDateString() ?? now()->endOfMonth()->toDateString();
        $jenis = $request->string('jenis')->toString();
        $kategori = $request->string('kategori')->toString();
        $search = $request->string('search')->trim()->toString();
        $sort = $request->string('sort')->toString();
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        $sortable = [
            'id' => 'id',
            'jenis' => 'jenis',
            'kategori' => 'kategori',
            'nominal' => 'nominal',
            'tanggal' => 'tanggal',
        ];

        $sortColumn = $sortable[$sort] ?? 'tanggal';
        $saldoAwal = Kas::saldoSebelum($dari);
        $masukPeriode = Kas::totalMasukAntara($dari, $sampai);
        $keluarPeriode = Kas::totalKeluarAntara($dari, $sampai);

        $mutasi = Kas::query()
            ->with('iuran.user:id,name')
            ->whereBetween('tanggal', [$dari, $sampai])
            ->when($jenis !== '', fn ($query) => $query->where('jenis', $jenis))
            ->when($kategori !== '', fn ($query) => $query->where('kategori', $kategori))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('keterangan', 'like', "%{$search}%")
                        ->orWhere('kategori', 'like', "%{$search}%")
                        ->orWhere('jenis', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortColumn, $direction)
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Kas $kas): array => [
                'id' => $kas->id,
                'jenis' => $kas->jenis->value,
                'jenis_label' => $kas->jenis->label(),
                'kategori' => $kas->kategori->value,
                'kategori_label' => $kas->kategori->label(),
                'nominal' => $kas->nominal,
                'tanggal' => $kas->tanggal?->toDateString(),
                'tanggal_label' => $kas->tanggal?->format('d M Y'),
                'keterangan' => $kas->keterangan,
                'bukti_url' => $kas->buktiUrl(),
                'dari_iuran' => $kas->dariIuran(),
                'iuran_member' => $kas->iuran?->user->name,
            ]);

        return Inertia::render('keuangan/laporan/index', [
            'mutasi' => $mutasi,
            'ringkasan' => [
                'saldo_awal' => $saldoAwal,
                'masuk' => $masukPeriode,
                'keluar' => $keluarPeriode,
                'saldo_akhir' => bcsub(bcadd($saldoAwal, $masukPeriode, 2), $keluarPeriode, 2),
            ],
            'rincian' => [
                'iuran' => (string) Kas::query()
                    ->masuk()
                    ->where('kategori', KasKategori::Iuran)
                    ->whereBetween('tanggal', [$dari, $sampai])
                    ->sum('nominal'),
                'iuran_member' => Iuran::query()
                    ->whereBetween('tanggal_iuran', [$dari, $sampai])
                    ->distinct()
                    ->count('user_id'),
                'pemasukan_lain' => (string) Kas::query()
                    ->masuk()
                    ->where('kategori', '!=', KasKategori::Iuran->value)
                    ->whereBetween('tanggal', [$dari, $sampai])
                    ->sum('nominal'),
            ],
            'jenisOptions' => KasJenis::options(),
            'kategoriOptions' => KasKategori::options(),
            'filters' => [
                'dari' => $dari,
                'sampai' => $sampai,
                'jenis' => $jenis,
                'kategori' => $kategori,
                'search' => $search,
                'sort' => array_key_exists($sort, $sortable) ? $sort : 'tanggal',
                'direction' => $direction,
            ],
        ]);
    }
}
