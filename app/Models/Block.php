<?php

namespace App\Models;

use App\Enums\BlockType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Block extends Model
{
    protected $casts = [
        'type' => BlockType::class,
        'content' => 'array',
    ];

    public function window(): BelongsTo
    {
        return $this->belongsTo(Window::class);
    }
}
