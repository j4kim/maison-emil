<?php

namespace App\Filament\Resources\Windows;

use App\Filament\Resources\Windows\Pages\CreateWindow;
use App\Filament\Resources\Windows\Pages\EditWindow;
use App\Filament\Resources\Windows\Pages\ListWindows;
use App\Filament\Resources\Windows\Schemas\WindowForm;
use App\Filament\Resources\Windows\Tables\WindowsTable;
use App\Models\Window;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WindowResource extends Resource
{
    protected static ?string $model = Window::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return WindowForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WindowsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWindows::route('/'),
            'create' => CreateWindow::route('/create'),
            'edit' => EditWindow::route('/{record}/edit'),
        ];
    }
}
