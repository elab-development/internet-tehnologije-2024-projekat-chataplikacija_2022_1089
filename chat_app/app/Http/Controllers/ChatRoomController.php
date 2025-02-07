<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatRoomResource;
use App\Models\ChatRoom;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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


        // Kreiramo jedinstveni ključ za keširanje
        $cacheKey = 'chat_rooms_' . md5($request->fullUrl()); // Koristimo URL kao ključ za keširanje

        // Keširamo podatke sa paginacijom
        $chatRooms = Cache::remember($cacheKey, 60, function () use ($query) {
            return $query->paginate(8); 
        });

        
        return ChatRoomResource::collection($chatRooms->items());
    }



    //kreiranje nove chat sobe
    public function store(Request $request): JsonResponse
    {
       // Validacija podataka
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_private' => 'boolean',
        ]);

        // Kreiranje nove chat sobe
        $chatRoom = ChatRoom::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'is_private' => $request->input('is_private', false),  // Ako nije postavljeno, podrazumevano je false
    
        ]);

        // Vraćanje podataka kroz ChatRoomResource sa statusom 201 (Created)
        return response()->json(new ChatRoomResource($chatRoom), 201);
        }

    //brisanje sobe sa odredjenim imenom
    public function destroyByName($name)
    {
        $chatRoom = ChatRoom::where('name', $name)->first();

        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }  

        $chatRoom->delete();  
        return response()->json(['message' => 'Chat room deleted successfully'], 200);
    }
        

}
