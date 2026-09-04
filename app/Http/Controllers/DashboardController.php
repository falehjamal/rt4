<?php

namespace App\Http\Controllers;

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
        $wargaCount = User::query()->count();

        $wargaTerbaru = User::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(6)
            ->get(['id', 'name', 'username', 'phone', 'created_at'])
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'phone' => $user->phone,
                'joined' => $user->created_at?->format('d M Y'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                [
                    'key' => 'warga',
                    'title' => 'Total Warga',
                    'value' => (string) $wargaCount,
                ],
                [
                    'key' => 'iuran',
                    'title' => 'Iuran bulan ini',
                    'value' => 'Rp 0',
                ],
                [
                    'key' => 'pengaduan',
                    'title' => 'Pengaduan terbuka',
                    'value' => '0',
                ],
                [
                    'key' => 'kegiatan',
                    'title' => 'Kegiatan aktif',
                    'value' => '0',
                ],
            ],
            'wargaTerbaru' => $wargaTerbaru,
        ]);
    }
}
