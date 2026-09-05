<?php

namespace App\Policies;

use App\Models\Kas;
use App\Models\User;

class KasPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->canManage();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Kas $kas): bool
    {
        return $user->canManage();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->canManage();
    }

    /**
     * Mutations generated from an iuran are corrected from the iuran instead,
     * so the kas row always matches its source.
     */
    public function update(User $user, Kas $kas): bool
    {
        return $user->canManage() && ! $kas->dariIuran();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Kas $kas): bool
    {
        return $user->canManage() && ! $kas->dariIuran();
    }
}
