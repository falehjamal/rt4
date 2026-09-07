<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AskClientHints
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set(
            'Accept-CH',
            'Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Mobile, Sec-CH-UA-Platform-Version',
        );
        $response->headers->set(
            'Permissions-Policy',
            'ch-ua-model=*, ch-ua-platform=*, ch-ua-mobile=*, ch-ua-platform-version=*',
        );

        return $response;
    }
}
