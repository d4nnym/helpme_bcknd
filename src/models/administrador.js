import { Schema, model } from "mongoose";
import bcrypt, { compareSync } from "bcrypt";

const saltRounds = 10;

const administradorSchema = Schema({
  
  profile: {type: String},
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-záéíóúñÑ\s'-]+ [A-Za-záéíóúñÑ\s'-]+$/.test(v);
        //expresion regular: permite d nombres separado  por un espacio, que solo contenga de
        //letras mayusculas minusculas no numeros ni signos
      },
      message: (props) => `${props.value} no es un nombre válido!`,
    },
  },
  email: {
    type: String,
    required: true,
    email: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        //expresion regular: es de complegidad media
      },
      message: (props) =>
        `${props.value} no es un correo electrónico válido!`,
    },
  }, //unique y email
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
        //  Esta expresión regular utiliza dos "lookaheads" para verificar que la cadena
        //  contenga al menos una letra mayúscula ((?=.*[A-Z])) y al menos un número ((?=.*\d)),
        //  *y luego verifica que la cadena esté formada por caracteres alfanuméricos ([A-Za-z\d])
        //  * con una longitud mínima de 8 caracteres ({8,}).
      },
      message: (props) => `${props.value} no es una contraseña válida!`,
    },
  },
  role: {type:String, default:"admin"},

},{
    versionKey: false,            
    timestamps: true,             
});

//Funcion hashear la contraseña

administradorSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});


export default model("Administrador", administradorSchema);