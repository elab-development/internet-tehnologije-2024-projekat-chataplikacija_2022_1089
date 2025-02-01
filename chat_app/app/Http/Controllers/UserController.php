<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Dohvata listu svih korisnika.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Dohvata sve korisnike
        $users = User::all();

        // Vraća podatke u JSON formatu
        return response()->json($users);
    }

    /**
     * Dohvata određenog korisnika.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

        // Vraća podatke u JSON formatu
        return response()->json($user);
    }

    /**
     * Dohvata sve chat sobe korisnika.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function chatRooms(int $id): JsonResponse
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

        // Dohvata sve chat sobe korisnika
        $chatRooms = $user->chatRooms;

        // Vraća podatke u JSON formatu
        return response()->json($chatRooms);
    }

    /**
     * Dohvata sve poruke korisnika.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function messages(int $id): JsonResponse
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

        // Dohvata sve poruke korisnika
        $messages = $user->messages;

        // Vraća podatke u JSON formatu
        return response()->json($messages);
    }
}
