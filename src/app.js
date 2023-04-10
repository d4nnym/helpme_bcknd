import express from "express"
import morgan from "morgan"
import cors from "cors"
import {PORT} from "./config.js"
import rutasPaciente from "./routes/paciente.routes.js"
import rutasAuth from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"


// configuraciones 
const app = express();
app.set("port",PORT);
app.use(express.urlencoded({ extended: false }));//investigar esta linea

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

//routes 
app.use(rutasPaciente);
app.use('/user', rutasAuth); 


// exports

export default app; 