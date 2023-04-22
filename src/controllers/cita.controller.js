/*//import { Collection } from "mongoose";
import Citas from "../models/citas.js";
import Psicologo from "../models/paciente.js"

export const crearCitaParaPsicologo = async (req, res) => {
    const { psicologo, date, start_time  } = req.body;
    //console.log(req.body)
    
    // Verificar si el psicólogo tiene menos de 2 citas programadas para la fecha especificada
    const citasDelDia = await Citas.find({ psicologo, date: { $eq: date } });
    if (citasDelDia.length >= 2) {
      return res.status(400).json({ mensaje: 'El psicólogo ya tiene 2 citas programadas para este día' });
    }
    //verificar si el psicologo tiene a esa hora disponible
    const disponible = await Psicologo
    // Crear la nueva cita
    const cita = new Citas({
      psicologo,
      fecha
    });
    await cita.save();
    
    res.status(201).json({ mensaje: 'Cita creada exitosamente' });
};

export const verificarDisponibilidad= async (req, res)=> {

    const {id, date}=req.body

    hour='9:00'
    h=new Date(); 
    h.setHours(hour.chartAt(0))
    console.log(h)

   // const cita=await db.Collection('citas').findOne({})

}*/