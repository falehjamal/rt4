<?php

namespace App\Models;

use App\Observers\IuranObserver;
use Database\Factories\IuranFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property string $nominal
 * @property Carbon $tanggal_iuran
 * @property string|null $keterangan
 * @property string|null $bukti
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Kas|null $kas
 */
#[Fillable(['user_id', 'nominal', 'tanggal_iuran', 'keterangan', 'bukti'])]
#[ObservedBy(IuranObserver::class)]
class Iuran extends Model
{
    /** @use HasFactory<IuranFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_iuran' => 'date',
            'nominal' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The kas mutation generated from this iuran.
     *
     * @return HasOne<Kas, $this>
     */
    public function kas(): HasOne
    {
        return $this->hasOne(Kas::class);
    }

    public function buktiUrl(): ?string
    {
        if ($this->bukti === null) {
            return null;
        }

        return Storage::disk('public')->url($this->bukti);
    }
}
