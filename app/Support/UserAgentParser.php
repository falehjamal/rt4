<?php

namespace App\Support;

class UserAgentParser
{
    /**
     * @return array{device: string, browser: string, platform: string}
     */
    public static function parse(?string $userAgent): array
    {
        $ua = mb_strtolower($userAgent ?? '');

        return [
            'device' => self::device($ua),
            'browser' => self::browser($ua),
            'platform' => self::platform($ua),
        ];
    }

    private static function device(string $ua): string
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
        ) {
            return 'HP';
        }

        return 'Desktop';
    }

    private static function browser(string $ua): string
    {
        return match (true) {
            $ua === '' => 'Tidak diketahui',
            str_contains($ua, 'edg/') => 'Edge',
            str_contains($ua, 'opr/') || str_contains($ua, 'opera') => 'Opera',
            str_contains($ua, 'firefox') || str_contains($ua, 'fxios') => 'Firefox',
            str_contains($ua, 'chrome') || str_contains($ua, 'crios') => 'Chrome',
            str_contains($ua, 'safari') => 'Safari',
            str_contains($ua, 'samsungbrowser') => 'Samsung Internet',
            default => 'Lainnya',
        };
    }

    private static function platform(string $ua): string
    {
        return match (true) {
            $ua === '' => 'Tidak diketahui',
            str_contains($ua, 'windows') => 'Windows',
            str_contains($ua, 'android') => 'Android',
            str_contains($ua, 'iphone') || str_contains($ua, 'ipad') || str_contains($ua, 'ipod') => 'iOS',
            str_contains($ua, 'mac os') || str_contains($ua, 'macintosh') => 'macOS',
            str_contains($ua, 'linux') => 'Linux',
            default => 'Lainnya',
        };
    }
}
