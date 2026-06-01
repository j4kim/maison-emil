<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('inspire', function () {
        Artisan::call('inspire');
        return Artisan::output();
    })->name('inspire');
});
