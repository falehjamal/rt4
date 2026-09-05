<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Superadmin and admin may manage the user directory.
     */
    public function viewAny(User $user): bool
    {
        return $user->canManage();
    }

    public function view(User $user, User $model): bool
    {
        return $user->canManage();
    }

    public function create(User $user): bool
    {
        return $user->canManage();
    }

    /**
     * Admin may edit anyone except a superadmin. Superadmin may edit anyone.
     */
    public function update(User $user, User $model): bool
    {
        if (! $user->canManage()) {
            return false;
        }

        if ($user->hasFullAccess()) {
            return true;
        }

        return ! $model->hasFullAccess();
    }

    /**
     * Accounts are deactivated instead of deleted.
     */
    public function delete(User $user, User $model): bool
    {
        return false;
    }

    public function toggleActive(User $user, User $model): bool
    {
        if ($user->is($model)) {
            return false;
        }

        return $this->update($user, $model);
    }
}
