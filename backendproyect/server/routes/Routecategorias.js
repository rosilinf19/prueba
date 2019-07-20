var express = require('express');
var app = express();
var categories = require('../models/ModelCategoria');

const _ = require('underscore');

//middleware
const { verificadorToken, validatorRol } = require('../middleware/autenticacion');

// Mostrar todas las categorias Paginadas
app.get('/categories/all', (req, res) => {


    categories.find({ estado: true })
        .sort({ _id: 1 })
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

app.get('/categories/buscar/:termino', (req, res) => {

    var termino = req.params.termino;
    let literal = new RegExp(termino, 'i');
    categories.find({ nombre: literal })
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


// buscar una categoria por id
app.get('/categories/:id', (req, res) => {
    //id de la categoria
    var id_categories = req.params.id;

    categories.findById({ _id: id_categories }, (err, categoriesDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err: {
                    message: `No se encontro registro con el Id ${id_categories}`
                }
            });
        }

        res.json({
            exito: true,
            categoriesDB
        });
    });
});
// crear todas las categorias
app.post('/categories/create', [verificadorToken, validatorRol], (req, res) => {

    var data = req.body;

    let catego = new categories({
        nombre: data.nombre,
        descripcion: data.descripcion,
        user: req.usuario._id
    });

    catego.save((err, categoriesData) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }

        res.json({
            exito: true,
            categories: categoriesData
        });
    });

});

// actualizar una categoria
app.put('/categories/update/:id', [verificadorToken, validatorRol], (req, res) => {
    var data = req.body;

    let id_categories = req.params.id
    let actualizar = {
        descripcion: data.descripcion
    };


    categories.findByIdAndUpdate(id_categories, actualizar, { new: true, runValidators: true }, (err, categoDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err

            });
        }



        res.json({
            exito: true,
            categoria: categoDB
        });
    });
});
// eliminar categoria
app.delete('/categories/:id', [verificadorToken, validatorRol], (req, res) => {
    var id_categories = req.params.id
    categories.findByIdAndRemove(id_categories, (err, categoDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err

            });
        }
        if (categoDB == null) {
            res.status(400).json({
                exito: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            exito: true,
            categoria: categoDB
        });
    });
});

module.exports = app;