import {buscarPaciente, getPerfilId , actualizarPaciente, crearPaciente, eliminarPaciente, obtenerPacientes}
from  "../controllers/paciente.controllers.js"
import {Router} from "express"
import { authMiddleware } from "../middlewares/session.js";
import { checkRol } from "../middlewares/verifyRol.js";


const router = Router();

router.post("/paciente",crearPaciente);
router.get("/paciente/obtenerTodos", authMiddleware, checkRol(['paciente']), obtenerPacientes); // ruta autenticada con jwt y permisos de usuario segun el rol
router.get("/paciente/:id", authMiddleware, checkRol(['psicolo']), buscarPaciente);
router.delete("/paciente/eliminar/:id", eliminarPaciente);
router.put("/paciente/:id", actualizarPaciente);
router.get("/paciente/profile/:id", getPerfilId);

export default router;
