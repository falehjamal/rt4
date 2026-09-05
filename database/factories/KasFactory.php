<?php

namespace Database\Factories;

use App\Enums\KasJenis;
use App\Enums\KasKategori;
use App\Models\Kas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kas>
 */
class KasFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jenis' => fake()->randomElement(KasJenis::cases()),
            'kategori' => fake()->randomElement(KasKategori::cases()),
            'nominal' => fake()->randomFloat(2, 10000, 500000),
            'tanggal' => fake()->dateTimeBetween('-3 months'),
            'keterangan' => fake()->optional()->sentence(),
            'bukti' => null,
        ];
    }

    public function masuk(): static
    {
        return $this->state(fn (array $attributes): array => [
            'jenis' => KasJenis::Masuk,
        ]);
    }

    public function keluar(): static
    {
        return $this->state(fn (array $attributes): array => [
            'jenis' => KasJenis::Keluar,
        ]);
    }
}
