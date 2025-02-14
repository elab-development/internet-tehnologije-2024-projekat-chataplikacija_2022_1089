<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'sender_name' => $this->sender_name,
            'receiver_name' => $this->user ? $this->user->name : null,// Onaj kome je poruka poslata
            'chat_room_name' => $this->chatRoom ? $this->chatRoom->name : 'Unknown Room',
            'created_at' =>$this->created_at,
        ];
    }
}
