<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
//use Laravel\Sanctum\Contracts\HasApiTokens;




class AuthController extends Controller
{
    // Registracija regularnog korisnika
    public function register(Request $request)
    {
        // Validacija unetih podataka
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:5|confirmed',
            //'conformPass' => 'required|same:password' 
        ], [
            // Prilagođene poruke za greške
            'username.unique' => 'Korisničko ime je već zauzeto.',
            'email.unique' => 'Email adresa je već registrovana.',
            'password.min' => 'Lozinka mora imati najmanje 5 karaktera.',
            'password.confirmed' => 'Potvrda lozinke se ne poklapa.'
        ]);

        if ($validator->fails()) {
            // Logovanje grešaka
            Log::error('Validation Errors:', $validator->errors()->toArray());

            return Response::json([
                'errors' => $validator->errors()
            ], 422);
        }
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user'
        ]);

        return Response::json($user, 201);
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Podaci za prijavljivanje su neispravni.'],
            ]);
        }

        Auth::login($user);

        // Kreiranje tokena
        //$token = $user->createToken('auth_token')->plainTextToken;
        //
       // $refreshToken = Str::random(60);

        //$user->update([
            //'refresh_token' => Hash::make($refreshToken),
           // 'refresh_token_expiry' => now()->addDays(30) // 30 dana važenja
       // ]);

        return Response::json([
            //'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role
            ]
            ]);;
        

    }


    public function guestLogin()
    {
        $lastGuestUser = User::where('role', 'guest')
            ->orderBy('id', 'desc')
            ->first();

        // Generiše novi redni broj gosta
        $guestNumber = $lastGuestUser
            ? (int)Str::replace('Gost', '', $lastGuestUser->username) + 1
            : 1;

        // Kreiranje novog gost korisnika
        $guestUser = User::create([
            'username' => 'Gost' . $guestNumber,
            'email' => null,
            'password' => null,
            'role' => 'guest'
        ]);
        Auth::login($guestUser);

       // $token = $guestUser->createToken('auth_token')->plainTextToken;

        return Response::json([
            
            'user' => [
                'id' => $guestUser->id,
                'username' => $guestUser->username,
                'role' => $guestUser->role
            ]
        ], 201);

    }

    public function logout(Request $request)
    {
        
        //$request->user()->tokens()->delete();
    
       
        Auth::guard('web')->logout();
        
       
        $request->session()->invalidate();
        
        
        $request->session()->regenerateToken();
    
        return response()->json(['message' => 'Uspešno ste se odjavili']);
       
        
      
    }

    public function getCurrentUser(Request $request)
    {
        return response()->json($request->user());

       
    }

     public function resetPassword(Request $request)
    {
        try {
            // Validacija input podataka
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'new_password' => 'required|min:5|confirmed',
                'new_password_confirmation' => 'required'
            ], [
                'email.required' => 'Email je obavezan',
                'email.email' => 'Email format nije valjan',
                'email.exists' => 'Korisnik sa ovim emailom ne postoji',
                'new_password.required' => 'Nova lozinka je obavezna',
                'new_password.min' => 'Lozinka mora imati najmanje 5 karaktera',
                'new_password.confirmed' => 'Lozinke se ne poklapaju',
                'new_password_confirmation.required' => 'Potvrda lozinke je obavezna'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            // Pronađi korisnika po email-u
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Korisnik sa ovim emailom ne postoji'
                ], 404);
            }

            // Ažuriraj lozinku
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Log aktivnosti (opciono)
            \Log::info('Password reset successful', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Lozinka je uspešno promenjena'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Password reset error', [
                'error' => $e->getMessage(),
                'email' => $request->email ?? 'N/A',
                'ip' => $request->ip()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Došlo je do greške pri promeni lozinke. Pokušajte ponovo.'
            ], 500);
        }
    }

}
