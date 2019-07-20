/*

Middleware

*/

const jwt = require('jsonwebtoken');

/*

Validar el Token

*/
let verificadorToken = (req, res, next) => {


    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            res.status(401).json({
                exito: false,
                err: {
                    error: true,
                    message: 'Prohibido el Acceso Token Invalido'
                }
            });
        }
        if (!err) {
            req.usuario = decode.usuarioDB;
            next();
        }



    });
}

/*=====================================
validar admin_rol
===================================== */

// SOLO EL ADMIN ROL
let validatorRol = (req, res, next) => {
    var usuario = req.usuario;
    console.log(usuario.role);
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({
            exito: false,
            err: {
                message: 'Usuario Sin derecho crear o Actualziar'
            }
        });
    }
}

module.exports = {
    verificadorToken,
    validatorRol
}