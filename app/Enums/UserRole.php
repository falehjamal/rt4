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

    public function label(): string
    {
        return match ($this) {
            self::Superadmin => 'Superadmin',
            self::Admin => 'Admin',
            self::Member => 'Member',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $role): array => [
                'value' => $role->value,
                'label' => $role->label(),
            ],
            self::cases(),
        );
    }

    /**
     * Roles an actor may assign when creating or editing another user.
     *
     * @return list<array{value: string, label: string}>
     */
    public static function assignableOptions(self $actor): array
    {
        $roles = $actor->hasFullAccess()
            ? self::cases()
            : [self::Admin, self::Member];

        return array_map(
            fn (self $role): array => [
                'value' => $role->value,
                'label' => $role->label(),
            ],
            $roles,
        );
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
