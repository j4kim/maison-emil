<?php

namespace App\Enums;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Support\Contracts\HasLabel;
use Illuminate\Contracts\Support\Htmlable;

enum BlockType: string implements HasLabel
{
    case RichContent = 'rich-content';
    case Video = 'video';

    public function getSchema(): array
    {
        return match ($this) {
            self::RichContent => [
                RichEditor::make('content')
                    ->columnSpanFull(),
            ],
            self::Video => [
                FileUpload::make('content')
                    ->disk('public')
                    ->panelLayout('grid')
                    ->acceptedFileTypes(['video/*'])
                    ->preserveFilenames()
                    ->directory(fn(RelationManager $livewire) => $livewire->getOwnerRecord()->id),
            ],
            default => []
        };
    }

    public function getLabel(): string | Htmlable | null
    {
        return __($this->name) ?? '';
    }
}
