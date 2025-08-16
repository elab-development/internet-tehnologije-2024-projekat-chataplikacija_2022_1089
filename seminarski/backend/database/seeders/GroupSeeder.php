<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; 

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('group_user')->delete();
        Group::query()->delete();

        Group::create([
            'id' => 1,
            'name' => 'Opšti Chat',
            'description' => 'Javna grupa za sve korisnike - diskusije o svemu i svačemu',
            'is_private' => false,
            'wallpaper' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Group::create([
            'id' => 2,
            'name' => 'Tehnologija',
            'description' => 'Diskusije o programiranju, AI, gadžetima i novim tehnologijama',
            'is_private' => false,
            'wallpaper' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Group::create([
            'id' => 3,
            'name' => 'Privatni Tim',
            'description' => 'Privatna grupa za članove tima - interne diskusije i planovi',
            'is_private' => true,
            'wallpaper' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Group::create([
            'id' => 4,
            'name' => 'Gaming Zone',
            'description' => 'Chat o video igrama, turnirima i gaming vestima',
            'is_private' => false,
            'wallpaper' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Group::create([
            'id' => 5,
            'name' => 'Studenti FON',
            'description' => 'Grupa za studente Fakulteta organizacionih nauka',
            'is_private' => true,
            'wallpaper' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assignUsersToGroups();
    } 

    private function assignUsersToGroups()
    {
        
        DB::table('group_user')->insert([
            ['group_id' => 1, 'user_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => 2, 'user_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => 3, 'user_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => 4, 'user_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => 5, 'user_id' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Ostali korisnici u javne grupe
        for ($userId = 2; $userId <= 6; $userId++) {
            DB::table('group_user')->insert([
                ['group_id' => 1, 'user_id' => $userId, 'created_at' => now(), 'updated_at' => now()], 
                ['group_id' => 2, 'user_id' => $userId, 'created_at' => now(), 'updated_at' => now()], // Tehnologija
                ['group_id' => 4, 'user_id' => $userId, 'created_at' => now(), 'updated_at' => now()], 
            ]);
        }

        // Neki korisnici u privatne grupe
        DB::table('group_user')->insert([
            ['group_id' => 3, 'user_id' => 2, 'created_at' => now(), 'updated_at' => now()], 
            ['group_id' => 3, 'user_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => 5, 'user_id' => 2, 'created_at' => now(), 'updated_at' => now()], // Studenti FON
            ['group_id' => 5, 'user_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => 5, 'user_id' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}