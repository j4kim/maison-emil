<?php

use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    return view('vue-app');
})->name('vue-app');
