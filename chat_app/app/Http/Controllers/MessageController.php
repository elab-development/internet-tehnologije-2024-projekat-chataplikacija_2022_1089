<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
/*

class MessageController extends Controller
{
     /**
     * Dohvata listu svih poruka.
    
     
    public function index(): JsonResponse
    {
        // Dohvata sve poruke
        $messages = Message::all();

        // Vraća podatke u JSON formatu
        return response()->json($messages);
    }

    /**
     * Dohvata određenu poruku.
     
     
    public function show(int $id): JsonResponse
    {
        // Pronalaženje poruke po ID-u
        $message = Message::findOrFail($id);

        // Vraća podatke u JSON formatu
        return response()->json($message);
    }

    /**
     * Šalje novu poruku.
    
     
    public function store(Request $request): JsonResponse
    {
        // Validacija podataka
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'chat_room_id' => 'required|exists:chat_rooms,id',
            'content' => 'required|string',
        ]);

        // Kreiranje nove poruke
        $message = Message::create([
            'user_id' => $request->input('user_id'),
            'chat_room_id' => $request->input('chat_room_id'),
            'content' => $request->input('content'),
        ]);

        // Vraćanje odgovora sa statusom 201 (Created)
        return response()->json($message, 201);
    }

    /**
     * Ažurira sadržaj poruke.
     
     
    public function update(Request $request, int $id): JsonResponse
    {
        // Validacija podataka
        $request->validate([
            'content' => 'required|string',
        ]);

        // Pronalaženje poruke po ID-u
        $message = Message::findOrFail($id);

        // Ažuriranje sadržaja poruke
        $message->update([
            'content' => $request->input('content'),
        ]);

        // Vraćanje odgovora sa statusom 200 (OK)
        return response()->json($message);
    }

    /**
     * Briše poruku.
     
     
    public function destroy(int $id): JsonResponse
    {
        // Pronalaženje poruke po ID-u
        $message = Message::findOrFail($id);

        // Brisanje poruke
        $message->delete();

        // Vraćanje odgovora sa statusom 204 (No Content)
        return response()->json(null, 204);
    }
}
*/
class MessageController extends Controller
{
    public function index(): JsonResponse
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        $message = Message::create($request->all());
        return response()->json($message, 201);
    }

    public function show(int $id): JsonResponse
    {
        $message = Message::findOrFail($id);
        return response()->json($message);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $message = Message::findOrFail($id);
        $message->update($request->all());
        return response()->json($message);
    }

    public function destroy(int $id): JsonResponse
    {
        $message = Message::findOrFail($id);
        $message->delete();
        return response()->json(null, 204);
    }
}
