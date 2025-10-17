<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('community_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')
                  ->constrained()
                  ->cascadeOnDelete(); // Delete pivot if community deleted
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete(); // Delete pivot if user deleted
            $table->string('role')->nullable(); // Example: UI Dev, Backend
            $table->enum('status', ['pending','accepted','rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_user');
    }
};
