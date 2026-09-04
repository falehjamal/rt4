<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Iuran;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Iuran>
 */
class IuranFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nominal' => fake()->randomFloat(2, 25000, 250000),
            'tanggal_iuran' => fake()->dateTimeBetween('-3 months'),
            'keterangan' => fake()->optional()->sentence(),
            'bukti' => null,
        ];
    }

    public function forMember(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => User::factory()->state([
                'role' => fake()->randomElement(UserRole::memberRoles()),
            ]),
        ]);
    }
}
