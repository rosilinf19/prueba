/*
Puertos

*/

process.env.PORT = process.env.PORT || 3001;

/*
 *ENTORNO
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*========================================
Base de datos
======================================== */
let urlDB;
if (process.env.NODE_ENV == 'dev') {

    urlDB = 'mongodb://127.0.0.1:27017/proyecto_final';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


/* Entorno de caducidad  y SEED */
process.env.CADUCIDAD_TOKEN = '1h';
process.env.SEED = process.env.SEED || 'KEY_DsESARROLLO';