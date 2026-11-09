<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Auth\Login;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\Repeater;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Infolists\Components\Entry;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Components\Component;
use Filament\Tables\Columns\Column;
use Filament\Tables\Filters\Filter;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(Login::class)
            ->passwordReset()
            ->colors([
                'primary' => Color::Amber,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([])
            ->navigation(false)
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                PanelsRenderHook::GLOBAL_SEARCH_BEFORE,
                fn() => view('filament.hooks.link-to-site'),
            );
    }

    public function setLabel(Component $comp)
    {
        $name = $comp->getName();
        if (in_array($name, ['created_at', 'updated_at', 'last_move_date', 'deleted_at'])) {
            $comp->isoDateTime('LLL');
        }
        $translated = __($name);
        if ($translated !== $name) {
            $comp->label(ucfirst($translated));
        }
    }

    public function boot(): void
    {
        Entry::configureUsing(fn(Entry $comp) => self::setLabel($comp));
        Column::configureUsing(fn(Column $comp) => self::setLabel($comp));
        Field::configureUsing(fn(Field $comp) => self::setLabel($comp));
        Filter::configureUsing(fn(Filter $comp) => self::setLabel($comp));
        Repeater::configureUsing(fn(Repeater $comp) => self::setLabel($comp));
    }
}
