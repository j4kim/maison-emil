<?php

namespace App\Filament\Resources\Windows\RelationManagers;

use App\Enums\BlockType;
use App\Models\Block;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BlocksRelationManager extends RelationManager
{
    protected static string $relationship = 'blocks';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('type')
                    ->options(BlockType::class)
                    ->default(BlockType::RichContent)
                    ->live()
                    ->required()
                    ->afterStateUpdated(
                        fn(Select $component) => $component
                            ->getContainer()
                            ->getComponent('dynamicTypeFields')
                            ->getChildSchema()
                            ->fill()
                    ),
                Grid::make()
                    ->schema(function (Get $get): array {
                        /** @var BlockType $blockType */
                        $blockType = $get('type');
                        return $blockType?->getSchema() ?? [];
                    })
                    ->columnSpanFull()
                    ->key('dynamicTypeFields'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('type')
            ->columns([
                TextColumn::make('type'),
                TextColumn::make('content')
                    ->formatStateUsing(function (Block $record, string $state) {
                        return $record->type->getContentPreview($state);
                    })
                    ->limit(80),
            ])
            ->reorderable('order')
            ->defaultSort('order')
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
