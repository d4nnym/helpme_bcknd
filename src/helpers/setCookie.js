import { serialize } from "cookie";

export const  serializedToken = async (token)=>{

    const serializedT = serialize("userToken", token, {
    
        httpOnly: false, //cuando ya estemos en producción no lo va a mostrar en las herramientas del navegador 
        secure: false,
        signed: true,
        sameSite: "none",
        maxAge: 1000*60*60*24*20,
        path: '/' //ruta de donde va a ser entregada 
    })
    return serializedT; 


} 

export const  salir = async (salir)=>{

    const serializedT = serialize("userToken", salir, {
    
        httpOnly: false, //cuando ya estemos en producción no lo va a mostrar en las herramientas del navegador 
        secure: false,
        signed: true,
        sameSite: "none",
        maxAge: 0,
        path: '/' //ruta de donde va a ser entregada 
    })
    return serializedT; 


} 