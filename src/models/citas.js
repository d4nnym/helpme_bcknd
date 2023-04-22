import {Schema, model, mongoose} from 'mongoose'
import { boolean } from 'yup';


const citaSchema = Schema({
    psicologo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Psicologo',
      
    },
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paciente',
    },
    emailPaciente:{type:String},

    date: {
      type: String,
    },
    start_time: {
      type: String,
    },
    end_time:{
        type:Date,
    },
    duracion: {
      type: Number,
      defaul: 60,
    },
    realizada: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String
    },
    disponible:{
        type: Boolean,
        default: true
    },
  },{
    versionKey: false,
    timestamps: true,
});

//end ti,e
  citaSchema.pre('save', function(next) {
    if (this.start_time && this.duracion) {
      this.end_time = new Date(this.start_time.getTime() + this.duracion * 60000);
    }
    next();
  });
  
  export default model("cita", citaSchema);