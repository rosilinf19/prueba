var express = require('express');
var app = express();
var productos = require('../models/ModelProductos');

const _ = require('underscore');

//middleware
const { verificadorToken, validatorRol } = require('../middleware/autenticacion');

// Mostrar todas Los Productos
app.get('/productos/all', (req, res) => {


    productos.find({ estado: true })
        .sort({ _id: 1 })
        .exec((err, productosDB) => {
            if (err) {
                res.status(400).json({
                    exito: false,
                    err
                });
            }

            res.json({
                exito: true,
                productos: productosDB,


            });
        });
});

//Buscar por termino por nombre o descripcion del producto
app.get('/productos/buscar/:termino', (req, res) => {

    var termino = req.params.termino;
    let literal = new RegExp(termino, 'i');
    productos.find({ nombre: literal, estado: true })
        .exec((err, categories) => {
            if (err) {
                res.status(400).json({
                    exito: false,
                    err
                });
            }

            res.json({
                exito: true,
                categories,


            });
        });
});

// buscar los productos por categoria
app.get('/productos/categoria/:id', (req, res) => {

    var id = req.params.id;

    productos.find({ id_categoria: id, estado: true })
        .exec((err, productosDB) => {
            if (err) {
                res.status(400).json({
                    exito: false,
                    err: {
                        message: 'No existe categoria'
                    }
                });
            }

            res.json({
                exito: true,
                productosDB,


            });
        });
});

// buscar una categoria por id
app.get('/productos/:id', (req, res) => {
    //id de la categoria
    var id_producto = req.params.id;

    productos.findById({ _id: id_producto }, (err, productosDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err: {
                    message: `No se encontro registro con el Id ${id_producto}`
                }
            });
        }

        res.json({
            exito: true,
            productosDB
        });
    });
});
// crear todas las categorias
app.post('/productos/create', [verificadorToken, validatorRol], (req, res) => {

    var data = req.body;
    /* =======================
    DATA PARA MANDAR Y SER LEIDO SIN PROBLEMA
    nombre
    codigo
    precio
    cantidad
    descripcion
    imagen
    id_categoria
     =======================*/
    let product = new productos({
        nombre: data.nombre,
        codigo: data.codigo,
        precio: data.precio,
        cantidad: data.cantidad,
        descripcion: data.descripcion,
        img: data.imagen,
        id_categoria: data.id_categoria,
    });

    product.save((err, prodcutoDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }

        res.json({
            exito: true,
            producto: prodcutoDB
        });
    });

});

// actualizar un Producto
app.put('/productos/producto/:id', [verificadorToken, validatorRol], (req, res) => {
    //underscore pick solo coloca los campos que se quieren actualizar en la base de datos
    var data = _.pick(req.body, ['nombre', 'precio', 'cantidad', 'descripcion', 'imagen']);
    var id_producto = req.params.id
    productos.findByIdAndUpdate(id_producto, data, { new: true, runValidators: true, context: 'query' }, (err, productoBD) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err: {
                    message: `No se encontro registro con el Id ${id_producto}`
                }
            });
        }

        res.json({
            exito: true,
            producto: productoBD
        });

    });
});
// eliminar categoria
app.delete('/productos/delete/:id', [verificadorToken, validatorRol], (req, res) => {
    var id_productos = req.params.id
    productos.findByIdAndRemove(id_productos, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err

            });
        }
        if (productoDB == null) {
            res.status(400).json({
                exito: false,
                err: {
                    message: `El producto con ID ${id_productos} no EXISTE`
                }
            })
        }

        res.json({
            exito: true,
            producto: productoDB
        });
    });
});

module.exports = app;