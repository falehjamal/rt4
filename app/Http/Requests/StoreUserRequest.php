<?php

namespace App\Http\Requests;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    use PasswordValidationRules, ProfileValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', User::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<int, mixed>|string>
     */
    public function rules(): array
    {
        $actor = $this->user();

        return [
            ...$this->profileRules(),
            'username' => ['required', 'string', 'alpha_dash', 'max:50', Rule::unique(User::class)],
            'phone' => ['required', 'string', 'max:20', 'regex:/^[0-9+\- ]+$/', Rule::unique(User::class)],
            'role' => [
                'required',
                Rule::enum(UserRole::class)->only(
                    $actor?->hasFullAccess()
                        ? UserRole::cases()
                        : [UserRole::Admin, UserRole::Member],
                ),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'password' => $this->passwordRules(),
        ];
    }
}
