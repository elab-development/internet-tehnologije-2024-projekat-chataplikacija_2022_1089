<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{

    //Dohvata listu svih korisnika.

    public function index(Request $request): JsonResponse
    {
        $query = User::query();
        return response()->json($query);
    }

    public function getUsersByGroupId($groupId)
    {
        $users = DB::table('users')
            ->join('group_user', 'users.id', '=', 'group_user.user_id')
            ->where('group_user.group_id', $groupId)
            ->select('users.*')
            ->get();

        return response()->json(['users' => $users]);
    }
}
