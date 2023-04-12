import { createPsycho, getPsycho,getPsychoByProfile,getProfe,deletePsychoById,deletePsychoByProfile, 
    updatePsychoById ,getPsychoById,getPsychoValidados,getPsychoNoValidados, getPerfil,getPerfilId, loginPsicologo} 
    from '../controllers/psicologo.controller.js'
import { authMiddlewarePsi } from "../middlewares/sessionPsicologo.js";
import { checkRol } from "../middlewares/verifyRol.js";
import {Router} from 'express'

const router= Router()

router.post('/psicologo/sigin', createPsycho);

router.get('/psicologo', authMiddlewarePsi, checkRol(["paciente"]), getPsycho);
router.get('/psicologo/:id', getPsychoById)
router.get('/psicologo/buscar/:profile', getPsychoByProfile);
router.get('/psicologo/profession/:profile',getProfe )

router.get('/psicologo-validados',getPsychoValidados)
router.get('/psicologo-novalidados',getPsychoNoValidados)

router.get('/psicologo/perfil/:profile', getPerfil)
router.get('/psicologo/perfilid/:id', getPerfilId)

router.delete('/psicologo/dele/:id', deletePsychoById);
router.delete('/psicologo/dele/:profile',  deletePsychoByProfile)


router.put('/psicologo/:id', updatePsychoById) 


//login
router.post("/psicologo/login",  loginPsicologo)

export default router;