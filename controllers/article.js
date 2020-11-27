'use strict'

const validator = require('validator'),
        Article = require('../models/article'),
             fs = require('fs'),
           path = require('path');
const { exists } = require('../models/article');

const controller = {
    datosCurso: (req, res) => {
        let hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Framework JavaScript',
            author: 'caito',
            url: 'caito.com'
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            mensaje: 'Soy la accion test de mi controlador de articulos'
        });
    },
    save: (req, res) => {
        // Recoger los parametros por post

        const params  = req.body;

        // Validar los datos (validator)

        try{

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch(err){
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Faltan Datos por enviar'
                });
        }

            if(validate_title && validate_content){

                // Crear el objeto a guardar

                const article = new Article();

                // Asignar valores

                article.title = params.title;
                article.content = params.content;
                if(params.image){
                    article.image = params.image;
                }else{
                    article.image = null;
                }
                
                // Guardar el articulo

                article.save((err, articleStored) => {

                    if(err || !articleStored){
                        return res.status(404).send({
                            status: 'error',
                            mensaje: 'El Articulo no se ha guardado !!!'
                        });
                    }
                });

                 // Devolver una respuesta

                 return res.status(200).send({
                     status: 'success',
                    article
                 });
               
            } else{
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'Los Datos NO son Validos'
                });
            }

        
    },
    getArticles: (req, res) => {

        var query = Article.find({});
        var last = req.params.last;
        
        if(last || last != undefined){
            query.limit(5);
        }

        // Find (busqueda en la BD)

        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    mensaje: 'error al devolver los articulos !!!'
                });
            }
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    mensaje: 'No Hay Articulos !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    },
    getArticle: (req, res) => {

    // Recoger el id de la url

    var articleId = req.params.id;

    // Comprobar que existe

    if(!articleId || articleId == null){

        return res.status(404).send({
            status: 'error',
            mensaje: 'No existe el Articulo !!!'
        });
    }

    // Buscar el Articulo

    Article.findById(articleId, (err, article) => {
        if(err){
            return res.status(500).send({
                status: 'error',
                mensaje: 'No existe el Articulo !!!'
            });
        }
        if(!article){
            return res.status(404).send({
                status: 'error',
                mensaje: 'No existe el Articulo !!!'
            });
        }

        return res.status(200).send({
            status: 'success',
            article
        });

    });

        
    },
    update: (req, res) => {

        // Recoger el id del articulo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch(err){
            return res.status(404).send({
                status: 'error',
                mensaje: 'Faltan Datos por Enviar !!!'
            });
        }

        if(validate_title && validate_content){

            // Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        mensaje: 'error al Actualizar'
                    });
                }
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        mensaje: 'No existe el Articulo !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        } else{
            return res.status(404).send({
                status: 'error',
                mensaje: 'La Validacion no es correcta !!!'
            });
        }
    },
    delete: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    mensaje: 'Error al Borrar !!!'
                });
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    mensaje: 'Articulo no eliminado !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });

       
    },
    upload: (req, res) => {

        // Configurar el modulo connect multiparty

        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                mensaje: file_name
            });
        }

        // Recoger el fichero de la peticion

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        // En LINUX o MAC seria : var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extension del archivo
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo se aceptan imagenes
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    mensaje: 'La extension de la imagen no es valida !!!'
                });
            });
        } else{
            // Si todo es valido saco el id de la url
            var articleId = req.params.id;

            if(articleId){
                // Buscar el articulo asignarle el nombre de la imagen y actualizarlo
              Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true},
                (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            mensaje: 'Error al guardar la imagen del articulo !!!'
                        });
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }

            
        }       
    },
    getImage: (req, res) => {

        // Capturamos el nombre del archivo de la url
        var file = req.params.image;
        var path_file = './upload/articles/'+file;
        
        // Comprobamos si el archivo existe
        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    mensaje: 'La imagen no existe !!!'
                });
            }
        });
        
    },
    search: (req, res) => {

        // Sacar el string a buscar
        var searchString = req.params.search;

        // find or
        Article.find({'$or':[
            {'title':{'$regex': searchString, '$options': 'i'}},
            {'content':{'$regex': searchString, '$options': 'i'}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    mensaje: 'Error en la peticion !!!'
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    mensaje: 'No hay articulos que coincidan con tu busqueda !!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        
    }
    
} // end controller

module.exports = controller;