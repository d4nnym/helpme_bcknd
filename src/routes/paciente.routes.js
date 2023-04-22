import {
  buscarPaciente,
  getPerfilId,
  loginPaciente,
  actualizarPaciente,
  crearPaciente,
  eliminarPaciente,
  obtenerPacientes,
  agendarCita,
  getCitaDisponibles
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
  checkRol(["admin"]),
  obtenerPacientes
); // ruta autenticada con jwt y permisos de usuario segun el rol

router.get(
  "/paciente/:id",
  authMiddleware,
  checkRol(["admin"]),
  buscarPaciente
);
router.delete("/paciente/eliminar/:id", authMiddleware,
checkRol(["admin"]), eliminarPaciente, );
router.put("/paciente/:id", authMiddleware,
checkRol(["admin"]), actualizarPaciente);
router.get("/paciente/profile/:id", authMiddleware,
checkRol(["admin"]), getPerfilId);
router.put("/paciente/cita/agendarCita/", agendarCita);

router.get("/paciente/citas/disponibles", getCitaDisponibles);


export default router;
