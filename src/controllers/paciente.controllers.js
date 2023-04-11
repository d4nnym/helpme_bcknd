import Paciente from  "../models/paciente.js"

//este es el cambio

// funcion crear Paciente  
export const crearPaciente = async (req,res)=>{
  try{
  const paciente = new Paciente(req.body);
  await paciente.save();
  
  res.status(500).json({success: true, request: "Se creó correctamente"});
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
   
      return res.status(200).json({success: true, content})//aquí status 200 en todas 
  })
  .catch((error)=>{
    res.status(500).json({success: false, error: 'Error, intente de nuevo owo'})
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

//----------------------------------------------------------------------------

/*//obtener infomacion perfil paciente por profile
export const getPerfil= async (req, res) => {
  const { profile } = req.body;
  try {
    const paciente = await paciente.findOne( {profile} ).select( 
      'profile email name lastname info.picture info.age info.location.country info.location.region info.location.city')
    
    if (!paciente) {
      return res.status(404).json({ message: "No se encontró el psicólogo con el perfil proporcionado profile" });
    }
    return res.json({ message: "Se encontró la profession del psicólogo con éxito",  paciente  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el psicólogo functionprofileProffession", error: error.message });
  }
};*/

//obtener informacion perfil paciente por id
//pendiente de revisar, no me funciona recibiendolo desde el body, me envia a "buscaePaciente"

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









