<?php

namespace App\Http\Requests;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    use PasswordValidationRules, ProfileValidationRules;

    public function authorize(): bool
    {
        $user = $this->route('user');

        return $user instanceof User
            && ($this->user()?->can('update', $user) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<int, mixed>|string>
     */
    public function rules(): array
    {
        $target = $this->route('user');
        $targetId = $target instanceof User ? $target->id : null;
        $actor = $this->user();

        return [
            ...$this->profileRules($targetId),
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'max:50',
                Rule::unique(User::class)->ignore($targetId),
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^[0-9+\- ]+$/',
                Rule::unique(User::class)->ignore($targetId),
            ],
            'role' => [
                'required',
                Rule::enum(UserRole::class)->only(
                    $actor?->hasFullAccess()
                        ? UserRole::cases()
                        : [UserRole::Admin, UserRole::Member],
                ),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ];
    }
}
