import Administrador from "../models/administrador.js"
import Psicologo from "../models/psicologo.js";
import mongoose from 'mongoose';
import {tokenSing} from  "../helpers/generateTokens.js"
import bcrypt from "bcrypt";
import { serializedToken } from "../helpers/setCookie.js";
import Citas from "../models/citas.js";



// Función crear 
export const crearAdministrador = async (req,res)=>{
  try{
  const administrador = new Administrador (req.body);
  await administrador.save();

  res.status(200).json({success: true, request: "Se creó correctamente"});
  }
  catch{
    res.status(200).json({success: false, error:"¡Data incorrecta!"})
  }
}


// Función buscar todos los admin
export const buscarAdministradores = async(req,res)=>{
  try{
  const administrador = await Administrador.find()
  res.status(200).json({success: true, administrador});
  }catch(error){
    res.status(500).json({success: false, error: '¡Error, intente de nuevo!'})
  }
}



// Función buscar un administrador 
export const buscarAdministrador = async (req,res)=>{
  const {id} = req.params;

  Administrador.findById(id)
  .then((content)=>{
    if(!content){
      return res.status(200).json({success: false, error: "El administrador no ha sido encontrado"})}
      return res.status(200).json({success: true, content})
  })
  .catch((error)=>{
    res.status(500).json({success: false, error: '¡Error, intente de nuevo!'})
  });
 
}


// Función eliminar 
export const eliminarAdministrador = async (req, res)=>{

  const{id}=req.params;

  Administrador.findByIdAndDelete(id).then((content)=>{
    
    if(content)
    return res.status(200).json({success: true, request: `El administrador ${id} ha sido eliminado`})

    if(!content)
    return res.status(200).json({success: false, error:"El administrador no ha sido encontrado"})
  })
  .catch((error)=>{
    res.status(500).json({success: false, error: '¡Error, intente de nuevo!'})
  })
}



// Función actualizar 
export const actualizarAdministrador = async (req,res)=>{
  const {id} = req.params;
  console.log({id}); 
  try {
    const administrador = await Administrador.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
    Administrador.findById(id).then((content)=>{

      if(content){
        return  res.status(200).json({success: true,  request: `El administrador con id: ${id}  se actualizó correctamente`});}
      if(!content){
        return  res.status(200).json({success:false, request: "El administrador que desea actualizar no existe"});}
      }).catch((error)=>{
        console.error(error);
        return res.status(500).json({success: false, error: '¡Error, intente de nuevo!'})
      })
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, error: '¡Error, intente de nuevo!'})
  }    
}


// Función obtener los psicólogos con validacion = false
export const psicoNoValidados = async (req, res) => {
  try {
    const psico = await Psicologo.find({validacion: false});
    if (psico.length === 0) {
      return res.status(200).json({succes: false, request: 'Psicólogos no encontrados en la base de datos'});}
    return res.status(200).json({succes: true, request: 'Se obtuvieron todos los psicólogos NO VALIDADOS', psicologos: psico});
  } catch (error) {
    return res.status(500).json({ success: false, request: '¡Error al obtener los psicólogos!', error: error});
  }
}


//Trae todos los psicologos validados 

export const psicoValidados = async (req, res) => {
    try{
        const psico = await Psicologo.find({validacion: true});
        if (psico.length === 0) {
          return res.status(200).json({ succes: false, request:  'No se encontraron psicólogos en la base de dato4s' });
        }
        return res.status(200).json({ succes: true, request: 'Se obtuvieron todos los psicólogos validados con éxito4', psicologos: psico });
      } catch (error) {
        return res.status(500).json({ success: true, request: 'Hubo un error al obtener los psicólogos4', error: error });
    }
}

//_--------------------------------------------------------------------------------------------------------------------------------
//Función que valida el psicolo y cambia el estado default del rol  "paciente" a "psicologo" y 4l campo validación a "true"

export const validarPsicologo = async (req, res) => {

  const {id}= req.body

  try {

    const psicologo=await Psicologo.findById(id)

    if(!psicologo){
        return res.status(200).json({ succes: false, mensaje: 'El psicologo que desea validar no existe' });
    }
    await Psicologo.findByIdAndUpdate({_id:id}, { $set:{validacion:true, role:'psicologo'}})
    return res.status(200).json({ succes: true, mensaje: 'El psicologo ha sido validado con exito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la cita ' });
    }  
  }
  
//--------------------------------------------------------------------------------------------------------------------------------
//Login  admin 

export const loginAdmin= async (req, res)=> {
 
  
    const  {email, password} = req.body;

    
    try{
        const administrador = await Administrador.findOne({email:email})//.select(' profile password name email role')
        
        
    if(!administrador){
          return res.status(200).json({success: false, error: 'Usuario no encontrado'})
        }
  
        const checkPassword= bcrypt.compareSync(password, administrador.password)
        console.log(checkPassword)
  
      
        if(checkPassword){
          const tokensSession =await tokenSing(administrador);
          
          const serialized = await serializedToken(tokensSession); // crea la cookie con el jwt dentro 
         // res.set('Access-Control-Allow-Credentials', 'true'); 
          //res.set('Access-Control-Allow-Origin', 'http://localhost:5000');
          res.setHeader('set-cookie', serialized); 
  
          return res.status(200).json({success: true,  administrador })
        }
        else {
          return   res.status(200).json({success: false, error: 'Usuario o contraseña incorrectos'})
        }
    }
    catch{
        return res.status(500).json({success: false, error: 'error, intente de nuevo'})
    }
  }
  
  //logout

export const logoutAd = async (req, res) => {

  try{
    res.clearCookie('userToken');
    //res.send('Cookie eliminada');
    return res.status(200).json({success: true, request: 'Cierre de sesión exitoso'})

  }catch{

    return res.status(500).json({success: false, error: 'error, intente de nuevo'})
  }
}



