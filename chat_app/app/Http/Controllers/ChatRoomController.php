<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatRoomResource;
use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatRoomController extends Controller
{
    /*
      Vraća listu svih chat soba.
     
     */
    //paginacija i filtriranje
    public function index(Request $request)
    {
        $query = ChatRoom::query();

    // Filtriranje prema imenu sobe
    if ($request->has('name')) {
        $query->where('name', 'like', '%' . $request->input('name') . '%');
    }

    // Filtriranje prema privatnosti
    if ($request->has('is_private')) {
        $query->where('is_private', $request->input('is_private'));
    }

    // Filtriranje prema opisu sobe
    if ($request->has('description')) {
        $query->where('description', 'like', '%' . $request->input('description') . '%');
    }

    // Paginacija
    $chatRooms = $query->paginate(8);

    // Vraća podatke u JSON formatu sa odgovarajućim resursom
    return ChatRoomResource::collection($chatRooms);
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

        // Vraćanje podataka kroz ChatRoomResource sa statusom 201 (Created)
        return response()->json(new ChatRoomResource($chatRoom), 201);
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
