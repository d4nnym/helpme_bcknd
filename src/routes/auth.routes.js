import {loginCtr, loginCtrEmail} from  "../controllers/auth.controllers.js"
import {Router} from "express"

const router = Router();

router.post("/login",  loginCtr)
router.post("/login2", loginCtrEmail)



export default router;
