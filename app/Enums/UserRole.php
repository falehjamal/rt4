<?php

namespace App\Enums;

enum UserRole: string
{
    case Superadmin = 'superadmin';
    case Admin = 'admin';
    case Member = 'member';

    public function canManageIuran(): bool
    {
        return $this === self::Superadmin || $this === self::Admin;
    }

    /**
     * @return list<self>
     */
    public static function payableRoles(): array
    {
        return [self::Admin, self::Member];
    }

    /**
     * @return list<string>
     */
    public static function payableValues(): array
    {
        return array_map(fn (self $role): string => $role->value, self::payableRoles());
    }
}
