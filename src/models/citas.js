import {Schema, model, mongoose} from 'mongoose'
import moment from 'moment';



const citaSchema = Schema({
    psicologo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Psicologo',
      
    },
    emailPsicologo:{
      type: String,
    },
    email: {
      type: String,
    },
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paciente',
    },
    date: {
      type: String,
    },
    start_time: {
      type: String,
    },
    end_time:{
        type: String,
    },
    duracion: {
      type: String,
      default:"60 min",
    },
    realizada: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default:"Ingrese notas",
    },
    disponible:{
        type: Boolean,
        default: true
    },
  },{
    versionKey: false,
    timestamps: true,
});

//end

citaSchema.pre('save', function(next) {
    const startMoment = moment(this.start_time, 'HH:mm');
    const endMoment = startMoment.add(1, 'hour');
    const endTime = endMoment.format('HH:mm');
    this.end_time = endTime;
    next();
  });

  export default model("cita", citaSchema);