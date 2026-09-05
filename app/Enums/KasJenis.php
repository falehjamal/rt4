<?php

namespace App\Enums;

enum KasJenis: string
{
    case Masuk = 'masuk';
    case Keluar = 'keluar';

    public function label(): string
    {
        return match ($this) {
            self::Masuk => 'Masuk',
            self::Keluar => 'Keluar',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $jenis): array => [
                'value' => $jenis->value,
                'label' => $jenis->label(),
            ],
            self::cases(),
        );
    }
}
