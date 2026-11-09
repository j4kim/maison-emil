<?php

namespace App\Filament\Resources\Windows\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class WindowForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('number')->disabled(),
                TextInput::make('title'),
            ]);
    }
}
