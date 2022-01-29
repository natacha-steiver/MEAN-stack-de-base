const mongoose=require('mongoose') ;
var validate = require('mongoose-validator');
const Schema = mongoose.Schema;
const ObjectId =mongoose.Schema.Types.ObjectId;


let Tuto= new Schema({
_id: Schema.Types.ObjectId,

    titre: {
        type: String,
        uppercase:true
    },
    texte:{
      type: String,
      required:true
    },
    image:{
      type: String
    },
});

module.exports= mongoose.model('Tuto', Tuto);
