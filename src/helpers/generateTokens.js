import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js';


//Genera un Token firmado 

export const tokenSing =async (user)=>{
 
    return jwt.sign(
    {
        _id: user.id,
        role: user.role,
        exp: Date.now()+60*1000000
    },//carga util
    JWT_SECRET, //LLave maestra con la que se firma el token, sirve para saber si ese token fue generado por nosotros o no 
    )
}

//verifica si ese token lo hemos generado nosotros 

export const verifyToken =async (token)=>{

try {
   
    return jwt.verify(token,  JWT_SECRET)

}catch(error){
     return null 
}
}


