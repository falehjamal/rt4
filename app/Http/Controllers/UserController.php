<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $actor = $request->user();
        $search = $request->string('search')->trim()->toString();
        $sort = $request->string('sort')->toString();
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        $sortable = [
            'id' => 'id',
            'name' => 'name',
            'username' => 'username',
            'role' => 'role',
            'is_active' => 'is_active',
            'created_at' => 'created_at',
        ];

        $sortColumn = $sortable[$sort] ?? 'name';

        $users = User::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortColumn, $direction)
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'phone' => $user->phone,
                'email' => $user->email,
                'role' => $user->role->value,
                'role_label' => $user->role->label(),
                'is_active' => $user->is_active,
                'created_at' => $user->created_at?->format('d M Y H:i'),
                'updated_at' => $user->updated_at?->format('d M Y H:i'),
                'can_update' => $actor->can('update', $user),
                'can_toggle' => $actor->can('toggleActive', $user),
            ]);

        return Inertia::render('manajemen/users/index', [
            'users' => $users,
            'roleOptions' => UserRole::assignableOptions($actor->role),
            'filters' => [
                'search' => $search,
                'sort' => array_key_exists($sort, $sortable) ? $sort : 'name',
                'direction' => $direction,
            ],
            'canCreate' => $actor->can('create', User::class),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'username', 'phone', 'email', 'role', 'password']);
        $data['username'] = Str::lower($data['username']);
        $data['phone'] = Str::of($data['phone'])->replaceMatches('/\s+/', '')->toString();
        $data['is_active'] = $request->boolean('is_active', true);

        User::query()->create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User udah ditambah.']);

        return to_route('manajemen.users.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'username', 'phone', 'email', 'role']);
        $data['username'] = Str::lower($data['username']);
        $data['phone'] = Str::of($data['phone'])->replaceMatches('/\s+/', '')->toString();

        if ($request->filled('password')) {
            $data['password'] = $request->string('password')->toString();
        }

        $user->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User udah diupdate.']);

        return to_route('manajemen.users.index');
    }

    /**
     * Activate or deactivate the specified user.
     */
    public function toggleActive(User $user): RedirectResponse
    {
        Gate::authorize('toggleActive', $user);

        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        if (! $user->is_active) {
            DB::table('sessions')->where('user_id', $user->id)->delete();
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $user->is_active
                ? $user->name.' diaktifkan lagi.'
                : $user->name.' dinonaktifkan.',
        ]);

        return to_route('manajemen.users.index');
    }
}
