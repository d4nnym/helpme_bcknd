import { createPsycho, getPsycho,getPsychoByProfile,getProfe,deletePsychoById,deletePsychoByProfile, 
    updatePsychoById ,getPsychoById,getPsychoValidados,getPsychoNoValidados, getPerfil,getPerfilId, loginPsicologo} 
    from '../controllers/psicologo.controller.js'
import { authMiddlewarePsi } from "../middlewares/sessionPsicologo.js";
import { checkRol } from "../middlewares/verifyRol.js";
import {Router} from 'express'

const router= Router()

//no autenticadas
router.post('/psicologo/sigin', createPsycho);
router.post("/psicologo/login",  loginPsicologo)

//Autenticadas por rol psicologo
router.get('/psicologo', authMiddlewarePsi, checkRol(["psicologo"]), getPsycho);
router.get('/psicologo/:id', authMiddlewarePsi, checkRol(["psicologo"]), getPsychoById);
router.get('/psicologo/buscar/:profile', authMiddlewarePsi, checkRol(["psicologo"]), getPsychoByProfile);
router.get('/psicologo/profession/:profile',authMiddlewarePsi, checkRol(["psicologo"]), getProfe )
router.get('/psicologo/perfil/:profile',authMiddlewarePsi, checkRol(["psicologo"]), getPerfil)
router.get('/psicologo/perfilid/:id', authMiddlewarePsi, checkRol(["psicologo"]), getPerfilId)
router.put('/psicologo/:id',authMiddlewarePsi, checkRol(["psicologo"]), updatePsychoById) 


//autenticadas por rol admin
router.delete('/psicologo/dele/:id', authMiddlewarePsi, checkRol(["admin"]), deletePsychoById);
router.delete('/psicologo/dele/:profile', authMiddlewarePsi, checkRol(["admin"]), deletePsychoByProfile)
router.get('/psicologo-validados',authMiddlewarePsi, checkRol(["admin"]), getPsychoValidados)
router.get('/psicologo-novalidados',authMiddlewarePsi, checkRol(["admin"]), getPsychoNoValidados)




//login


export default router;