<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|max:255",
            "email" => "required|email|unique:users",
            "password" => "required|string",
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $input = $request->all();
        User::create($input);

        return response()->json(["success" => TRUE]);
    }


    function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email|string",
            "password" => "required|string",
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $credentials = $request->only('email', 'password');
        $token = Auth::attempt($credentials);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        return response()->json([
            "success" => TRUE,
            "user" => $user,
            "token" => $token
        ]);
    }

    function updatePreferences(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(["success" => FALSE], 401);
        }
        $user = User::find($user->id);
        $user->preferences = json_encode($request->only("categories", "authors", "sources"));
        $user->save();
        return response()->json(["success" => TRUE]);
    }
}
