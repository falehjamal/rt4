<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use App\Models\Iuran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIuranRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Iuran::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->whereIn('role', UserRole::memberValues())
                        ->where('is_active', true),
                ),
            ],
            'nominal' => ['required', 'numeric', 'min:0'],
            'tanggal_iuran' => ['required', 'date'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'bukti' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
