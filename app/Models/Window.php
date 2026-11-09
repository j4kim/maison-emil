<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Window extends Model
{
    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }
}
