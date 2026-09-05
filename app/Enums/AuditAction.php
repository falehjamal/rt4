<?php

namespace App\Enums;

enum AuditAction: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Deleted = 'deleted';
    case Login = 'login';
    case Logout = 'logout';
    case LoginFailed = 'login_failed';
    case Blocked = 'blocked';
    case Unblocked = 'unblocked';

    public function label(): string
    {
        return match ($this) {
            self::Created => 'Tambah',
            self::Updated => 'Ubah',
            self::Deleted => 'Hapus',
            self::Login => 'Masuk',
            self::Logout => 'Keluar',
            self::LoginFailed => 'Gagal masuk',
            self::Blocked => 'Nonaktifkan',
            self::Unblocked => 'Aktifkan',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $action): array => [
                'value' => $action->value,
                'label' => $action->label(),
            ],
            self::cases(),
        );
    }
}
