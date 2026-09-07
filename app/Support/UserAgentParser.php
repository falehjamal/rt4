<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserAgentParser
{
    /**
     * @return array{device: string, browser: string, platform: string}
     */
    public static function parse(?string $userAgent, ?Request $request = null): array
    {
        $ua = mb_strtolower($userAgent ?? '');
        $platform = self::platform($ua, $request?->headers->get('Sec-CH-UA-Platform'));

        return [
            'device' => self::deviceName($ua, $userAgent ?? '', $request?->headers->get('Sec-CH-UA-Model'), $platform),
            'browser' => self::browser($ua),
            'platform' => $platform,
        ];
    }

    private static function deviceName(string $ua, string $original, ?string $hintModel, string $platform): string
    {
        $fromHint = self::cleanHint($hintModel);

        if ($fromHint !== null) {
            return self::prettyDevice($fromHint);
        }

        if (str_contains($ua, 'iphone')) {
            return 'iPhone';
        }

        if (str_contains($ua, 'ipad')) {
            return 'iPad';
        }

        if (str_contains($ua, 'ipod')) {
            return 'iPod';
        }

        $androidModel = self::androidModel($original);

        if ($androidModel !== null) {
            return self::prettyDevice($androidModel);
        }

        return match (true) {
            str_contains($ua, 'cros') => 'Chromebook',
            str_contains($ua, 'windows') => 'Windows PC',
            str_contains($ua, 'macintosh') || str_contains($ua, 'mac os') => 'Mac',
            str_contains($ua, 'android') => 'HP Android',
            str_contains($ua, 'linux') => 'Linux PC',
            default => self::deviceCategory($ua, $platform),
        };
    }

    private static function deviceCategory(string $ua, string $platform): string
    {
        if ($ua === '') {
            return 'Tidak diketahui';
        }

        if (str_contains($ua, 'ipad') || str_contains($ua, 'tablet')) {
            return 'Tablet';
        }

        if (
            str_contains($ua, 'mobile')
            || str_contains($ua, 'android')
            || str_contains($ua, 'iphone')
            || str_contains($ua, 'ipod')
            || $platform === 'Android'
            || $platform === 'iOS'
        ) {
            return 'HP';
        }

        return 'Desktop';
    }

    private static function androidModel(string $original): ?string
    {
        if (! preg_match('/Android\s+[^;]+;\s*(?:wv;)?\s*([^;)]+?)(?:\s+Build\/|;|\))/i', $original, $matches)) {
            return null;
        }

        $model = trim($matches[1]);

        if ($model === '' || in_array(Str::lower($model), ['k', 'linux', 'mobile', 'wv', 'armv7l', 'armv8l'], true)) {
            return null;
        }

        return $model;
    }

    private static function prettyDevice(string $model): string
    {
        if (preg_match('/^SM-([A-Z])/i', $model, $matches)) {
            $series = match (strtoupper($matches[1])) {
                'A' => 'Galaxy A',
                'S' => 'Galaxy S',
                'F' => 'Galaxy Z',
                'N' => 'Galaxy Note',
                'M' => 'Galaxy M',
                'E' => 'Galaxy F',
                'T' => 'Galaxy Tab',
                default => 'Galaxy',
            };

            return 'Samsung '.$series.' ('.$model.')';
        }

        return $model;
    }

    private static function cleanHint(?string $value): ?string
    {
        $value = trim((string) $value, " \t\n\r\0\x0B\"");

        if ($value === '' || in_array(Str::lower($value), ['unknown', 'null'], true)) {
            return null;
        }

        return $value;
    }

    private static function browser(string $ua): string
    {
        return match (true) {
            $ua === '' => 'Tidak diketahui',
            str_contains($ua, 'edg/') => 'Edge',
            str_contains($ua, 'opr/') || str_contains($ua, 'opera') => 'Opera',
            str_contains($ua, 'firefox') || str_contains($ua, 'fxios') => 'Firefox',
            str_contains($ua, 'samsungbrowser') => 'Samsung Internet',
            str_contains($ua, 'chrome') || str_contains($ua, 'crios') => 'Chrome',
            str_contains($ua, 'safari') => 'Safari',
            default => 'Lainnya',
        };
    }

    private static function platform(string $ua, ?string $hintPlatform): string
    {
        $fromHint = self::cleanHint($hintPlatform);

        if ($fromHint !== null) {
            return match (Str::lower($fromHint)) {
                'android' => 'Android',
                'ios' => 'iOS',
                'windows' => 'Windows',
                'macos' => 'macOS',
                'chrome os' => 'Chrome OS',
                'linux' => 'Linux',
                default => $fromHint,
            };
        }

        return match (true) {
            $ua === '' => 'Tidak diketahui',
            str_contains($ua, 'cros') => 'Chrome OS',
            str_contains($ua, 'windows') => 'Windows',
            str_contains($ua, 'android') => 'Android',
            str_contains($ua, 'iphone') || str_contains($ua, 'ipad') || str_contains($ua, 'ipod') => 'iOS',
            str_contains($ua, 'mac os') || str_contains($ua, 'macintosh') => 'macOS',
            str_contains($ua, 'linux') => 'Linux',
            default => 'Lainnya',
        };
    }
}
