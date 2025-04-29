<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Registracija korisnika
    public function register(Request $request)
    {
        // Validacija unetih podataka
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        // Kreiranje novog korisnika
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),  // Enkriptovanje lozinke
        ]);

        // Kreiranje tokena za novog korisnika
        $token = $user->createToken('ChatAppToken')->plainTextToken;

        // Vraćanje odgovora sa tokenom
        return response()->json([
            'data' => $user,
            'message' => 'User registered successfully!',
            'token' => $token,
            'token_type' => 'Bearer' // ako netko poseduje ovaj token, smatra se da je ovlašten za pristup
            //odredjenim resursima bez dodatnih dokaza identitteta
        ]);
    }



    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        //Provera da li postoji korisnik sa datim email-om
        $user = User::where('email', $request->email)->first();// first uzima samo prvog korisnika

        // Provera lozinke
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Netacna sifra'
            ], 401);
     }

        // Brisanje prethodnih tokena 
        $user->tokens()->delete();

        // Kreiranje novog tokena
        $token = $user->createToken('ChatAppToken')->plainTextToken;

         return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Login successful',
            'token_type' =>'Bearer'
        ], 200);
    }

    public function logout(Request $request)
    {
        // Brisanje samo trenutnog tokena (trenutne sesije korisnika)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
          'message' => 'User logged out successfully!'
        ], 200);
    }



}
