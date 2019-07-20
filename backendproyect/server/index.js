require('./config/config');
var express = require('express');
const mongoose = require('mongoose')
var app = express();
var path = require('path');


const body_parse = require('body-parser');

//middleware
app.use(body_parse.urlencoded({ extended: false }));
app.use(body_parse.json({ limit: '50mb' }));
/* app.use(express.static(path.resolve(__dirname, '../upload'))); */
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(require('./routes/Routeindex'))

app.get('/', (req, res) => {
    res.sendfile('public/index.html');
});

//Conexion a mongoose

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos Conectada ONLINE');
    })

app.listen(process.env.PORT, function() {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});