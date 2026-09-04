<?php

namespace App\Models;

use Database\Factories\IuranFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
 */
#[Fillable(['user_id', 'nominal', 'tanggal_iuran', 'keterangan', 'bukti'])]
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

    public function buktiUrl(): ?string
    {
        if ($this->bukti === null) {
            return null;
        }

        return Storage::disk('public')->url($this->bukti);
    }
}
