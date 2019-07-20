var express = require('express');
var app = express();
const Usuario = require('../models/ModelUsuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/login', (req, res) => {

    var data = req.body;
    if (data.password == null || data.email == null) {

        res.status(400).json({
            exito: false,
            err: {
                message: 'Faltan Parametros en el Post'
            }

        });
    }
    Usuario.findOne({ email: data.email }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }


        if (!usuarioDB) {
            res.status(400).json({
                exito: false,
                err: {
                    message: '(Usuario) O Contraseña Incorrecto'
                }
            });
        }
        if (usuarioDB) {

            if (!bcrypt.compareSync(data.password, usuarioDB.password)) {
                res.status(400).json({
                    exito: false,
                    err: {
                        message: 'Usuario O (Contraseña) Incorrecto'
                    }
                });
            }
        }


        //generar el jwt
        const token = jwt.sign({
            usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN // expires in 24 hours
        });


        res.json({
            exito: true,
            usuario: usuarioDB,
            token
        });
    });


});


module.exports = app;