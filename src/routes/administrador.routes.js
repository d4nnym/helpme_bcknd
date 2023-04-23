import {
    crearAdministrador,
    buscarAdministradores,
    buscarAdministrador,
    eliminarAdministrador,
    actualizarAdministrador,
    psicoNoValidados,
    psicoValidados,
    validarPsicologo,
    loginAdmin,
    logoutAd
} 
    from  "../controllers/administrador.controllers.js"

import {Router} from "express"
import { authMiddlewareAd } from "../middlewares/sessionAdmin.js";
import { checkRol } from "../middlewares/verifyRol.js";



const router = Router();

router.post("/administrador/createAdmin",crearAdministrador);
router.get("/administrador/get", authMiddlewareAd, checkRol(["admin"]), buscarAdministradores);
router.get("/administrador/getAdmin/:id", authMiddlewareAd, checkRol(["admin"]), buscarAdministrador);
router.delete("/administrador/deleteAdmin/:id",  authMiddlewareAd, checkRol(["admin"]), eliminarAdministrador);
router.put("/administrador/update/:id",  authMiddlewareAd, checkRol(["admin"]), actualizarAdministrador);
router.get("/administrador/getNoValidated", authMiddlewareAd, checkRol(["admin"]),  psicoNoValidados);
router.get("/administrador/getValidated",  authMiddlewareAd, checkRol(["admin"]), psicoValidados);
router.get("/administrador/psychoValidator",  authMiddlewareAd, checkRol(["admin"]), validarPsicologo)
router.post("/administrador/login", loginAdmin)
router.post('/administrador/logout', logoutAd )

export default router;