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
        
            Schema::table('chat_rooms', function (Blueprint $table) {
                $table->text('description')->nullable()->change(); // Menjanje kolone 'description' u tip 'text'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
            Schema::table('chat_rooms', function (Blueprint $table) {
                $table->string('description')->nullable()->change(); // Vraćanje na originalnu kolonu 'string'
        });
    }
};
