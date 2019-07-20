const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorieShema = new Schema({
    nombre: {
        type: String,
        unique: true,
        require: [true, 'El nombre es Necesario']
    },
    descripcion: {
        type: String,
        required: [true, ['La Descripcion es Necesario']]
    },
    estado: {
        type: Boolean,
        default: true
    },


});


categorieShema.plugin(uniqueValidator, { message: '{PATH} Debe de ser Unico' });

module.exports = mongoose.model('categorias', categorieShema);