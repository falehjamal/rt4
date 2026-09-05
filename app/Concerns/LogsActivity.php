<?php

namespace App\Concerns;

use App\Services\AuditLogger;

trait LogsActivity
{
    public static function bootLogsActivity(): void
    {
        static::created(function (self $model): void {
            app(AuditLogger::class)->created($model);
        });

        static::updated(function (self $model): void {
            app(AuditLogger::class)->updated($model);
        });

        static::deleted(function (self $model): void {
            app(AuditLogger::class)->deleted($model);
        });
    }
}
