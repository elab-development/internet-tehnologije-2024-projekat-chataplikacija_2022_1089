<?php

namespace Database\Factories;

use App\Models\ChatRoom;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    protected $model = Message::class;
  

    public function definition()
    {
        return [
            'content' => $this->faker->text,  // Nasumičan tekst za sadržaj poruke
            'is_read' => $this->faker->boolean,  // Nasumično true ili false za status pročitanosti
            'user_id' => User::inRandomOrder()->first()->id, // Nasumično korisničko ID
            'chat_room_id' => ChatRoom::inRandomOrder()->first()->id ?? 1, // Nasumično chat soba ID
        ];
    }
}
