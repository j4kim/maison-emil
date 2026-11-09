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
    case Image = 'image';
    case Audio = 'audio';
    case Video = 'video';

    public function getSchema(): array
    {
        return match ($this) {
            self::RichContent => [
                RichEditor::make('content.html')
                    ->columnSpanFull(),
            ],
            self::Image, self::Audio, self::Video => [
                FileUpload::make('content.filename')
                    ->disk('public')
                    ->acceptedFileTypes([$this->value . '/*'])
                    ->storeFileNamesIn('content.originalFilename')
                    ->directory(fn(RelationManager $livewire) => $livewire->getOwnerRecord()->id)
                    ->maxSize(1024 * 64)
                    ->columnSpanFull(),
            ],
            default => []
        };
    }

    public function getLabel(): string | Htmlable | null
    {
        return __($this->name) ?? '';
    }

    public function getContentPreview(array $content): string
    {
        if ($this === self::RichContent) {
            $html = $content['html'];
            $text = preg_replace('/<[^>]*>/', ' ', $html) ?? $html;
            $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            return trim(preg_replace('/\s+/', ' ', $text) ?? $text);
        }
        return match ($this) {
            self::Image, self::Audio, self::Video => $content['originalFilename'],
            default => ""
        };
    }
}
