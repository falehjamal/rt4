<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use App\Models\Iuran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIuranRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $iuran = $this->route('iuran');

        return $iuran instanceof Iuran
            && ($this->user()?->can('update', $iuran) ?? false);
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
                    function ($query): void {
                        $query->whereIn('role', UserRole::memberValues())
                            ->where(function ($inner): void {
                                $inner->where('is_active', true);

                                $iuran = $this->route('iuran');

                                if ($iuran instanceof Iuran) {
                                    $inner->orWhere('id', $iuran->user_id);
                                }
                            });
                    },
                ),
            ],
            'nominal' => ['required', 'numeric', 'min:0'],
            'tanggal_iuran' => ['required', 'date'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'bukti' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
