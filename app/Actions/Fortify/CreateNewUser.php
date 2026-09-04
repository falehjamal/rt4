<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'username' => ['required', 'string', 'alpha_dash', 'max:50', Rule::unique(User::class)],
            'phone' => ['required', 'string', 'max:20', 'regex:/^[0-9+\- ]+$/', Rule::unique(User::class)],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'username' => Str::lower($input['username']),
            'phone' => Str::of($input['phone'])->replaceMatches('/\s+/', '')->toString(),
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => UserRole::Member,
        ]);
    }
}
