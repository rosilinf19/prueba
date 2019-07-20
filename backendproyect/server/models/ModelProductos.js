const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es Necesario'],
        unique: true,
        index: true,
    },
    codigo: {
        type: Number,
        required: true,
        unique: true

    },
    precio: {
        type: Number,
        require: [true, 'El Precio es Necesario']
    },
    cantidad: {
        type: Number,
        require: [true, 'la cantidad es Necesaria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es Necesaria']

    },
    img: [{
        type: String,
        require: false

    }],
    estado: {
        type: Boolean,
        default: true
    },
    id_categoria: {
        type: Schema.Types.ObjectId
    }

});



ProductoSchema.plugin(uniqueValidator, { message: '{PATH} Debe de ser Unico' });

module.exports = mongoose.model('productos', ProductoSchema);