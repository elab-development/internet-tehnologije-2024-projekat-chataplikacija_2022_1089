<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatRoomController extends Controller
{
    /*
      Vraća listu svih chat soba.
     
     */
    public function index(): JsonResponse
    {
        // Dohvata sve chat sobe iz baze
        $chatRooms = ChatRoom::all();

        // Vraća podatke u JSON formatu
        return response()->json($chatRooms);
    }



    //kreiranje nove chat sobe,prihvata name i created by
    public function store(Request $request): JsonResponse
    {
        // Validacija podataka
        $request->validate([
            'name' => 'required|string|max:255',
            'created_by' => 'required|exists:users,id',
        ]);

        // Kreiranje nove chat sobe
        $chatRoom = ChatRoom::create([
            'name' => $request->input('name'),
            'created_by' => $request->input('created_by'),
        ]);

        // Vraćanje odgovora sa statusom 201 (Created)
        return response()->json($chatRoom, 201);
    }





    //uklanjanje korisnika iz chat sobe
    public function removeUser(int $chatRoomId, int $userId): JsonResponse
    {
        // Pronalaženje chat sobe
        $chatRoom = ChatRoom::findOrFail($chatRoomId);

        // Pronalaženje korisnika
        $user = User::findOrFail($userId);

        // Uklanjanje korisnika iz chat sobe
        $chatRoom->users()->detach($user->id);

        // Vraćanje odgovora sa statusom 200 (OK)
        return response()->json([
            'message' => 'Korisnik je uspešno uklonjen iz chat sobe.',
            'chat_room' => $chatRoom,
            'user' => $user,
        ]);
    }

}
