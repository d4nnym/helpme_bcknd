import app from "./app.js"
import "./database.js"

app.listen(
  app.get("port"),
  ()=>console.log(`Servidor activo en el puerto ${app.get("port")}`)
);

