<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Message;

class MessagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Message::query()->delete();
        DB::table('messages')->insert([
            [
                'group_id' => 1,
                'user_id' => 2,
                'content' => 'hej kako ste',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group_id' => 1,
                'user_id' => 3,
                'content' => 'Dobro sam, hvala! A ti?',
                'created_at' => now()->addMinutes(1),
                'updated_at' => now()->addMinutes(1)
            ],
            [
                'group_id' => 1,
                'user_id' => 2,
                'content' => 'Super, radim na projektu za faks',
                'created_at' => now()->addMinutes(3),
                'updated_at' => now()->addMinutes(3)
            ],
            [
                'group_id' => 2,
                'user_id' => 1,
                'content' => 'Dobrodošli u Tech grupu!',
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2)
            ],
            [
                'group_id' => 2,
                'user_id' => 4,
                'content' => 'Hvala! Interesuje me AI i machine learning',
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1)
            ]
        ]);
    }
}
