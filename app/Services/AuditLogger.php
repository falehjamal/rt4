<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\UserAgentParser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuditLogger
{
    /**
     * @var list<string>
     */
    private const HIDDEN = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public function record(
        AuditAction $action,
        ?Model $subject = null,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?User $actor = null,
        ?string $subjectLabel = null,
    ): void {
        $request = request();
        $actor ??= ($request instanceof Request ? $request->user() : null) ?? auth()->user();
        $userAgent = $request instanceof Request ? $request->userAgent() : null;
        $parsed = UserAgentParser::parse($userAgent);

        AuditLog::query()->create([
            'user_id' => $actor?->id,
            'actor_name' => $actor?->name,
            'actor_username' => $actor?->username,
            'actor_role' => $actor?->role->value,
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'subject_label' => $subjectLabel ?? ($subject ? $this->subjectLabel($subject) : null),
            'description' => $description ?? $this->description($action, $actor, $subject),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request instanceof Request ? $request->ip() : null,
            'user_agent' => $userAgent,
            'device' => $parsed['device'],
            'browser' => $parsed['browser'],
            'platform' => $parsed['platform'],
            'url' => $request instanceof Request ? Str::limit($request->fullUrl(), 255, '') : null,
            'method' => $request instanceof Request ? $request->method() : null,
        ]);
    }

    public function created(Model $model): void
    {
        $this->record(
            AuditAction::Created,
            $model,
            newValues: $this->visibleAttributes($model),
        );
    }

    public function updated(Model $model): void
    {
        $changes = $this->visibleChanges($model);

        if ($changes['old'] === [] && $changes['new'] === []) {
            return;
        }

        $action = $this->actionFromChanges($model, $changes['new']);

        $this->record(
            $action,
            $model,
            oldValues: $changes['old'],
            newValues: $changes['new'],
        );
    }

    public function deleted(Model $model): void
    {
        $this->record(
            AuditAction::Deleted,
            $model,
            oldValues: $this->visibleAttributes($model),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function visibleAttributes(Model $model): array
    {
        $attributes = $model->getAttributes();

        foreach (self::HIDDEN as $hidden) {
            unset($attributes[$hidden]);
        }

        unset($attributes['updated_at']);

        return $this->normalize($attributes);
    }

    /**
     * @return array{old: array<string, mixed>, new: array<string, mixed>}
     */
    public function visibleChanges(Model $model): array
    {
        $old = [];
        $new = [];

        foreach ($model->getChanges() as $key => $value) {
            if (in_array($key, self::HIDDEN, true) || $key === 'updated_at') {
                if ($key === 'password') {
                    $old['password'] = '••••••';
                    $new['password'] = '••••••';
                }

                continue;
            }

            $old[$key] = $model->getOriginal($key);
            $new[$key] = $value;
        }

        return [
            'old' => $this->normalize($old),
            'new' => $this->normalize($new),
        ];
    }

    /**
     * @param  array<string, mixed>  $newValues
     */
    private function actionFromChanges(Model $model, array $newValues): AuditAction
    {
        if ($model instanceof User && array_key_exists('is_active', $newValues) && count($newValues) === 1) {
            return $newValues['is_active'] ? AuditAction::Unblocked : AuditAction::Blocked;
        }

        return AuditAction::Updated;
    }

    private function subjectLabel(Model $model): string
    {
        if (method_exists($model, 'auditLabel')) {
            return $model->auditLabel();
        }

        return class_basename($model).' #'.$model->getKey();
    }

    private function description(AuditAction $action, ?User $actor, ?Model $subject): string
    {
        $who = $actor?->name ?? 'Sistem';
        $what = $subject ? $this->subjectLabel($subject) : 'data';

        return match ($action) {
            AuditAction::Created => $who.' menambah '.$what,
            AuditAction::Updated => $who.' mengubah '.$what,
            AuditAction::Deleted => $who.' menghapus '.$what,
            AuditAction::Login => $who.' masuk',
            AuditAction::Logout => $who.' keluar',
            AuditAction::LoginFailed => 'Gagal masuk',
            AuditAction::Blocked => $who.' menonaktifkan '.$what,
            AuditAction::Unblocked => $who.' mengaktifkan '.$what,
        };
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    private function normalize(array $attributes): array
    {
        foreach ($attributes as $key => $value) {
            if ($value instanceof \BackedEnum) {
                $attributes[$key] = $value->value;
            }
        }

        return $attributes;
    }
}
