import Paciente from  "../models/paciente.js"
import {tokenSing} from  "../helpers/generateTokens.js"
import bcrypt from "bcrypt";
import { serializedToken } from "../helpers/setCookie.js";
import { salir } from "../helpers/setCookie.js";
import Citas from "../models/citas.js";
import { serialize } from "cookie";



//este es el cambio

// funcion crear Paciente  
export const crearPaciente = async (req,res)=>{
  try{
  const paciente = new Paciente(req.body);
  await paciente.save();
  
  res.status(200).json({success: true, request: "Se creó correctamente"});
  }
  catch{
    res.status(200).json({success: false, error:"Data incorrecta"})
  }
}


// funcion obtener todos pacientes
export const obtenerPacientes = async(req,res)=>{
 
  try{
  const paciente = await Paciente.find()
  res.status(200).json({success: true, paciente});
  }catch{
    res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  }
}


//obtener paciente -- probar solo con ids validos pero que no esten en la bd porque de lo contrario revienta 
//642541e5544532ac39e4031f ya no está 
//si no es un hexadecimal nos arriesgamos a que nos bote el server 

export const buscarPaciente = async (req, res)=>{
  const{id}=req.params;
  
  Paciente.findById(id)
  .then((content)=>{
    
    if(!content){
      return res.status(200).json({success: false, error:"El paciente no ha sido encontrado"})}//todo lo que no necesitamos es false y lo que ncesitamos es true
   
      return res.status(200).json({success: true, content})
  })
  .catch((error)=>{
    res.status(500).json({success: false, error: 'Error, intente de nuevo owo buscar Paciente'})
  })
}

//Eliminar paciente

export const eliminarPaciente = async (req, res)=>{

  const{id}=req.params;

  Paciente.findByIdAndDelete(id).then((content)=>{
    
    if(content)
    return res.status(200).json({success: true, request: `El paciente ${id} ha sido eliminado`})

    if(!content)
    return res.status(200).json({success: false, error:"El paciente no ha sido encontrado"})
  })
  .catch((error)=>{
    res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  })
}

//Actualizar paciente 


export const actualizarPaciente = async (req,res)=>{
  const {id} = req.params;
  console.log({id}); 
  try {
    const paciente = await Paciente.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
    Paciente.findById(id).then((content)=>{

      if(content){
        return  res.status(200).json({success: true,  request: `El paciente con id: ${id}  se actualizó correctamente`});}
      if(!content){
        return  res.status(200).json({success:false, request: "El paciente que desea actualizar no existe"});}
      }).catch((error)=>{
        console.error(error);
        return res.status(500).json({success: false, error: 'Error, intente de nuevo'})
      })
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  }    
}

//-------------------------------------------------------------------------------------------------------

export const getPerfilId = async (req, res)=>{
  const{id}=req.params;

  const paciente = await
  Paciente.findById(id).select('profile email name lastname info.picture info.age info.location.country info.location.region info.location.city')
  .then((content)=>{
    if(!content){
      return res.status(200).json({success: false, error:"El paciente no ha sido encontrado ID"})
    }  
    return res.status(200).json({ success: true, content});
  })
  .catch((error)=>{
    return  res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  })
}
// login paciente email

export const loginPaciente= async (req, res)=> {
 
  
  const  {email, password} = req.body;
  

  try{
      const paciente = await Paciente.findOne({email:email})//.select(' profile password name email role')
      console.log(paciente)

  if(!paciente){
        return res.status(200).json({success: false, error: 'Usuario no encontrado'})
      }

      const checkPassword= bcrypt.compareSync(password, paciente.password)

    
      if(checkPassword){
        const tokensSession =await tokenSing(paciente);
        
        const serialized = await serializedToken(tokensSession); // crea la cookie con el jwt dentro 
       // res.set('Access-Control-Allow-Credentials', 'true'); 
        //res.set('Access-Control-Allow-Origin', 'http://localhost:5000');
        res.setHeader('set-cookie', serialized); 

        return res.status(200).json({success: true,  paciente })
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

export const logoutPa = async (req, res) => {

  try{
    res.clearCookie('userToken');
    //res.send('Cookie eliminada');
    return res.status(200).json({success: true, request: 'Cierre de sesión exitoso'})

  }catch{

    return res.status(500).json({success: false, error: 'error, intente de nuevo'})
  }
}



//-------------------------------------------------------------------------------------------------------

//GUARDA UNA CITA CAMBIANDO EL ESTADO DE DISPONIBLE DE TRUE A FALSE, ADEMAS AGREGA LOS DATOS DEL PACIENTE AL ESQUEMA DE LA CITA

export const agendarCita = async (req, res) => {

  const { profilePsicologo, profilePaciente, email,  date, idCita } = req.body;
  const {id}=req.params

  //const paciente = await Paciente.findOne({profilePaciente:Paciente.profile}).select('_id')
  const paciente = await Paciente.findOne({email:email}).select('_id')
  
  try {
    //validar que kla cita exista o no 

    const citaExistente = await Citas.findOne({ email:email, date:{ $eq: date }}).select('idCita date start_time');
    
    if (citaExistente) {
      return res.status(400).json({ succes:false, mensaje: 'Ya tiene una cita programada a esa hora', citaExistente });
    }

    const cita = await Citas.findByIdAndUpdate({_id:idCita}, { $set:{disponible:false, email:email}},{new:true});

    await Citas.findOne({ date, paciente });
    if (citaExistente) {
       return res.status(400).json({ mensaje: 'Ya tiene una cita programada para ese día 2' });
    }

    await Citas.findByIdAndUpdate({_id:idCita}, { $set:{paciente:paciente}},{new:true});
    return res.status(200).json({ succes: true, mensaje: 'La cita fue agendada con éxito' });
 
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear la cita ' });
  }
}

//Traer las citas disponibles  

export const getCitaDisponibles = async (req, res) => {

  try {
    const cita = await Citas.find({disponible: true});
    if (cita.length === 0) {
      return res.status(200).json({ succes: false, request:  'No se encontraron citas disponibles' });
    }
    return res.status(200).json({ succes: true, request: 'Estas son las citas disponibles', citas: cita });
  } catch (error) {
    return res.status(500).json({ success: true, request: 'Hubo un error al obtener las citas', error: error });
  }
}



//Elimina una cita ya existente mediante su id
export const eliminarCitaPaciente = async (req, res)=>{

  const{id}=req.body;

  await Citas.findByIdAndDelete(id).then((content)=>{
    
    if(content)
    return res.status(200).json({success: true, request: `La cita ha sido eliminada de manera exitosa`})
    if(!content)
    return res.status(200).json({success: false, error:"El cita no ha sido encontrada"})
  })
  .catch((error)=>{
    res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  })
}

//Historial de Citas 

export const historialCitasPaciente = async (req, res) => {

  const {id}=req.params 
  const paciente= await Paciente.findById(id).select('email')
  console.log(paciente)
  

  const cita = await Citas.find({paciente, realizada: true});
  
  try {
      

      if (cita.length === 0) {
        return res.status(200).json({ succes: false, request:  'No se tiene historial de citas' });
      }
      return res.status(200).json({ succes: true, request: 'Este es el historial de citas', citas: cita });
   } catch (error) {
        return res.status(500).json({ success: true, request: 'Hubo un error al obtener las citas', error: error });
  }
}







