'use strict'

const mongoose = require('mongoose'),
           app = require('./app'),
          port = 3900;

const url = 'mongodb://localhost:27017/api_rest_blog';

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect(url,{useNewUrlParser: true})
    .then(() => {
        console.log('Se ha realizado la conexion a la BD correctamente!!!');

        // Crear servidor y escuchar peticiones HTTP
        
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:' + port);
        });
    });