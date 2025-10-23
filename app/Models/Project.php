<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

        protected $fillable = [                            // 7) Whitelist of fields allowed for mass assignment.
        'name',                                        // 8) Project name column.
        'key',                                         // 9) Short code like "WEB".
        'description',                                 // 10) Optional description.
        'owner_id',
        'community_id',                                     // 11) FK to users.id
    ];

        public function owner()                            // 12) Define inverse relation: project → its owner (User).
    {
        return $this->belongsTo(User::class, 'owner_id'); // 13) projects.owner_id → users.id
    }

    public function issues()
    {
        return $this->hasMany(Issue::class)->orderBy('number'); // project_id is inferred
    }

    public function community(){
        return $this->belongsTo(Community::class);
    }
    
}
