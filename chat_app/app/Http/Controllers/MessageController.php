<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Models\Message;
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
            return MessageResource::collection($messages);
    }

    public function store(Request $request)
    {
       // Validacija podataka
        $validated = $request->validate([
            'content' => 'required|string',  
            'chat_room_id' => 'required|exists:chat_rooms,id',  // Osigurava da chat_room_id postoji u bazi
        ]);

        // Kreiranje nove poruke u bazi
        $message = Message::create([
            'content' => $validated['content'],
            'chat_room_id' => $validated['chat_room_id'],
            'is_read' => false,  // Po defaultu, postavimo da poruka nije pročitana
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
}
