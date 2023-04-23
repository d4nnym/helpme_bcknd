import mongoose from 'mongoose';
import Psicologo from '../models/psicologo.js'
import {tokenSing} from  "../helpers/generateTokens.js"
import bcrypt from "bcrypt";
import { serializedToken } from "../helpers/setCookie.js";
import Citas from "../models/citas.js";
import psicologo from '../models/psicologo.js';


export const loginPsicologo= async (req, res)=> {
    
  const  {email, password} = req.body;
  console.log(email)

  try{
      const psicologo = await Psicologo.findOne({email:email}).select(' profile password name email role')
     

  if(!psicologo){
        return res.status(200).json({success: false, error: 'Usuario no encontrado'})
      }

      const checkPassword= bcrypt.compareSync(password, psicologo.password)
      if(checkPassword){
        const tokensSession =await tokenSing(psicologo)
        const serialized = await serializedToken(tokensSession); // crea la cookie con el jwt dentro 
        res.setHeader('set-Cookie', serialized); 

        return res.status(200).json({success: true, psicologo })
      }
      else {
        return   res.status(200).json({success: false, error: 'Usuario o contraseña incorrectos'})
      }
  }
  catch{
      return res.status(500).json({success: false, error: 'error, intente de nuevo'})
  }

}

//function create psicologo
export const createPsycho = async (req, res) => {
  const psico = new Psicologo(req.body);
  console.log(req.body)
  try {
    await psico.save();
    res.status(200).json({success: true, request: "Se creó correctamente"});
  } catch (error) {
    console.log(error)
    res.status(200).json({success: false, error:"Data incorrecta"})
  }
};


//function  get  psicologo

export const getPsycho = async (req, res) => {
  try {
    const psico = await Psicologo.find();
    if (psico.length === 0) {
      res.status(500).json({success: false, request: 'No se encontraron psicólogos en la base de datos' });
    }
    return res.json({succes: true,  request: 'Se obtuvieron todos los psicólogos con éxito', psicologos: psico });
  } catch (error) {

    return res.status(200).json({success: false, error:"Data incorrecta"})
  }
}


//obtener psicologo por ID
export const getPsychoById = async (req, res)=>{
  const{id}=req.body;

  Psicologo.findById(id)
  .then((content)=>{
    if(!content){
      return res.status(200).json({success: false, error:"El psicólogo no ha sido encontrado"})
    }
      
    return res.status(200).json({success: true, content});
  })
  .catch((error)=>{
    console.error(error);
    return  res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  })
};

//obtener psicólogo por nombre profile
export const getPsychoByProfile = async (req, res) => {
  const { profile } = req.body;
  try {
    const psico = await Psicologo.findOne({ profile });
    if (!psico) {
      return res.status(200).json({success: false, request: "No se encontró el psicólogo con el perfil proporcionado" });
    }
    return res.status(200).json({success: true, request: "Se encontró el psicólogo con éxito",  psico  });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ succes: false,  request: "Error al obtener el psicólogo functionprofileProffession", error: error.message });
  }
};

//obtener info psicolo por profile

export const getProfe= async (req, res) => {
  const { profile } = req.body;
  console.log(profile)
  try {
    const psico = await Psicologo.findOne( {profile} );
    if (!psico) {
      return res.status(200).json({success: false, request: "No se encontró el psicólogo con el perfil proporcionado " });
    }
    return res.status(200).json({success: true, request: "Se encontró la profession del psicólogo con éxito",  psico: { profession: psico.profession }  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ succes: false,  request: "Error al obtener el psicólogo functionprofileProffession", error: error.message });
  }
};

//obtener infomacion perfil psicologo por profile
export const getPerfil= async (req, res) => {
  const { profile } = req.body;
  try {
    const psico = await Psicologo.findOne( {profile} ).select( 
      'profile email name lastname profession.picture profession.location.country profession.location.region profession.location.city')
    
    if (!psico) {
      return res.status(404).json({ message: "No se encontró el psicólogo con el perfil proporcionado profile" });
    }
    return res.json({ message: "Se encontró la profession del psicólogo con éxito",  psico  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el psicólogo functionprofileProffession", error: error.message });
  }
};

//obtener informacion perfil psicologo por id
export const getPerfilId = async (req, res)=>{
  const{id}=req.body;

  Psicologo.findById(id).select( 'profile email name lastname profession.picture profession.location.country profession.location.region profession.location.city')
  .then((content)=>{
    if(!content){
      return res.json({error:"El psicólogo no ha sido encontrado IDs"})
    }
      
    return res.json(content)
  })
  .catch((error)=>{
    console.error(error);
    res.status(500).json({success: false, error: 'Error, intente de nuevo'})
  })
};


//function delete psychologist for id
export const deletePsychoById = async (req, res) => {
  try {
    const { id } = req.body;
    const psico = await Psicologo.findByIdAndDelete(id);
    if (!psico) {
      return res.status(404).json({ message: "No se encontró el psicólogo con el id proporcionado" });
    }
    return res.json({ message: "El psicólogo ha sido eliminado con éxito", psico });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el psicólogo", error: error.message });
  }
  };

//function delete psychologist for profile
export const deletePsychoByProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    const deletedPsycho = await Psicologo.findOneAndDelete({ profile });
  if (!deletedPsycho) {
    return res.status(200).json({ succes: false,  request: "No se encontró el psicólogo con el perfil proporcionado" });
  }
  return res.status(200).json({succes: true,  request: "Se eliminó el psicólogo con éxito", deletedPsycho });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ succes: false,  request: "Error al eliminar el psicólogo", error: error.message });
  }
};


//function update psychologist for id
export const updatePsychoById = async (req, res) => {
  try {
    const { id } = req.body;
    const update = req.body;
    const options = { new: true }; // Devuelve el documento actualizado
    const psico = await Psicologo.findByIdAndUpdate( id,  update, options);
    if (!psico) {
      return res.status(200).json({ succes: false, request: "No se encontró el psicólogo con el id proporcionado" });
    }
    return res.status(200).json({success: true, request: "El psicólogo se actualizó con éxito", psico });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, request: "Error al actualizar el psicólogo", error: error.message });
  }
};


// estos son de administrador 

//obtener los psicologos validados
export const getPsychoValidados = async (req, res) => {
  try {
    const psico = await Psicologo.find({validacion: true});
    if (psico.length === 0) {
      return res.status(200).json({ succes: false, request:  'No se encontraron psicólogos en la base de dato4s' });
    }
    return res.status(200).json({ succes: true, request: 'Se obtuvieron todos los psicólogos validados con éxito4', psicologos: psico });
  } catch (error) {
    return res.status(500).json({ success: true, request: 'Hubo un error al obtener los psicólogos4', error: error });
  }
}

//obtener los psicologos no validados
export const getPsychoNoValidados = async (req, res) => {
  try {
    const psico = await Psicologo.find({validacion: false});
    if (psico.length === 0) {
      return res.status(200).json({ succes: false, request:  'No se encontraron psicólogos en la base de dato4s' });
    }
    return res.status(200).json({ succes: true, request: 'Se obtuvieron todos los psicólogos validados con éxito4', psicologos: psico });
  } catch (error) {
    return res.status(500).json({ success: true, request: 'Hubo un error al obtener los psicólogos4', error: error });
  }
}


// login paciente email


export const crearCitaParaPsicologo = async (req, res) => {

  const { date, start_time, emailPsicologo} = req.body;
  const psicologo = await Psicologo.findOne({email:emailPsicologo}).select('_id')
  console.log(psicologo)
  
  try {
    // Verificar si el psicólogo tiene menos de 2 citas programadas para la fecha especificada
    
    const citasDelDia = await Citas.find({ psicologo, date: { $eq: date } });
    if (citasDelDia.length >= 2) {
      return res.status(400).json({ mensaje: 'El psicólogo ya tiene 2 citas programadas para este día' });
    }

    //console.log(req.body ,' segunda vez');
    const psico = req.body.psicologo
    // Verificar si el psicólogo ya tiene una cita a esa hora
    const citaExistente = await Citas.findOne({ psicologo, start_time, date});
    if (citaExistente) {
      return res.status(400).json({ mensaje: 'El psicólogo ya tiene una cita programada a esa hora' });
    }
    // Crear la nueva cita
    const cita = new Citas({
      psicologo,
      emailPsicologo,
      date,
      start_time,
  
    });
    await cita.save();

    res.status(201).json({ mensaje: 'Cita creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la cita' });
  }
};

export const logoutPs = async (req, res) => {

  try{
    res.clearCookie('userToken');
    //res.send('Cookie eliminada');
    return res.status(200).json({success: true, request: 'Cierre de sesión exitoso'})

  }catch{

    return res.status(500).json({success: false, error: 'error, intente de nuevo'})
  }
}





//Función para validar el estado de una cita, cambia el estado de la variable "realizada" de false
export const estadoCita = async (req, res) => {

  const { idCita } = req.body;
  const citaExistente = await Citas.findById(idCita);

  try {

  
    if (!citaExistente) {
      return res.status(400).json({ mensaje: 'La cita que estas buscando no existe' });
    }

    const cita = await Citas.findByIdAndUpdate({_id:idCita}, { $set:{realizada:true}});
    return res.status(400).json({ mensaje: 'Cita realizada' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear la cita ' });
    }
}

export const historialCitasAntiguas = async (req, res) => {

  const {id}=req.params 
  const psicologo= await Psicologo.findById(id).select('email')
  console.log(psicologo)
  

  const cita = await Citas.find({psicologo, realizada: true});
  
  try {
      

      if (cita.length === 0) {
        return res.status(200).json({ succes: false, request:  'No se tiene historial de citas' });
      }
      return res.status(200).json({ succes: true, request: 'Este es el historial de citas', citas: cita });
   } catch (error) {
        return res.status(500).json({ success: true, request: 'Hubo un error al obtener las citas', error: error });
  }
}

//traer todas la citas  campo realizada en false
export const getRealizadaFalse = async (req, res) => {
  const {psicologo} = req.body;
    console.log(req.body)

  try {
    const citarealizada = await Citas.find({psicologo, realizada: false});
    if (citarealizada.length === 0) {
      return res.status(200).json({ succes: false, request:  'No se encontraron cita en la base de dat0s' });
    }
    return res.status(200).json({ succes: true, request: 'Se obtuvieron todos loscitas realizada: false con éxito4', citas: citarealizada });
  } catch (error) {
    return res.status(500).json({ success: true, request: 'Hubo un error al obtener los cit4as', error: error });
  }
}
 //update cita
 //function update psychologist for id

export const updateCitasId = async (req, res) => {
  try {
    const { id } = req.body;
    const update = req.body;
    const options = { new: true }; // Devuelve el documento actualizado
    const citau = await Citas.findByIdAndUpdate( id,  update, options);

    if (!citau) {
      return res.status(200).json({ succes: false, request: "No se encontró la cita con el id proporcionado" });
    }
    return res.status(200).json({success: true, request: "la cita se actualizó con éxito", citau });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, request: "Error al actualizar la ciata", error: error.message });
  }
};

//ELIMINA UNA CITA 

export const eliminarCitaPsicologo = async (req, res)=>{

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

//logoutPsico





