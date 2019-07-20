/*====*/
/*====*/
/*====================================
Importacion de los rutas para que puedan ser leidas por los el index
==================================== */

var express = require('express');
var app = express();
app.use(require('./Routeusuario'))
app.use(require('./Routelogin'))
app.use(require('./Routecategorias'));
app.use(require('./RouteProductos'));
app.use(require('./RouteUpload'));


module.exports = app;