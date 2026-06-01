<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1,  user-scalable=0"
        >

        <title>{{ config('app.name', 'Laravel') }}</title>

        @routes()

        <!-- Styles / Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite('vue-app/main.js')
        @endif
    </head>

    <body
        data-app-version="{{ config('app.version') }}"
        data-app-name="{{ config('app.name') }}"
        data-user="{{ json_encode(auth()->user()) }}"
    >
        <div id="app"></div>
    </body>

</html>
