<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        //'remember_token',
    ];
    // Metode za proveru role
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isRegisteredUser()
    {
        return $this->role === 'user';
    }

    public function isGuest()
    {
        return $this->role === 'guest';
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class)->withTimestamps();
    }
}
