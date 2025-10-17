<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Community extends Model
{
    protected $fillable = ['name', 'owner_id'];

    // Owner of the community
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Users in the community
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('role', 'status') // include pivot columns
                    ->withTimestamps();           // pivot timestamps
    }
}
