<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;



class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',  // Specifično ime admina
            'email' => 'admin@example.com',  // Specifičan email admina
            'password' => Hash::make('adminpassword'),  // Hashovana šifra za admina
            'email_verified_at' => now(),  // Automatski postavi trenutni datum za verifikaciju email-a
            'last_seen_at' => now(),  // Automatski postavi trenutni datum za poslednje viđanje
            'remember_token' => Str::random(10),  // Nasumični token za "remember me" funkcionalnost
        ]);


        User::factory()->count(4)->create();
    }
}
