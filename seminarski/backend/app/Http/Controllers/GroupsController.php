<?php

namespace App\Http\Controllers;

use App\Models\Group;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GroupsController extends Controller
{
    public function getAllGroups()
    {
        $groups = Group::all(['id', 'name', 'is_private', 'description']);
        return response()->json(['groups' => $groups]);
    }

    public function getGroups(Request $request)
    {

            try {
        $user = $request->user();

        if (!$user || $user->role === 'guest') {
            // Ako korisnik nije ulogovan ili je guest, vraćamo samo javne grupe
            $groups = Group::where('is_private', 0)->get();
        } else {
            // Za ostale korisnike vraćamo sve grupe
            $groups = Group::all();
        }

        return response()->json([
            'status' => 'success',
            'groups' => $groups
        ], 200);
        } catch (\Exception $e) {
             return response()->json([
                'status' => 'error',
                'message' => 'Greška pri dohvatanju grupa: ' . $e->getMessage()
            ], 500);
        }

    }
    public function getGroupsForAdmin(Request $request) 
        {
            // Admin endpoint - vraća sve grupe bez provere autentifikacije
            try {
                $groups = Group::all();
                return response()->json([
                    'status' => 'success',
                    'groups' => $groups
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Greška pri dohvatanju grupa: ' . $e->getMessage()
                ], 500);
            }
        }



    //kreiranje nove chat sobe
    public function addNewGroup(Request $request, $userId)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_private' => 'boolean',
        ]);

        try{
             $group = Group::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'is_private' => $request->input('is_private', false),  // Ako nije postavljeno, podrazumevano je false
            ]);

            $this->addUsersToGroup(
                new Request(['user_ids' => [$userId]]), 
                $group->id
            );
    
            return response()->json([
                'message' => 'Grupa uspešno kreirana',
                'group' => $group
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Greška prilikom kreiranja grupe',
                'error' => $e->getMessage()
            ], 500);
        }
       
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

    public function getGroupsByUserId($userId)
    {
        $groups = DB::table('groups')
            ->join('group_user', 'groups.id', '=', 'group_user.group_id')
            ->where('group_user.user_id', $userId)
            ->select('groups.*')
            ->get();

        return response()->json(['groups' => $groups]);
    }


    public function updateGroupUsers(Request $request, $groupId)
    {
        $group = Group::findOrFail($groupId);

        // uklanjanje svih postojećih veze i dodaje nove
        $group->users()->sync($request->user_ids);

        return response()->json(['message' => 'Korisnici grupe uspešno ažurirani']);
    }

    public function addUsersToGroup(Request $request, $groupId)
    {

        $validated = $request->validate([
            'user_ids' => 'required|array',
        ]);

        try {
            $group = Group::findOrFail($groupId);

            // dohvatanje korisnika bez dupliranja
            $group->users()->syncWithoutDetaching($validated['user_ids']);

            // Koristimo direktan upit za dohvatanje korisnika
            return response()->json([
                'message' => 'Korisnici uspešno dodati u grupu',
                'users' => DB::table('users')
                    ->join('group_user', 'users.id', '=', 'group_user.user_id')
                    ->where('group_user.group_id', $groupId)
                    ->select('users.id', 'users.username', 'users.email', 'users.role')
                    ->get()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Došlo je do greške prilikom obrade zahteva'
            ], 500);
        }
    }


    public function getGroupActivity()
    {
        $groupActivity = Group::select('groups.id', 'groups.name')
            ->leftJoin('messages', 'groups.id', '=', 'messages.group_id')
            ->selectRaw('COALESCE(COUNT(messages.id), 0) as message_count')
            ->groupBy('groups.id', 'groups.name')
            ->orderBy('message_count', 'desc')
            ->get();

            

        return response()->json($groupActivity);
    }

    public function deleteGroup(int $id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return response()->json(['message' => 'Grupa uspešno obrisana']);
    }

    public function leaveGroup(int $userId, int $groupId)
    {
        try {
            
            $group = Group::findOrFail($groupId);
            $group->users()->detach($userId);
            
            // Dohvatanje ažurirane liste korisnika u grupi
            $remainingUsers = DB::table('users')
                ->join('group_user', 'users.id', '=', 'group_user.user_id')
                ->where('group_user.group_id', $groupId)
                ->select('users.id', 'users.username', 'users.email', 'users.role')
                ->get();
            
            return response()->json([
                'message' => 'Korisnik uspešno uklonjen iz grupe',
                
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Došlo je do greške prilikom napuštanja grupe'
            ], 500);
        }
    }

    public function addWallpaper(int $groupId, Request $request){
        try{

            $group = Group::findOrFail($groupId);
            $validatedData = $request->validate([
                'wallpaper' => 'required'
            ]);
    
            $group->update([
                'wallpaper' => $validatedData['wallpaper']
            ]);
            return response()->json([
                'message' => 'Dodata pozadina uspesno',
               
            ]);
    


        }catch(\Exception $e){
            return response()->json([
                'message' => 'Došlo je do greške prilikom dodavanja pozadine'
            ], 500);
        }
    }
    public function getWallpaper(int $groupId){
        try {
            $group = Group::findOrFail($groupId);
            return response()->json([
                'wallpaper' => $group->wallpaper
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Greška prilikom dohvatanja wallpaper-a.'
            ], 500);
        }

    }
    public function deleteWallpaper(int $groupId){
        /*try {
            $group = Group::findOrFail($groupId);
            
            // Postavlja vrednost 'wallpaper' kolone na null
            $group->wallpaper = null;
            $group->save();
            
            return response()->json([
                'message' => 'Pozadina uspešno obrisana'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Došlo je do greške prilikom brisanja pozadine'
           ], 500);
          
        }*/
        try {
            $group = Group::findOrFail($groupId);
            $group->wallpaper = null;
            $group->save();
            
            return response()->json([
                'message' => 'Pozadina uspešno obrisana'
            ]);
        } catch (\Exception $e) {
            // Vrati sve detalje greške u odgovoru
            return response()->json([
                'message' => 'Došlo je do greške prilikom brisanja pozadine',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }

    }
}
