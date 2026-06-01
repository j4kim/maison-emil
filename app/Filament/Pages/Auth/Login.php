<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;

class Login extends BaseLogin
{
    public function mount(): void
    {
        if (request()->intended) {
            session(['url.intended' => request()->intended]);
        }

        parent::mount();
    }
}
