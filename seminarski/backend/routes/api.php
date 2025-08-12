<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    //return $request->user();
//});

// Rate limiting za login pokušaje - max 5 u minuti
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
Route::post('/guest-login', [AuthController::class, 'guestLogin']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
});

Route::get('/user', [AuthController::class, 'getCurrentUser']);


Route::get('/groups', [GroupsController::class, 'getGroups']);
Route::post('/add-group/{userId}', [GroupsController::class, 'addNewGroup']);
Route::get('/groups/{groupId}/users', [UserController::class, 'getUsersByGroupId']);

Route::get('/check-group-name', function (Request $request) {
    $exists = DB::table('groups')->where('name', $request->name)->exists();
    return response()->json(['exists' => $exists]);
});

Route::delete('/groups/{groupId}/wallpaper', [GroupsController::class, 'deleteWallpaper']);
Route::get('/users', [UserController::class, 'getAllUsers']);
//Route::get('/admin/groups', [GroupsController::class, 'getGroupsForAdmin']);
Route::get('/groupsAdm', [GroupsController::class, 'getAllGroups']);
Route::get('/groups/{groupId}/users', [GroupsController::class, 'getUsersByGroupId']);
Route::get('/groups/{userId}/groups', [GroupsController::class, 'getGroupsByUserId']);
Route::post('/groups/{groupId}/users', [GroupsController::class, 'updateGroupUsers']);
Route::post('/groups/{groupId}/usersadd', [GroupsController::class, 'addUsersToGroup']);
Route::delete('/groups/{userId}/{groupId}', [GroupsController::class, 'leaveGroup']);
Route::delete('/groups/{groupId}', [GroupsController::class, 'deleteGroup']);
Route::post('/groups/{groupId}/wallpaper', [GroupsController::class, 'addWallpaper']);
Route::get('/groups/{groupId}/wallpaper', [GroupsController::class, 'getWallpaper']);
Route::get('/group-activity', [GroupsController::class, 'getGroupActivity']);
 Route::get('/messages/{groupId}', [MessageController::class, 'index']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
   
    Route::post('/messages/{groupId}', [MessageController::class, 'store']);
    Route::delete('messages/{message}', [MessageController::class, 'destroy']);
    Route::put('messages/{message}', [MessageController::class, 'edit']);
    
});


 