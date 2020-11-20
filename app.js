'use strict'

// Cargar modulos de node para crear el servidor

const express = require('express'),
   bodyParser = require('body-parser');


// Ejecutar express (HTTP)

const app = express();

// Cargar rutas

const article_routes = require('./routes/article');

// Middelwares

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
   next();
});


// Añadir prefijos rutas

app.use('/api', article_routes);

// Ruta de prueba para el API REST

// app.get('/probando', (req, res) => {
   
//     return res.status(200).send(`
//     <ul>
//         <li>node js</li>
//         <li>react</li>
//         <li>angular</li>
//         <li>Vue</li>
//     </ul>
//     `)
// });
// app.get('/probando2', (req, res) => {
   
//     return res.status(200).send({
//         curso: 'Master en FrameworksJS',
//         author: 'caito',
//         url: 'caito.com'
//     })
// });
// app.post('/probando3', (req, res) => {

//     let params = req.body.hola;

//     return res.status(200).send({
//         curso: 'Master en FrameworksJS',
//         author: 'caito',
//         url: 'caito.com',
//         params
//     })
// });

// Exportar el modulo

module.exports = app;