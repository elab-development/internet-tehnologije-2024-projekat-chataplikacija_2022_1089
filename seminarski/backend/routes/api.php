<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupsController;
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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/guest-login', [AuthController::class, 'guestLogin']);
Route::get('/groups', [GroupsController::class, 'getGroups']);
Route::post('/add-group', [GroupsController::class, 'addNewGroup']);
Route::get('/groups/{groupId}/users', [UserController::class, 'getUsersByGroupId']);

Route::get('/users', [UserController::class, 'getAllUsers']);
Route::get('/groups/{groupId}/users', [GroupsController::class, 'getUsersByGroupId']);
Route::post('/groups/{groupId}/users', [GroupsController::class, 'updateGroupUsers']);
Route::post('/groups/{groupId}/usersadd', [GroupsController::class, 'addUsersToGroup']);
