<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('messages')->insert([
            'group_id' => 2,
            'user_id' => 2,
            'content' => 'hej kako stee',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
