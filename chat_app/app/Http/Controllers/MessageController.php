<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Models\ChatRoom;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        // Kreiramo osnovni upit
        $query = Message::query();

    
        $cacheKey = 'messages_' . md5($request->fullUrl()); // Koristimo URL kao ključ za keširanje

        $messages = Cache::remember($cacheKey, 60, function () use ($query) {
            return $query->paginate(10); // 10 je broj poruka po stranici
        });
            return MessageResource::collection($messages->items());
    }

    public function store(Request $request)
    {
          
    // Validacija podataka
        $validated = $request->validate([
            'content' => 'required|string',  
            'chat_room_name' => 'required|string|exists:chat_rooms,name', // Proverava da li soba postoji
            'user_name' => 'required|string|exists:users,name', // Proverava da li korisnik postoji, primalac
            'is_read' => 'nullable|boolean'
        ]);

        // Pronalaženje ID-a sobe na osnovu imena
        $chatRoom = ChatRoom::where('name', $validated['chat_room_name'])->first();
        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        // Pronalaženje ID-a korisnika na osnovu imena
        $receiver = User::where('name', $validated['user_name'])->first();
        if (!$receiver) {
            return response()->json(['message' => 'Receiver user not found'], 404);
        }

        // Kreiranje nove poruke u bazi
        $message = Message::create([
            'content' => $validated['content'],
            'chat_room_id' => $chatRoom->id, // Koristimo ID pronađene sobe
            'user_id' => $receiver->id, // Koristimo ID pronađenog korisnika
            'is_read' => $validated['is_read'] ?? false, // Podrazumevano nije pročitana
            'sender_name' =>auth()->user()->name, 
        ]);

        // Vraća podatke o poruci koristeći MessageResource
        return new MessageResource($message);
       
     
        
    }



    public function show(int $id)
    {
        $message = Message::findOrFail($id);
        return new MessageResource($message);
    }

    public function update(Request $request, int $id)
    {
        $message = Message::findOrFail($id);
        $message->update($request->all());
        return new MessageResource($message);
    }

    public function destroy(int $id): JsonResponse
    {
        $message = Message::findOrFail($id);
        $message->delete();
        return response()->json(null, 204);
    }
    
    public function getMessagesByUser($userId)
    {
        // Pretraga poruka po user_id
        $messages = Message::where('user_id', $userId)->paginate(10);

        // Vraćanje poruka kao JSON
        return MessageResource::collection($messages->items());
    }
        
    public function getMessagesByChatRoomName($chatRoomName)
    {
        // Pronalazi chat room na osnovu imena
        $chatRoom = ChatRoom::where('name', $chatRoomName)->first();

        // Provera da li soba postoji
        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        // Pronalazi poruke koje pripadaju toj sobi
        $messages = Message::where('chat_room_id', $chatRoom->id)->paginate(10);

        // Vraća poruke koristeći MessageResource
        return MessageResource::collection($messages->items());
    }

}
