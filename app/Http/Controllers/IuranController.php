<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIuranRequest;
use App\Http\Requests\UpdateIuranRequest;
use App\Models\Iuran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class IuranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Iuran::class);

        $user = $request->user();
        $search = $request->string('search')->trim()->toString();
        $sort = $request->string('sort')->toString();
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        $sortable = [
            'id' => 'iurans.id',
            'nominal' => 'iurans.nominal',
            'tanggal_iuran' => 'iurans.tanggal_iuran',
            'created_at' => 'iurans.created_at',
        ];

        $sortColumn = $sortable[$sort] ?? 'iurans.tanggal_iuran';

        $iurans = Iuran::query()
            ->with('user:id,name,username')
            ->when(! $user->canManage(), fn ($query) => $query->where('user_id', $user->id))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('keterangan', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search): void {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy($sortColumn, $direction)
            ->orderByDesc('iurans.id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Iuran $iuran): array => [
                'id' => $iuran->id,
                'user_id' => $iuran->user_id,
                'member' => [
                    'id' => $iuran->user->id,
                    'name' => $iuran->user->name,
                    'username' => $iuran->user->username,
                ],
                'nominal' => $iuran->nominal,
                'tanggal_iuran' => $iuran->tanggal_iuran?->toDateString(),
                'tanggal_iuran_label' => $iuran->tanggal_iuran?->format('d M Y'),
                'keterangan' => $iuran->keterangan,
                'bukti_url' => $iuran->buktiUrl(),
                'created_at' => $iuran->created_at?->format('d M Y H:i'),
                'updated_at' => $iuran->updated_at?->format('d M Y H:i'),
            ]);

        $members = $user->canManage()
            ? User::query()
                ->members()
                ->where('is_active', true)
                ->orderBy('name')
                ->orderBy('id')
                ->get(['id', 'name', 'username'])
            : collect();

        return Inertia::render('keuangan/iuran/index', [
            'iurans' => $iurans,
            'members' => $members,
            'filters' => [
                'search' => $search,
                'sort' => array_key_exists($sort, $sortable) ? $sort : 'tanggal_iuran',
                'direction' => $direction,
            ],
            'canManage' => $user->canManage(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIuranRequest $request): RedirectResponse
    {
        $data = $request->safe()->only(['user_id', 'nominal', 'tanggal_iuran', 'keterangan']);

        if ($request->hasFile('bukti')) {
            $data['bukti'] = $request->file('bukti')->store('iuran', 'public');
        }

        DB::transaction(function () use ($data): void {
            Iuran::query()->create($data);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Iurannya udah masuk dan otomatis nambah saldo kas.']);

        return to_route('keuangan.iuran.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIuranRequest $request, Iuran $iuran): RedirectResponse
    {
        $data = $request->safe()->only(['user_id', 'nominal', 'tanggal_iuran', 'keterangan']);

        if ($request->hasFile('bukti')) {
            if ($iuran->bukti) {
                Storage::disk('public')->delete($iuran->bukti);
            }

            $data['bukti'] = $request->file('bukti')->store('iuran', 'public');
        }

        DB::transaction(function () use ($iuran, $data): void {
            $iuran->update($data);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Iurannya udah diupdate, mutasi kasnya ikut menyesuaikan.']);

        return to_route('keuangan.iuran.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Iuran $iuran): RedirectResponse
    {
        Gate::authorize('delete', $iuran);

        DB::transaction(function () use ($iuran): void {
            $iuran->delete();
        });

        if ($iuran->bukti) {
            Storage::disk('public')->delete($iuran->bukti);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Iurannya udah dihapus bareng mutasi kasnya.']);

        return to_route('keuangan.iuran.index');
    }
}
