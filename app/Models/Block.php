<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Block extends Model
{
    public function window(): BelongsTo
    {
        return $this->belongsTo(Window::class);
    }
}
