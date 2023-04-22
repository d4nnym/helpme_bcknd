import mongoose from 'mongoose';
import Psicologo from '../models/psicologo.js'
import {tokenSing} from  "../helpers/generateTokens.js"
import bcrypt from "bcrypt";
import { serializedToken } from "../helpers/setCookie.js";



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
