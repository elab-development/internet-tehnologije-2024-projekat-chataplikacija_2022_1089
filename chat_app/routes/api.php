<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//podaci o trenutno autentifikovanom korisniku
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//pag
Route::get('/chat-rooms', [ChatRoomController::class, 'index']); //Vraća listu svih chat soba.

// Zaštićene rute za autentifikovane korisnike
Route::middleware('auth:sanctum')->group(function () {

    // Rute za manipulaciju chat sobama
    Route::post('/chat-rooms', [ChatRoomController::class, 'store']); // Kreiranje nove chat sobe
    Route::delete('/chat-rooms/deleteByName/{name}', [ChatRoomController::class, 'destroyByName']);
});


Route::apiResource('messages', MessageController::class);
//pag
Route::get('/users', [UserController::class, 'index']); // Dohvata sve korisnike
Route::get('/users/{id}', [UserController::class, 'show']); // Dohvata određenog korisnika
//pag
//Route::get('/users/{id}/chat-rooms', [UserController::class, 'chatRooms']); // Dohvata sve chat sobe korisnika
//pag
Route::get('/messages/user/{userId}', [MessageController::class, 'getMessagesByUser']);// Dohvata sve poruke korisnika


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
//Korisnik više ne može da koristi token za pristup zaštićenim rutama.
//Ako pokuša da koristi isti token, dobija 401 Unauthorized.
//Ako se ponovo prijavi, dobija novi token.







