<?php

namespace App\Observers;

use App\Enums\KasJenis;
use App\Enums\KasKategori;
use App\Models\Iuran;
use App\Models\User;

class IuranObserver
{
    /**
     * Handle the Iuran "created" event.
     */
    public function created(Iuran $iuran): void
    {
        $iuran->kas()->create([
            'jenis' => KasJenis::Masuk,
            'kategori' => KasKategori::Iuran,
            'nominal' => $iuran->nominal,
            'tanggal' => $iuran->tanggal_iuran,
            'keterangan' => $this->keterangan($iuran),
        ]);
    }

    /**
     * Handle the Iuran "updated" event.
     */
    public function updated(Iuran $iuran): void
    {
        $kas = $iuran->kas()->first();

        if ($kas === null) {
            $this->created($iuran);

            return;
        }

        $kas->update([
            'jenis' => KasJenis::Masuk,
            'kategori' => KasKategori::Iuran,
            'nominal' => $iuran->nominal,
            'tanggal' => $iuran->tanggal_iuran,
            'keterangan' => $this->keterangan($iuran),
        ]);
    }

    /**
     * Handle the Iuran "deleted" event.
     */
    public function deleted(Iuran $iuran): void
    {
        $iuran->kas()->first()?->delete();
    }

    private function keterangan(Iuran $iuran): string
    {
        $nama = User::query()->whereKey($iuran->user_id)->value('name') ?? 'member';
        $keterangan = 'Iuran '.$nama;

        if ($iuran->keterangan !== null && $iuran->keterangan !== '') {
            $keterangan .= ' - '.$iuran->keterangan;
        }

        return mb_substr($keterangan, 0, 255);
    }
}
