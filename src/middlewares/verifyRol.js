// funcion que recibe doble parametros, va a recibir el array con los roles de usuario pérmitidos en la ruta,  
// y el req, res y next 

/**
 * Array con los roles de usuario que estan permitidos en la ruta
 * @param {*} roles 
 * @returns 
 */

export const checkRol =(roles)=>(req, res, next)=>{  
   try{

    const {user}= req
    const roleUser= user.role //extrae el rol del usuario desde la bd 
    const checkValueRol = roles.some((rolSingle)=> roleUser.includes(rolSingle))

    //La linea anterior devuelve un true o un false 
    if(!checkValueRol){
        res.status(200).json({success: false, error: 'No tienes permisos '})
        return
    }
    next()
   }catch(e){
    return res.status(500).json({success: false, error: 'Error, intente de nuevo'})
    }
}