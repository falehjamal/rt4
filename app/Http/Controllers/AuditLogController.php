<?php

namespace App\Http\Controllers;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display the activity trail.
     */
    public function __invoke(Request $request): Response
    {
        Gate::authorize('viewAny', AuditLog::class);

        $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'action' => ['nullable', Rule::enum(AuditAction::class)],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'dari' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:dari'],
            'sort' => ['nullable', 'string'],
            'direction' => ['nullable', 'in:asc,desc'],
        ]);

        $search = $request->string('search')->trim()->toString();
        $action = $request->string('action')->toString();
        $userId = $request->integer('user_id');
        $dari = $request->date('dari')?->startOfDay();
        $sampai = $request->date('sampai')?->endOfDay();
        $sort = $request->string('sort')->toString();
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        $sortable = [
            'id' => 'id',
            'action' => 'action',
            'actor_name' => 'actor_name',
            'ip_address' => 'ip_address',
            'created_at' => 'created_at',
        ];

        $sortColumn = $sortable[$sort] ?? 'created_at';

        $logs = AuditLog::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($inner) use ($search): void {
                    $inner->where('description', 'like', "%{$search}%")
                        ->orWhere('subject_label', 'like', "%{$search}%")
                        ->orWhere('actor_name', 'like', "%{$search}%")
                        ->orWhere('actor_username', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%");
                });
            })
            ->when($action !== '', fn ($query) => $query->where('action', $action))
            ->when($userId > 0, fn ($query) => $query->where('user_id', $userId))
            ->when($dari !== null, fn ($query) => $query->where('created_at', '>=', $dari))
            ->when($sampai !== null, fn ($query) => $query->where('created_at', '<=', $sampai))
            ->orderBy($sortColumn, $direction)
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (AuditLog $log): array => [
                'id' => $log->id,
                'actor_name' => $log->actor_name,
                'actor_username' => $log->actor_username,
                'actor_role' => $log->actor_role,
                'action' => $log->action->value,
                'action_label' => $log->action->label(),
                'subject_label' => $log->subject_label,
                'description' => $log->description,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'device' => $log->device,
                'browser' => $log->browser,
                'platform' => $log->platform,
                'url' => $log->url,
                'method' => $log->method,
                'created_at' => $log->created_at?->format('d M Y H:i:s'),
                'created_at_iso' => $log->created_at?->toIso8601String(),
            ]);

        return Inertia::render('manajemen/audit/index', [
            'logs' => $logs,
            'actors' => User::query()
                ->orderBy('name')
                ->orderBy('id')
                ->get(['id', 'name', 'username']),
            'actionOptions' => AuditAction::options(),
            'filters' => [
                'search' => $search,
                'action' => $action,
                'user_id' => $userId > 0 ? $userId : '',
                'dari' => $request->date('dari')?->toDateString() ?? '',
                'sampai' => $request->date('sampai')?->toDateString() ?? '',
                'sort' => array_key_exists($sort, $sortable) ? $sort : 'created_at',
                'direction' => $direction,
            ],
        ]);
    }
}
