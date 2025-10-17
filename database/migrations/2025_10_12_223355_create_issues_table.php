<?php

use Illuminate\Database\Migrations\Migration;      // 1) Base migration class
use Illuminate\Database\Schema\Blueprint;           // 2) Blueprint: define columns
use Illuminate\Support\Facades\Schema;              // 3) Schema facade: run DDL

return new class extends Migration {
    public function up(): void                      // 4) Runs on `php artisan migrate`
    {
        Schema::create('issues', function (Blueprint $table) {  // 5) Make `issues` table
            $table->id();                                      // 6) Primary key

            // Relations
            $table->foreignId('project_id')                    // 7) Issue belongs to a Project
                  ->constrained('projects')                    //    references projects.id
                  ->onDelete('cascade');                       //    delete issues if project is deleted

            $table->foreignId('assignee_id')                   // 8) Optional: who is assigned
                  ->nullable()                                 //    may be unassigned
                  ->constrained('users')                       //    references users.id
                  ->nullOnDelete();                            //    if user deleted, set to NULL

            // Issue identity inside the project
            $table->unsignedInteger('number');                 // 9) Per-project sequence: 1,2,3...
            $table->unique(['project_id', 'number']);          // 10) Ensure WEB-7 is unique in its project

            // Core fields
            $table->string('title');                           // 11) Short title
            $table->text('description')->nullable();           // 12) Longer markdown/body

            // Workflow-ish fields (simple for now; strings)
            $table->string('status')->default('todo');         // 13) e.g., todo | in_progress | done
            $table->string('priority')->default('medium');     // 14) e.g., low | medium | high

            // Dates
            $table->date('due_date')->nullable();              // 15) Optional due date

            $table->timestamps();                              // 16) created_at / updated_at
        });
    }

    public function down(): void                               // 17) Rollback path
    {
        Schema::dropIfExists('issues');                        // 18) Drop the table
    }
};
