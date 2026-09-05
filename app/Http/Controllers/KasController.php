<?php

namespace App\Http\Controllers;

use App\Enums\KasJenis;
use App\Enums\KasKategori;
use App\Http\Requests\StoreKasRequest;
use App\Http\Requests\UpdateKasRequest;
use App\Models\Kas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Kas::class);

        $user = $request->user();
        $search = $request->string('search')->trim()->toString();
        $sort = $request->string('sort')->toString();
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        $sortable = [
            'id' => 'id',
            'jenis' => 'jenis',
            'kategori' => 'kategori',
            'nominal' => 'nominal',
            'tanggal' => 'tanggal',
            'created_at' => 'created_at',
        ];

        $sortColumn = $sortable[$sort] ?? 'tanggal';
        $awalBulan = now()->startOfMonth()->toDateString();
        $akhirBulan = now()->endOfMonth()->toDateString();

        $kas = Kas::query()
            ->with('iuran.user:id,name')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('keterangan', 'like', "%{$search}%")
                        ->orWhere('kategori', 'like', "%{$search}%")
                        ->orWhere('jenis', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortColumn, $direction)
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Kas $mutasi): array => [
                'id' => $mutasi->id,
                'jenis' => $mutasi->jenis->value,
                'jenis_label' => $mutasi->jenis->label(),
                'kategori' => $mutasi->kategori->value,
                'kategori_label' => $mutasi->kategori->label(),
                'nominal' => $mutasi->nominal,
                'tanggal' => $mutasi->tanggal?->toDateString(),
                'tanggal_label' => $mutasi->tanggal?->format('d M Y'),
                'keterangan' => $mutasi->keterangan,
                'bukti_url' => $mutasi->buktiUrl(),
                'dari_iuran' => $mutasi->dariIuran(),
                'iuran_member' => $mutasi->iuran?->user->name,
                'created_at' => $mutasi->created_at?->format('d M Y H:i'),
                'updated_at' => $mutasi->updated_at?->format('d M Y H:i'),
            ]);

        return Inertia::render('keuangan/kas/index', [
            'kas' => $kas,
            'ringkasan' => [
                'saldo' => Kas::saldo(),
                'masuk_bulan_ini' => (string) Kas::query()
                    ->masuk()
                    ->whereBetween('tanggal', [$awalBulan, $akhirBulan])
                    ->sum('nominal'),
                'keluar_bulan_ini' => (string) Kas::query()
                    ->keluar()
                    ->whereBetween('tanggal', [$awalBulan, $akhirBulan])
                    ->sum('nominal'),
            ],
            'jenisOptions' => KasJenis::options(),
            'kategoriOptions' => KasKategori::manualOptions(),
            'filters' => [
                'search' => $search,
                'sort' => array_key_exists($sort, $sortable) ? $sort : 'tanggal',
                'direction' => $direction,
            ],
            'canManage' => $user->canManage(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKasRequest $request): RedirectResponse
    {
        $data = $request->safe()->only(['jenis', 'kategori', 'nominal', 'tanggal', 'keterangan']);

        if ($request->hasFile('bukti')) {
            $data['bukti'] = $request->file('bukti')->store('kas', 'public');
        }

        Kas::query()->create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mutasi kas udah masuk, sip.']);

        return to_route('keuangan.kas.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKasRequest $request, Kas $kas): RedirectResponse
    {
        $data = $request->safe()->only(['jenis', 'kategori', 'nominal', 'tanggal', 'keterangan']);

        if ($request->hasFile('bukti')) {
            if ($kas->bukti) {
                Storage::disk('public')->delete($kas->bukti);
            }

            $data['bukti'] = $request->file('bukti')->store('kas', 'public');
        }

        $kas->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mutasi kas udah diupdate.']);

        return to_route('keuangan.kas.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kas $kas): RedirectResponse
    {
        Gate::authorize('delete', $kas);

        if ($kas->bukti) {
            Storage::disk('public')->delete($kas->bukti);
        }

        $kas->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mutasi kas udah dihapus.']);

        return to_route('keuangan.kas.index');
    }
}
