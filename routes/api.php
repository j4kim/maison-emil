<?php

use App\Models\Window;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('inspire', function () {
        Artisan::call('inspire');
        return Artisan::output();
    })->name('inspire');
});

Route::get('windows/{window}/content', function (Window $window) {
    return $window->load('blocks');
})->name('window-content');
