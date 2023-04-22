import {Schema, model} from 'mongoose'
import {differenceInYears }  from 'date-fns'
import bcrypt from 'bcrypt'
const saltRounds = 10;


//schema profession
const  profeSchema = Schema({
    profile: {type: String},
    age: {type: Number},
    description:{type: String},
    keywords: {type: String},
    picture: {type: String},
    complete: {type: Boolean,
                default: false},
    location: {
      country: String,
      region: String,
      city: String
    }
});

//schema psychologo
const  psychoSchema = Schema({
    profile: {type: String, required: true, unique: true, maxilength:12 ,
              validate: {
                validator: function(v) {
                  return /^[a-zA-Z0-9]{1,12}$/.test(v);
                  //expresion regular: solo permita nombres con letrasmayusculas
                  //minusculas y numeros  y que no sea mayor a 12 carcateres
                },
                message: props => `${props.value} no es un código válido!`
              } },
    email: {type: String,required: true,unique: true,email: true ,
            validate: {
                validator: function(v) {
                  return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
                  //expresion regular: es de complegidad media
                },
                message: props => `${props.value} no es un correo electrónico válido!`
              }  },
    password:{type: String, required: true ,
      validate: {
        validator: function(v) {
          return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
          //  Esta expresión regular utiliza dos "lookaheads" para verificar que la cadena
          //  contenga al menos una letra mayúscula ((?=.*[A-Z])) y al menos un número ((?=.*\d)),
          //  *y luego verifica que la cadena esté formada por caracteres alfanuméricos ([A-Za-z\d])
          //  * con una longitud mínima de 8 caracteres ({8,}).
        },
        message: props => `${props.value} no es una contraseña válida!`
      }
    },
    name: {type: String, required: true,
          validate: {
              validator: function(v) {
                return /^[A-Za-záéíóúñÑ\s'-]+ [A-Za-záéíóúñÑ\s'-]+$/.test(v);
                //expresion regular: permite d nombres separado  por un espacio, que solo contenga de
                //letras mayusculas minusculas no numeros ni signos
              },
              message: props => `${props.value} no es un nombre válido!`
            }
    },
    lastname: {type: String, required: true,
      validate: {
        validator: function(v) {
          return /^[A-Za-záéíóúñÑ\s'-]+ [A-Za-záéíóúñÑ\s'-]+$/.test(v);
          //expresion regular: permite dos apellidos separado  por un espacio, que solo contenga 
          //letras mayisculas minuscula no numero
        },
        message: props => `${props.value} no es un nombre válido!`
        }
    },
    birthday: {type: String, required: true,
              validate: {
                validator: function(v) {
                  const dateB= new Date(v)
                  const age = differenceInYears(new Date(), dateB);
                  return age >= 18;
                },
                message: props => 'Debe tener al menos 18 años para registrarse'
              } },
    role:{type: String, default: 'paciente'},
    age:{type: Number},
    validacion:{type: Boolean, default: false},
    profession: profeSchema,   
},{
    versionKey: false,
    timestamps: true,
});


/*funcion pre-guaradado utiliza en metodo save
  uso: Antes que  se garden los datos en la bd
       extrae la fecha nacimmiento  deriva el 
       campo para crear el campo age
*/
psychoSchema.pre('save', function(next){
    const today = new Date();
    const birthday = new Date(this.birthday)
    const age= differenceInYears(today,birthday)
    this.age = age;

   const profile= this.profile
   this.profession.age = age
   this.profession.profile =profile
    
    next();
});
/*
const saltRounds=10
*/
psychoSchema.pre('save', function(next){
  const document= this;
  

  if (document.isNew || document.isModified('password')) {
    console.log('paso1')
    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.log('paso2')
        next(err);
      } else {
        document.password = hashedPassword;
        next();
        console.log('paso3')
      }
    });
  } else {
    console.log('paso4')
    next();
  }
});




export default  model("Psicologo", psychoSchema);

