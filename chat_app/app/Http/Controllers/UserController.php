<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatRoomResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    
     //Dohvata listu svih korisnika.
    
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

        $cacheKey = 'users_' . md5($request->fullUrl()); // Koristimo URL kao ključ za keširanje

        // Keširamo podatke sa paginacijom
        $users = Cache::remember($cacheKey, 60, function () use ($query) {
            return $query->paginate(5); // 5 je broj elemenata po stranici
        });//60 znaci 60 minuta, remmember pronalazi podatke u kesu pod yadatim kljucem
            // treci parametar ce ako ga nema u kesu ranije, kesirati sada

        // Vraća podatke u JSON formatu sa odgovarajućim resursom
        return response()->json(UserResource::collection($users->items()));
    }

    /**
     * Dohvata određenog korisnika.
     */
    public function show(int $id)
    {
        // Pronalaženje korisnika po ID-u
        $user = User::findOrFail($id);

        // Vraća podatke definisanog u resource
        return new UserResource($user);
    }

    
     
}
