<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->upsert([
            'name' => 'Superadmin',
            'username' => 'superadmin',
            'phone' => '081234567890',
            'email' => 'superadmin@gmail.com',
            'role' => UserRole::Superadmin,
        ]);

        foreach ($this->members() as $member) {
            $username = Str::lower($member['name']);

            $this->upsert([
                'name' => $member['name'],
                'username' => $username,
                'phone' => $this->normalizePhone($member['phone']),
                'email' => $username.'@gmail.com',
                'role' => $member['role'] ?? UserRole::Member,
            ]);
        }
    }

    /**
     * @param  array{name: string, username: string, phone: string, email: string, role: UserRole}  $user
     */
    private function upsert(array $user): void
    {
        $alreadyExists = User::query()
            ->where(function ($query) use ($user): void {
                $query->where('username', $user['username'])
                    ->orWhere('phone', $user['phone'])
                    ->orWhere('email', $user['email']);
            })
            ->exists();

        if ($alreadyExists) {
            return;
        }

        User::query()->create([
            ...$user,
            'password' => 'password',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * @return list<array{name: string, phone: string, role?: UserRole}>
     */
    private function members(): array
    {
        return [
            ['name' => 'Tamam', 'phone' => '0882 0077 02823'],
            ['name' => 'Wafa', 'phone' => '0853 8503 3553'],
            ['name' => 'Ari', 'phone' => '0813 8917 3952'],
            ['name' => 'Lilik', 'phone' => '0813 3040 7571', 'role' => UserRole::Admin],
            ['name' => 'Arip', 'phone' => '0821 2492 2776'],
            ['name' => 'Arul', 'phone' => '0851 8389 3457'],
            ['name' => 'Silo', 'phone' => '0823 2814 5147'],
            ['name' => 'Nasim', 'phone' => '0858 6675 1594'],
            ['name' => 'Uul', 'phone' => '0851 6580 3013'],
            ['name' => 'Jeri', 'phone' => '0852 2640 1790'],
            ['name' => 'Aldi', 'phone' => '0851 9805 8880'],
            ['name' => 'Noval', 'phone' => '0821 3761 9736'],
            ['name' => 'Eko', 'phone' => '0812 1576 4918'],
            ['name' => 'Hendra', 'phone' => '0813 5346 0651'],
            ['name' => 'Nur', 'phone' => '0881 0273 94989'],
            ['name' => 'Yusuf', 'phone' => '0812 2569 8524'],
            ['name' => 'Faleh', 'phone' => '0852 8141 1550'],
            ['name' => 'Faisol', 'phone' => '0851 9837 8798'],
            ['name' => 'Mufid', 'phone' => '0812 3293 8223'],
            ['name' => 'Reza', 'phone' => '0851 3932 5619'],
            ['name' => 'Anang', 'phone' => '0889 8307 8756'],
        ];
    }

    private function normalizePhone(string $phone): string
    {
        return Str::of($phone)->replaceMatches('/\s+/', '')->toString();
    }
}
