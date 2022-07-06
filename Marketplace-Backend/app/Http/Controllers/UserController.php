<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request; 
use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth; 
use Validator;
use App\User; 


class UserController extends Controller 
{
    public $successStatus = 200;

    /** 
     * login api 
     * 
     * @return \Illuminate\Http\Response 
     */ 

    public function login(){ 
        if(Auth::attempt(['email' => request('login'), 'password' => request('password'), 'role'=> request('role')]) || Auth::attempt(['telephone' => request('login'), 'password' => request('password')])){ 
            $user = Auth::user(); 
            $success['token'] =  $user->createToken($user->email."-".now()); 
            $success['role'] =  $user->role; 
            return response()->json(['success' => $success], $this-> successStatus);
        } 

        else{ 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }
    /** 
     * Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 

    public function register(Request $request) 
    { 
        $validator = Validator::make($request->all(), [ 
            'email' => 'required|string|email|unique:users', 
            'telephone'=> 'required|unique:users',
            'password' => 'required',
            'role' => 'required'
        ]);
        if ($validator->fails()) { 
                    return response()->json(['error'=>$validator->errors()], 401);            
                }
        $input = $request->all(); 
                $input['password'] = bcrypt($input['password']); 
                $user = User::create($input); 
                $success['token'] =  $user->createToken($user->email."-".now());
        return response()->json(['success'=>$success], $this-> successStatus); 
    }

    
    /** 
     * details api 
     * 
     * @return \Illuminate\Http\Response 
     */ 

    public function details() 
    { 
        $user = Auth::user(); 
        return response()->json(['success' => $user], $this-> successStatus); 
    } 

    /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
  
    /**
     * Get the authenticated User
     *
     * @return [json] user object
     */

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

}