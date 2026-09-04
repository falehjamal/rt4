<?php

namespace App\Enums;

enum UserRole: string
{
    case Superadmin = 'superadmin';
    case Admin = 'admin';
    case Member = 'member';

    /**
     * Superadmin bukan orang/member; punya kuasa penuh.
     */
    public function hasFullAccess(): bool
    {
        return $this === self::Superadmin;
    }

    /**
     * Admin bisa jadi member; member adalah member. Superadmin tidak termasuk.
     */
    public function isMember(): bool
    {
        return $this === self::Admin || $this === self::Member;
    }

    /**
     * Superadmin dan admin boleh kelola data.
     */
    public function canManage(): bool
    {
        return $this === self::Superadmin || $this === self::Admin;
    }

    /**
     * @return list<self>
     */
    public static function memberRoles(): array
    {
        return [self::Admin, self::Member];
    }

    /**
     * @return list<string>
     */
    public static function memberValues(): array
    {
        return array_map(fn (self $role): string => $role->value, self::memberRoles());
    }
}
