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
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->nullable(); // Naziv chat sobe (privatni chat može biti bez naziva)
            $table->boolean('is_private')->default(true); // Oznaka za privatnu sobu
            $table->string('profile_picture')->nullable(); // Profilna slika sobe
            $table->string('description')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_rooms');
    }
};
