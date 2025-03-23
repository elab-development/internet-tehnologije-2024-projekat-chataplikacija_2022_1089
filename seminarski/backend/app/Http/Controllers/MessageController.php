<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Message;
//use App\Events\MessageSent;
use Illuminate\Http\Request;
//use Illuminate\Mail\Events\MessageSent as EventsMessageSent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function index($groupId)
    {
        $messages = Message::where('group_id', $groupId)
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    public function store(Request $request, $groupId)
    {
        $user = Auth::user();
        if (!$user) {
            Log::error('Korisnik nije autentifikovan');
            return response()->json(['message' => 'Korisnik nije autentifikovan'], 401);
        }
        $request->validate([
            'content' => 'required|string',
        ]);
        $group = Group::find($groupId);
        if (!$group) {
            return response()->json(['message' => 'Grupa nije pronađena'], 404);
        }



        if (!$group->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Niste član ove grupe'], 403);
        }
        try {
            $message = Message::create([
                'group_id' => $groupId,
                'user_id' => $user->id,
                'content' => $request->content,
            ]);


            $message->load('user');

            // Emituj događaj za WebSockets
            //broadcast(new MessageSent($message))->toOthers();

            return response()->json(['message' => $message]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Došlo je do greške pri kreiranju poruke', 'error' => $e->getMessage()], 500);
        }
    }
    public function destroy(Message $message)
    {
        if ($message->user_id !== auth()->id()) {
            return response()->json(['message' => 'Nemate dozvolu za brisanje ove poruke'], 403);
        }

        // Brisanje poruke
        $message->delete();

        return response()->json(['message' => 'Poruka uspešno obrisana']);
    }

    public function edit(Message $message, Request $request)
    {
        if ($message->user_id !== auth()->id()) {
            return response()->json(['message' => 'Nemate dozvolu za editvanje ove poruke'], 403);
        }
        $validatedData = $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $message->update([
            'content' => $validatedData['content']
        ]);

        return response()->json([
            'message' => 'Poruka uspešno editovana',
            'data' => $message
        ]);
    }
}
