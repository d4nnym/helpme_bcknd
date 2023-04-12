/*
import User from  "../models/paciente.js"
import {tokenSing} from  "../helpers/generateTokens.js"
import bcrypt from "bcrypt";


//Login con nombre de usuario 
   
export const loginCtr= async (req, res)=> {
    
    const  {profile, password} = req.body;
    console.log(profile, password)
    
    try{
        const user = await User.findOne({profile:profile}).select(' profile password name email role')
        console.log(user)
        if(!user){
          return res.status(200).json({success: false, error: 'Usuario no encontrado'})
        }

        const checkPassword= bcrypt.compareSync(password, user.password)
        console.log(checkPassword)
        // Aquí aun falta agregar lo de cookie parser, el token se debe enviar
        // al fronted con una cookie, este es solo provisional
        if(checkPassword){
          const tokensSession =await tokenSing(user)
          console.log(tokensSession)
           return res.status(200).json({success: true, user, tokensSession })
        }
        else {
          return   res.status(200).json({success: false, error: 'Usuario o contraseña incorrectos'})
        }
    }
    catch{
        return res.status(500).json({success: false, error: 'error, intente de nuevo'})
    }
  }

//---------------------------------------------------
//login con el email

  export const loginCtrEmail= async (req, res)=> {
    
    const  {email, password} = req.body;

    try{
        const user = await User.findOne({email:email}).select(' profile password name email role')
if(!user){
          return res.status(200).json({success: false, error: 'Usuario no encontrado'})
        }

        const checkPassword= bcrypt.compareSync(password, user.password)
        
        // Aquí aun falta agregar lo de cookie parser, el token se debe enviar
        // al fronted con una cookie, este es solo provisional
        if(checkPassword){
          const tokensSession =await tokenSing(user)
           return res.status(200).json({success: true, user, tokensSession })
        }
        else {
          return   res.status(200).json({success: false, error: 'Usuario o contraseña incorrectos'})
        }
    }
    catch{
        return res.status(500).json({success: false, error: 'error, intente de nuevo'})
    }
  }

  //------------------------------------------------------------------------------------------
*/
