<?php

namespace App\Http\Controllers;

use App\Models\Group;

use Illuminate\Http\Request;


class GroupsController extends Controller
{


    public function getGroups()
    {
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
    public function addNewGroup(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_private' => 'boolean',
        ]);


        $group = Group::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'is_private' => $request->input('is_private', false),  // Ako nije postavljeno, podrazumevano je false
        ]);
    }

    /*
    public function destroyByName($name)
    {
        $chatRoom = Group::where('name', $name)->first();

        if (!$chatRoom) {
            return response()->json(['message' => 'Chat room not found'], 404);
        }

        $chatRoom->delete();
        return response()->json(['message' => 'Chat room deleted successfully'], 200);
    }
        */
}
