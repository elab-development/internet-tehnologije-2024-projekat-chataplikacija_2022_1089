<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatRoomResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Dohvata listu svih korisnika.
     
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Filtriranje prema imenu korisnika
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

     // Filtriranje prema email-u korisnika
        if ($request->has('email')) {
           $query->where('email', 'like', '%' . $request->input('email') . '%');
        }

        // Filtriranje prema statusu verifikacije
        if ($request->has('email_verified_at')) {
            $query->whereNotNull('email_verified_at');
        }

        // Filtriranje prema poslednjem viđenju
        if ($request->has('last_seen_at')) {
            $query->where('last_seen_at', '>=', $request->input('last_seen_at'));
        }

        // Paginacija
        $users = $query->paginate(5);

        // Vraća podatke u JSON formatu sa odgovarajućim resursom
        return response()->json(UserResource::collection($users));
    }

    /**
     * Dohvata određenog korisnika.
     *
     * 
     */
    public function show(int $id)
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

        // Vraća podatke definisanog u resource
        return new UserResource($user);
    }

    /**
     * Dohvata sve chat sobe korisnika.
     
     */
    public function chatRooms(int $id, Request $request): JsonResponse
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

        // Dohvata sve chat sobe korisnika
        $query = $user->chatRooms;
        // Filtriranje prema imenu sobe
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        // Filtriranje prema privatnosti
        if ($request->has('is_private')) {
            $query->where('is_private', $request->input('is_private'));
        }

        // Paginacija
        $chatRooms = $query->paginate(10);


        // Vraća podatke u JSON formatu
        return response()->json(ChatRoomResource::collection($chatRooms));
    }

    /**
     * Dohvata sve poruke korisnika.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function messages(int $id, Request $request): JsonResponse
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

     
        $query = $user->messages;
        // Filtriranje prema statusu pročitano/nisu pročitano
        if ($request->has('is_read')) {
            $query->where('is_read', $request->input('is_read'));
        }

        // Filtriranje prema sadržaju poruke
        if ($request->has('content')) {
            $query->where('content', 'like', '%' . $request->input('content') . '%');
        }

        // Filtriranje prema chat sobi
        if ($request->has('chat_room_id')) {
            $query->where('chat_room_id', $request->input('chat_room_id'));
        }

        // Paginacija
        $messages = $query->paginate(5);

        // Vraća podatke u JSON formatu
        return response()->json(MessageResource::collection($messages));
    }
}
