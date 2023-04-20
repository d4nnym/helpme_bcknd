import {verifyToken} from  "../helpers/generateTokens.js"
import User from  "../models/paciente.js"


export const authMiddleware = async (req, res, next)=>{
    
    try{
        const {userToken}= req.cookies;

        if(!userToken){
            return res.status(200).json({success: false, error: 'No tienes acceso'})    
        }
        
        //const token =req.headers.authorization.split(' ').pop(); //captura el token del user desde el header

      

        const dataToken= await verifyToken(userToken);

        if(!dataToken._id ){
            return res.status(200).json({success: false, error: 'Token de acceso invalido'})
          
        }
        const user = await User.findById(dataToken._id);
        req.user=user 
        //inyecta la información del user desde la bd  al req para poderla usar en el siguiente middleware 'checkRol'
        next(); 
    }
    catch(e){
        return res.status(500).json({success: false, error: 'error, intente de nuevo'})
    }
}