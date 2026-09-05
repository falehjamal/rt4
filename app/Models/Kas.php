<?php

namespace App\Models;

use App\Enums\KasJenis;
use App\Enums\KasKategori;
use Database\Factories\KasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property KasJenis $jenis
 * @property KasKategori $kategori
 * @property string $nominal
 * @property Carbon $tanggal
 * @property string|null $keterangan
 * @property string|null $bukti
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['jenis', 'kategori', 'nominal', 'tanggal', 'keterangan', 'bukti'])]
class Kas extends Model
{
    /** @use HasFactory<KasFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'jenis' => KasJenis::class,
            'kategori' => KasKategori::class,
            'nominal' => 'decimal:2',
            'tanggal' => 'date',
        ];
    }

    /**
     * @param  Builder<Kas>  $query
     * @return Builder<Kas>
     */
    #[Scope]
    protected function masuk(Builder $query): Builder
    {
        return $query->where('jenis', KasJenis::Masuk);
    }

    /**
     * @param  Builder<Kas>  $query
     * @return Builder<Kas>
     */
    #[Scope]
    protected function keluar(Builder $query): Builder
    {
        return $query->where('jenis', KasJenis::Keluar);
    }

    public function buktiUrl(): ?string
    {
        if ($this->bukti === null) {
            return null;
        }

        return Storage::disk('public')->url($this->bukti);
    }

    public static function saldo(): string
    {
        $masuk = (string) static::query()->masuk()->sum('nominal');
        $keluar = (string) static::query()->keluar()->sum('nominal');

        return bcsub($masuk, $keluar, 2);
    }
}
