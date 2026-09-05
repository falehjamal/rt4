<?php

namespace App\Listeners;

use App\Enums\AuditAction;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Str;

class RecordAuthenticationAudit
{
    public function __construct(private AuditLogger $logger) {}

    public function handleLogin(Login $event): void
    {
        if (! $event->user instanceof User) {
            return;
        }

        $this->logger->record(
            AuditAction::Login,
            $event->user,
            $event->user->name.' masuk',
            actor: $event->user,
            subjectLabel: $event->user->auditLabel(),
        );
    }

    public function handleLogout(Logout $event): void
    {
        if (! $event->user instanceof User) {
            return;
        }

        $this->logger->record(
            AuditAction::Logout,
            $event->user,
            $event->user->name.' keluar',
            actor: $event->user,
            subjectLabel: $event->user->auditLabel(),
        );
    }

    public function handleFailed(Failed $event): void
    {
        $login = $event->credentials['login']
            ?? $event->credentials['username']
            ?? $event->credentials['email']
            ?? 'akun tidak dikenal';

        $this->logger->record(
            AuditAction::LoginFailed,
            $event->user instanceof User ? $event->user : null,
            'Gagal masuk sebagai '.Str::limit((string) $login, 80, ''),
            newValues: ['login' => $login],
            actor: $event->user instanceof User ? $event->user : null,
            subjectLabel: $event->user instanceof User ? $event->user->auditLabel() : (string) $login,
        );
    }
}
