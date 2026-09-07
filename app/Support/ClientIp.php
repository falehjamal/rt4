<?php

namespace App\Support;

use Illuminate\Http\Request;

class ClientIp
{
    public static function from(?Request $request): ?string
    {
        if (! $request instanceof Request) {
            return null;
        }

        $candidates = [
            $request->headers->get('CF-Connecting-IP'),
            $request->headers->get('True-Client-IP'),
            $request->headers->get('X-Real-IP'),
            ...self::forwarded($request),
            $request->ip(),
        ];

        $valid = [];

        foreach ($candidates as $candidate) {
            $ip = self::sanitize((string) $candidate);

            if ($ip === null) {
                continue;
            }

            $valid[] = $ip;

            if (self::isPublic($ip)) {
                return $ip;
            }
        }

        return $valid[0] ?? null;
    }

    /**
     * @return list<string>
     */
    private static function forwarded(Request $request): array
    {
        $header = $request->headers->get('X-Forwarded-For');

        if (! is_string($header) || $header === '') {
            return [];
        }

        return array_map(trim(...), explode(',', $header));
    }

    private static function sanitize(string $value): ?string
    {
        $value = trim($value);

        if ($value === '') {
            return null;
        }

        if (str_contains($value, ':') && ! str_contains($value, '.')) {
            $validated = filter_var($value, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6);

            return $validated !== false ? $validated : null;
        }

        $value = explode(':', $value)[0];
        $validated = filter_var($value, FILTER_VALIDATE_IP);

        return $validated !== false ? $validated : null;
    }

    private static function isPublic(string $ip): bool
    {
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
    }
}
