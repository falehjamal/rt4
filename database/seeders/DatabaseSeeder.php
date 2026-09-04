<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin RT 4',
                'phone' => '081234567890',
                'email' => 'admin@rt4.test',
                'role' => UserRole::Superadmin,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['username' => 'pengurus'],
            [
                'name' => 'Pengurus RT 4',
                'phone' => '081298765432',
                'email' => 'pengurus@rt4.test',
                'role' => UserRole::Admin,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['username' => 'member'],
            [
                'name' => 'Warga RT 4',
                'phone' => '081211122233',
                'email' => 'member@rt4.test',
                'role' => UserRole::Member,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );
    }
}
