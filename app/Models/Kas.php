<?php

namespace App\Models;

use App\Concerns\LogsActivity;
use App\Enums\KasJenis;
use App\Enums\KasKategori;
use Database\Factories\KasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int|null $iuran_id
 * @property KasJenis $jenis
 * @property KasKategori $kategori
 * @property string $nominal
 * @property Carbon $tanggal
 * @property string|null $keterangan
 * @property string|null $bukti
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Iuran|null $iuran
 */
#[Fillable(['jenis', 'kategori', 'nominal', 'tanggal', 'keterangan', 'bukti'])]
class Kas extends Model
{
    /** @use HasFactory<KasFactory> */
    use HasFactory, LogsActivity;

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
     * The iuran this mutation was generated from, if any.
     *
     * @return BelongsTo<Iuran, $this>
     */
    public function iuran(): BelongsTo
    {
        return $this->belongsTo(Iuran::class);
    }

    /**
     * Mutations generated from an iuran can only be corrected from the iuran.
     */
    public function dariIuran(): bool
    {
        return $this->iuran_id !== null;
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

    public function auditLabel(): string
    {
        return 'Kas '.$this->jenis->label().' '.$this->kategori->label().' Rp '.number_format((float) $this->nominal, 0, ',', '.');
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

    public static function saldoSebelum(string $tanggal): string
    {
        $masuk = (string) static::query()->masuk()->where('tanggal', '<', $tanggal)->sum('nominal');
        $keluar = (string) static::query()->keluar()->where('tanggal', '<', $tanggal)->sum('nominal');

        return bcsub($masuk, $keluar, 2);
    }

    public static function totalMasukAntara(string $dari, string $sampai): string
    {
        return (string) static::query()
            ->masuk()
            ->whereBetween('tanggal', [$dari, $sampai])
            ->sum('nominal');
    }

    public static function totalKeluarAntara(string $dari, string $sampai): string
    {
        return (string) static::query()
            ->keluar()
            ->whereBetween('tanggal', [$dari, $sampai])
            ->sum('nominal');
    }
}
