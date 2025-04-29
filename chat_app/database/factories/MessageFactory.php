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
            'content' => $this->faker->text, 
            'is_read' => $this->faker->boolean,  
            'user_id' => User::inRandomOrder()->first()->id, 
            'chat_room_id' => ChatRoom::inRandomOrder()->first()->id ?? 1, // Nasumično chat soba ID
            'sender_name' => $this->faker->name,
        ];
    }
}
