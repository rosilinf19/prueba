var express = require('express');
var app = express();

var upload = require('express-fileupload');

var usuario = require('../models/ModelUsuario');
var productos = require('../models/ModelProductos');
var imagen_model = require('../models/ModelImagenes');
// verificar para luego eliminarlas del servidor

const { verificadorToken, validatorRol } = require('../middleware/autenticacion');

var fs = require('fs');
var path = require('path');

app.use(upload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', [verificadorToken, validatorRol], (req, res) => {
    let data = req.body;
    let tipo = req.params.tipo;
    let id = req.params.id;

    // validar si existe algun archivo
    if (!req.files) {
        res.status(400).json({
            exito: false,
            err: {
                message: 'No se encontro archivo disponible'
            }
        });
    }

    let tipo_valido = ['productos', 'usuarios'];
    if (tipo_valido.indexOf(tipo) < 0) {
        res.status(400).json({
            exito: false,
            err: {
                message: `Los tipos permitidos son : ${tipo_valido}`,

            }
        });
    }

    let archivo = req.files.archivo;
    let nombre_archivo = archivo.name.split('.');
    let ext = nombre_archivo[1];
    let extencionValidad = ['jpg', 'png', 'jpge', 'gif'];
    // validar las extenciones
    if (extencionValidad.indexOf(ext) < 0) {

        res.status(400).json({
            exito: false,
            err: {
                message: `Las extenciones permitidad son : ${extencionValidad}`,
                ext
            }
        });

    }

    //cambiando archivo

    let nombre_save = `${id}-${ new Date().getMilliseconds()}.${ext}`;

    // subiendo archivo a la carpeta
    archivo.mv(`public/assets/${tipo}/${nombre_save}`, (err) => {
        if (err) {
            res.status(400).json({
                exito: false,
                err
            });
        }
    });

    /*   imageneUsuario(id, res, nombre_save); */
    if (tipo === "usuarios") {
        imageneUsuario(id, res, nombre_save);

    } else {

        imageneProducto(id, res, nombre_save);
    }

});


// subida de muchas imagenes
app.post('/uploadMasiva/:id', [verificadorToken, validatorRol], (req, res) => {
    let id_producto = req.params.id;

    console.log(Object.keys(req.files.archivo).length);
    if (!req.files) {
        res.status(400).json({
            exito: false,
            err: {
                message: 'No se encontro archivo disponible'
            }
        });
    }
    let archivo = [];
    for (let d = 0; d < req.files.archivo.length; d++) {
        archivo.push(req.files.archivo[d]);

    }

    let nombre_archivo = [];
    for (let index = 0; index < archivo.length; index++) {

        nombre_archivo.push(archivo[index].name.split('.'));
    }

    let extencionValidad = ['jpg', 'png', 'jpge', 'gif'];

    for (let b = 0; b < nombre_archivo.length; b++) {

        if (extencionValidad.indexOf(nombre_archivo[b][1]) < 0) {

            res.status(400).json({
                exito: false,
                err: {
                    message: `Las extenciones permitidad son : ${extencionValidad}`,
                    ext: nombre_archivo[b][1]
                }
            });

        }
    }

    var nombre_save = '';

    for (let a = 0; a < archivo.length; a++) {

        nombre_save = `${id_producto}-${a}.${nombre_archivo[a][1]}`;

        // subiendo archivo a la carpeta

        archivo[a].mv(`public/assets/productosMasivo/${nombre_save}`, (err) => {
            if (err) {
                res.status(400).json({
                    exito: false,
                    err
                });
            }

            save_img(id_producto, nombre_save);
        });
    }


    res.json({
        extio: true,
        message: 'Fueron cargadas correctamente'
    })


});

//guardar las imagenes
function save_img(id, name_base) {
    let guardo = false;
    productos.findById(id, (err, productosDB) => {
        if (err) {
            borrarImagenServerMultiple(name_base);
            res.status(500).json({
                exito: false,
                err
            });

        }

        if (!productosDB) {
            res.status(400).json({
                exito: false,
                err: {
                    message: 'El Producto No existe'
                }
            });
        }
        /* Guardar imagenes */
        let img = new imagen_model({
            img: name_base,
            id_producto: id
        });

        img.save((err, img) => {
            if (err) {
                guardo = false;
                res.status(400).json({
                    exito: false,
                    err
                });
            }
            guardo = true;
            return guardo;
        });


    });
}

// funcion la cual guarda la imagen
function imageneUsuario(id, res, nombre_save) {
    let tipo = 'usuarios';
    usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borrarImagenServer(nombre_save, tipo);
            res.status(500).json({
                exito: false,
                err
            });

        }

        if (!usuarioBD) {
            res.status(400).json({

                exito: false,
                err: {
                    message: 'El usuario No existe'
                }
            });
        }


        borrarImagenServer(usuarioBD.img, tipo);
        usuarioBD.img = nombre_save;
        usuarioBD.save((err, UsuarioGuardado) => {
            if (err) {
                res.status(500).json({
                    exito: false,
                    err
                });
            }

            res.json({
                exito: true,
                UsuarioGuardado
            })
        });


    });
}

function imageneProducto(id, res, nombre_save) {
    let tipo = 'productos';
    productos.findById(id, (err, productosDB) => {
        if (err) {
            borrarImagenServer(nombre_save, tipo);
            res.status(500).json({
                exito: false,
                err
            });

        }

        if (!productosDB) {
            res.status(400).json({
                exito: false,
                err: {
                    message: 'El Producto No existe'
                }
            });
        }
        /*   borrarImagenServer(productosDB.img, tipo); */
        productosDB.img = nombre_save;

        productosDB.save((err, productosGuardados) => {
            if (err) {
                res.status(500).json({
                    exito: false,
                    err
                });
            }

            res.json({
                exito: true,
                productosGuardados
            })
        });


    });
}

function borrarImagenServer(nombreImagen, tipo) {
    // coloca el path donde esta guardada la imagen
    let pathImage = path.resolve(__dirname, `../../upload/${tipo}/${ nombreImagen }`);
    // verifica si existe la imagen ya guardada
    console.log(fs.existsSync(pathImage));
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

function borrarImagenServerMultiple(nombreImagen) {
    // coloca el path donde esta guardada la imagen
    let pathImage = path.resolve(__dirname, `../../upload/productosMasivo/${ nombreImagen }`);
    // verifica si existe la imagen ya guardada
    console.log(fs.existsSync(pathImage));
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;