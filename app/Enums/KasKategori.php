<?php

namespace App\Enums;

enum KasKategori: string
{
    case Iuran = 'iuran';
    case Donasi = 'donasi';
    case Kegiatan = 'kegiatan';
    case Operasional = 'operasional';
    case Lainnya = 'lainnya';

    public function label(): string
    {
        return match ($this) {
            self::Iuran => 'Iuran',
            self::Donasi => 'Donasi',
            self::Kegiatan => 'Kegiatan',
            self::Operasional => 'Operasional',
            self::Lainnya => 'Lainnya',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $kategori): array => [
                'value' => $kategori->value,
                'label' => $kategori->label(),
            ],
            self::cases(),
        );
    }
}
