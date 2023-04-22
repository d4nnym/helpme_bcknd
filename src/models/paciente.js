import { Schema, model } from "mongoose";
import bcrypt, { compareSync } from "bcrypt";
import { differenceInYears } from "date-fns";

const saltRounds = 10;

const pacienteSchema = Schema(
  {
    profile: {
      type: String,
      required: true,
      maxlength: 12,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]{1,12}$/.test(v);
          //expresion regular: solo permita nombres con letrasmayusculas
          //minusculas y numeros  y que no sea mayor a 12 carcateres
        },
        message: (props) => `${props.value} no es un código válido!`,
      },
    }, //pendiente revisar estas validaciones
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
    lastname: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-záéíóúñÑ\s'-]+ [A-Za-záéíóúñÑ\s'-]+$/.test(v);
          //expresion regular: permite dos apellidos separado  por un espacio, que solo contenga
          //letras mayisculas minuscula no numero
        },
        message: (props) => `${props.value} no es un nombre válido!`,
      },
    },
    birthday: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const dateB = new Date(v);
          const age = differenceInYears(new Date(), dateB);
          return age >= 12;
        },
        message: (props) => "Debe tener al menos 18 años para registrarse",
      },
    }, //pendiente investigar
    role: { type: String, default: "paciente" },
    info: {
      age: { type: Number },
      location: {
        country: String,
        region: String,
        city: String,
        picture: String,
      },
      picture: String,
      Completed: { type: Boolean, default: false },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//Funcion hashear la contraseña
pacienteSchema.pre("save", function (next) {
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

//derivar age
pacienteSchema.pre("save", function (next) {
  const today = new Date();
  const birthday = new Date(this.birthday);
  const age = differenceInYears(today, birthday);
  this.info.age = age;
  next();
});

export default model("paciente", pacienteSchema);
