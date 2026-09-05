<?php

namespace App\Http\Requests;

use App\Enums\KasJenis;
use App\Enums\KasKategori;
use App\Models\Kas;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $kas = $this->route('kas');

        return $kas instanceof Kas
            && ($this->user()?->can('update', $kas) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jenis' => ['required', Rule::enum(KasJenis::class)],
            'kategori' => ['required', Rule::enum(KasKategori::class)->except(KasKategori::Iuran)],
            'nominal' => ['required', 'numeric', 'min:0'],
            'tanggal' => ['required', 'date'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'bukti' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
