var express = require('express');
var app = express();
const Usuario = require('../models/ModelUsuario')
const _ = require('underscore');
const bcrypt = require('bcrypt')
const { verificadorToken, validatorRol } = require('../middleware/autenticacion')


// [verificadorToken],
app.post('/user/createUser', (req, res) => {
    var data = req.body;

    let usuario = new Usuario({
        nombre: data.nombre,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        role: data.role,
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }
        /* usuarioDB.password = null; */
        res.json({
            exito: true,
            usuario: usuarioDB
        })
    });



});

app.put('/user/updateUser/:id', [verificadorToken, validatorRol], (req, res) => {
    //underscore pick solo coloca los campos que se quieren actualizar en la base de datos
    var data = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);
    var id = req.params.id
    Usuario.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }

        res.json({
            exito: true,
            usuario: usuarioDB
        });

    });
});

app.get('/user/allUser', (req, res) => {
    //variable global


    let desde = req.query.desde || 0;

    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    // los parametros opcionaes se mandan ?name_parametro & => si hay otro
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarioDB) => {
            if (err) {
                res.status(400).json({
                    exito: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    exito: true,
                    usuarioDB,
                    cantidad: conteo
                })
            });

        });
});

app.delete('user/deleteUser/:id', [verificadorToken, validatorRol], (req, res) => {
    var id = req.params.id;
    /* Usuario.findByIdAndRemove(id, function(err, usuarioBorrado) { */
    let cambiarEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                exito: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            exito: true,
            usuario: usuarioBorrado,
        });

    });
});
module.exports = app;