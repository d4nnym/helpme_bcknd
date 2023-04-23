import { createPsycho, getPsycho,getPsychoByProfile,getProfe,deletePsychoById,deletePsychoByProfile, 
    updatePsychoById ,getPsychoById,getPsychoValidados,getPsychoNoValidados, 
    getPerfil,getPerfilId, loginPsicologo, crearCitaParaPsicologo, estadoCita, historialCitasAntiguas, 
    updateCitasId, eliminarCitaPsicologo, getRealizadaFalse, logoutPs} 
    from '../controllers/psicologo.controller.js'   
import { authMiddlewarePsi } from "../middlewares/sessionPsicologo.js";
import { authMiddlewareAd } from "../middlewares/sessionAdmin.js";
import { checkRol } from "../middlewares/verifyRol.js";
import {Router} from 'express'


const router= Router()

//no autenticadas
router.post('/psicologo/sigin', createPsycho);
router.post("/psicologo/login",  loginPsicologo)

//Autenticadas por rol psicologo
router.get('/psicologo/get', authMiddlewarePsi, checkRol(["admin"]), getPsycho);
router.get('/psicologo/:id', authMiddlewarePsi, checkRol(["admin"]), getPsychoById);
router.get('/psicologo/buscar/:profile', authMiddlewarePsi, checkRol(["admin"]), getPsychoByProfile);
router.get('/psicologo/profession/:profile',authMiddlewarePsi, checkRol(["psicologo"]), getProfe )
router.get('/psicologo/perfil/:profile',authMiddlewarePsi, checkRol(["psicologo"]), getPerfil)
router.get('/psicologo/perfilid/:id', authMiddlewarePsi, checkRol(["psicologo"]), getPerfilId)
router.put('/psicologo/:id',authMiddlewarePsi, checkRol(["psicologo"]), updatePsychoById) 


//autenticadas por rol admin
router.delete('/psicologo/dele/:id', authMiddlewarePsi, checkRol(["admin"]), deletePsychoById);
router.delete('/psicologo/dele/:profile', authMiddlewarePsi, checkRol(["admin"]), deletePsychoByProfile)
router.get('/psicologo-validados',authMiddlewareAd, checkRol(["admin"]), getPsychoValidados)
router.get('/psicologo-novalidados',authMiddlewarePsi, checkRol(["admin"]), getPsychoNoValidados)
router.post('/crearCitas',authMiddlewarePsi, checkRol(["admin"]), getPsychoNoValidados)
//
router.post('/psicologo/crearcitas', authMiddlewarePsi, checkRol(["psicologo"]), crearCitaParaPsicologo );
router.post('/psicologo/cita/validarEstadoCita', authMiddlewarePsi, checkRol(["psicologo"]), estadoCita ); 
router.get('/psicologo/cita/historialPsicologo/:id', authMiddlewarePsi, checkRol(["psicologo"]), historialCitasAntiguas )
router.get('/psicologo/cita/update/', authMiddlewarePsi, checkRol(["psicologo"]), updateCitasId ) 
router.get('/psicologo/citas/pendientes/', authMiddlewarePsi, checkRol(["psicologo"]), getRealizadaFalse )
router.delete("/psicologo/cita/eliminarCita",  authMiddlewarePsi, checkRol(["psicologo"]), eliminarCitaPsicologo);
router.post('/psicologo/logout', logoutPs )
//login

export default router;