<?php

namespace App\Filament\Resources\Windows\Pages;

use App\Filament\Resources\Windows\WindowResource;
use Filament\Resources\Pages\ListRecords;

class ListWindows extends ListRecords
{
    protected static string $resource = WindowResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
