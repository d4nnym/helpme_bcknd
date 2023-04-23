import {
  buscarPaciente,
  getPerfilId,
  loginPaciente,
  actualizarPaciente,
  crearPaciente,
  eliminarPaciente,
  obtenerPacientes,
  agendarCita,
  getCitaDisponibles,
  eliminarCitaPaciente,
  historialCitasPaciente,
  logoutPa
} from "../controllers/paciente.controllers.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/session.js";
import { checkRol } from "../middlewares/verifyRol.js";

const router = Router();


//sin autenticación 
router.post("/paciente", crearPaciente);
router.post("/paciente/login",  loginPaciente)


//autenticadas 

router.get(
  "/paciente/obtenerTodos",
  authMiddleware,
  checkRol(["psicologo"]),
  obtenerPacientes
); // ruta autenticada con jwt y permisos de usuario segun el rol

router.get(
  "/paciente/:id",
  authMiddleware,
  checkRol(["admin"]),
  buscarPaciente
);
router.delete("/paciente/eliminar/:id", authMiddleware,
checkRol(["psicologo"]), eliminarPaciente, );
router.put("/paciente/:id", authMiddleware,
checkRol(["paciente"]), actualizarPaciente);

// Rutas adnmin 

router.get("/paciente/profile/:id", authMiddleware,
checkRol(["paciente"]), getPerfilId);
router.put("/paciente/cita/agendarCita/", authMiddleware, checkRol(["paciente"]), agendarCita);
router.put("/paciente/cita/agendarCita2/", authMiddleware, checkRol(["paciente"]), agendarCita);
router.get("/paciente/cita/citasDisponibles", authMiddleware, checkRol(["paciente"]), getCitaDisponibles);
router.delete("/paciente/cita/eliminarCita", authMiddleware, checkRol(["paciente"]), eliminarCitaPaciente);
router.get('/paciente/cita/historialCitas/:id', authMiddleware, checkRol(["paciente"]), historialCitasPaciente )
router.post('/paciente/logout', logoutPa )



export default router;
