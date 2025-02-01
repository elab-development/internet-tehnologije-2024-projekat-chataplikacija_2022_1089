<?php

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


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/chat-rooms', [ChatRoomController::class, 'index']); //Vraća listu svih chat soba.
Route::post('/chat-rooms', [ChatRoomController::class, 'store']); //kreiranje nove chat sobe,prihvata name i created by
Route::post('/chat-rooms/{id}/users', [ChatRoomController::class, 'addUser']);//dodavanje korisnika u sobu
Route::delete('/chat-rooms/{id}/users/{user_id}', [ChatRoomController::class, 'removeUser']);//uklanjanje korisnika iz chat sobe

/*
Route::get('/messages', [MessageController::class, 'index']); // Dohvata sve poruke
Route::get('/messages/{id}', [MessageController::class, 'show']); // Dohvata određenu poruku
Route::post('/messages', [MessageController::class, 'store']); // Šalje novu poruku
Route::put('/messages/{id}', [MessageController::class, 'update']); // Ažurira poruku
Route::delete('/messages/{id}', [MessageController::class, 'destroy']); // Briše poruku
*/
Route::apiResource('messages', MessageController::class);

Route::get('/users', [UserController::class, 'index']); // Dohvata sve korisnike
Route::get('/users/{id}', [UserController::class, 'show']); // Dohvata određenog korisnika
Route::get('/users/{id}/chat-rooms', [UserController::class, 'chatRooms']); // Dohvata sve chat sobe korisnika
Route::get('/users/{id}/messages', [UserController::class, 'messages']); // Dohvata sve poruke korisnika
