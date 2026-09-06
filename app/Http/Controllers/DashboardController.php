<?php

namespace App\Http\Controllers;

use App\Models\Iuran;
use App\Models\Kas;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the application dashboard.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $awalBulan = now()->startOfMonth()->toDateString();
        $akhirBulan = now()->endOfMonth()->toDateString();

        if ($user->canManage()) {
            return Inertia::render('dashboard', [
                'canManage' => true,
                'stats' => [
                    [
                        'key' => 'warga',
                        'title' => 'Warga aktif',
                        'value' => (string) User::query()->members()->where('is_active', true)->count(),
                    ],
                    [
                        'key' => 'iuran',
                        'title' => 'Iuran bulan ini',
                        'value' => (string) Iuran::query()
                            ->whereBetween('tanggal_iuran', [$awalBulan, $akhirBulan])
                            ->sum('nominal'),
                    ],
                    [
                        'key' => 'saldo',
                        'title' => 'Saldo kas',
                        'value' => Kas::saldo(),
                    ],
                    [
                        'key' => 'keluar',
                        'title' => 'Keluar bulan ini',
                        'value' => (string) Kas::query()
                            ->keluar()
                            ->whereBetween('tanggal', [$awalBulan, $akhirBulan])
                            ->sum('nominal'),
                    ],
                ],
                'iurans' => $this->recentIurans(),
                'iuranTerbanyak' => $this->topIurans(),
                'mutasi' => $this->recentMutasi(),
            ]);
        }

        $iuranSaya = Iuran::query()->where('user_id', $user->id);
        $iuranBulanIni = (clone $iuranSaya)
            ->whereBetween('tanggal_iuran', [$awalBulan, $akhirBulan])
            ->sum('nominal');
        $terakhir = Iuran::query()
            ->where('user_id', $user->id)
            ->orderByDesc('tanggal_iuran')
            ->orderByDesc('id')
            ->first();

        return Inertia::render('dashboard', [
            'canManage' => false,
            'stats' => [
                [
                    'key' => 'total',
                    'title' => 'Total iuran kamu',
                    'value' => (string) (clone $iuranSaya)->sum('nominal'),
                ],
                [
                    'key' => 'bulan',
                    'title' => 'Iuran bulan ini',
                    'value' => (string) $iuranBulanIni,
                ],
                [
                    'key' => 'jumlah',
                    'title' => 'Jumlah setoran',
                    'value' => (string) (clone $iuranSaya)->count(),
                ],
                [
                    'key' => 'terakhir',
                    'title' => 'Setoran terakhir',
                    'value' => $terakhir?->tanggal_iuran?->format('d M Y') ?? '-',
                ],
            ],
            'iurans' => $this->recentIurans($user->id),
            'iuranTerbanyak' => $this->topIurans($user->id),
            'mutasi' => [],
        ]);
    }

    /**
     * @return list<array{id: int, member: string, username: string, nominal: string, tanggal_label: string|null, keterangan: string|null}>
     */
    private function recentIurans(?int $userId = null): array
    {
        return Iuran::query()
            ->with('user:id,name,username')
            ->when($userId !== null, fn ($query) => $query->where('user_id', $userId))
            ->orderByDesc('tanggal_iuran')
            ->orderByDesc('id')
            ->limit(6)
            ->get()
            ->map(fn (Iuran $iuran): array => [
                'id' => $iuran->id,
                'member' => $iuran->user->name,
                'username' => $iuran->user->username,
                'nominal' => $iuran->nominal,
                'tanggal_label' => $iuran->tanggal_iuran?->format('d M Y'),
                'keterangan' => $iuran->keterangan,
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, member: string, username: string, nominal: string}>
     */
    private function topIurans(?int $userId = null): array
    {
        if ($userId !== null) {
            return Iuran::query()
                ->with('user:id,name,username')
                ->where('user_id', $userId)
                ->orderByDesc('nominal')
                ->orderByDesc('id')
                ->limit(5)
                ->get()
                ->map(fn (Iuran $iuran): array => [
                    'id' => $iuran->id,
                    'member' => $iuran->user->name,
                    'username' => $iuran->user->username,
                    'nominal' => $iuran->nominal,
                ])
                ->all();
        }

        return User::query()
            ->members()
            ->whereHas('iurans')
            ->withSum('iurans as total_iuran', 'nominal')
            ->orderByDesc('total_iuran')
            ->limit(5)
            ->get()
            ->map(fn (User $member): array => [
                'id' => $member->id,
                'member' => $member->name,
                'username' => $member->username,
                'nominal' => (string) ($member->getAttribute('total_iuran') ?? 0),
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, jenis: string, jenis_label: string, kategori_label: string, nominal: string, tanggal_label: string|null}>
     */
    private function recentMutasi(): array
    {
        return Kas::query()
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (Kas $kas): array => [
                'id' => $kas->id,
                'jenis' => $kas->jenis->value,
                'jenis_label' => $kas->jenis->label(),
                'kategori_label' => $kas->kategori->label(),
                'nominal' => $kas->nominal,
                'tanggal_label' => $kas->tanggal?->format('d M Y'),
            ])
            ->all();
    }
}
