<?php

namespace Database\Factories;

use App\Models\ChatRoom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatRoom>
 */
class ChatRoomFactory extends Factory
{
    protected $model = ChatRoom::class;
    
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,  // Nasumičan naziv za chat sobu 
            'is_private' => $this->faker->boolean,  // Nasumična vrednost za privatnost sobe (true ili false)
            'description' => $this->faker->text,  // Nasumičan tekst za opis chat sobe
        ];
    }
}
