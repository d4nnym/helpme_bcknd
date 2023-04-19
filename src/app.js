import express from "express"
import morgan from "morgan"
import cors from "cors"
import {PORT} from "./config.js"
import rutasPaciente from "./routes/paciente.routes.js"
//import rutasAuth from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import rutasPsicologo from './routes/psicologo.routes.js'


// configuraciones 
const app = express();
app.set("port",PORT);
app.use(express.urlencoded({ extended: false }));//investigar esta linea

//middlewares
app.use(morgan("dev"));

app.use(cookieParser());
app.use(cors({ 
    
  origin: "http://localhost:5000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
    
  }));

//routes 
app.use(rutasPaciente);
//app.use('/user', rutasAuth); 
app.use(rutasPsicologo);


// exports

export default app; 