const express = require("express");
const mongoose = require("mongoose");

// Variables de desarrollo
require("dotenv").config({ path: "variables.env" });

// Cors permite que un cliente se conecte a un servidor para el intercambio de recursos
const cors = require("cors");

// Conectar la DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
mongoose.connection.on("error", error => {
  console.log(error);
});

// Crear el servidor
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Definir un dominio(s) para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    // Revisar si la petición viene de un servidor que está en la whitelist
    const existe = whitelist.some( dominio => dominio === origin);
    
    if(existe) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'), false)
    }
  }
}
// Cors
app.use(cors(corsOptions));

// Routes
const routes = require("./routes");
app.use("/", routes());

// Carpeta pública
app.use(express.static("uploads"));

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// Iniciar App
app.listen(port, host, () => {
  console.log("Todo fino");
});
