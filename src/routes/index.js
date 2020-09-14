// configuracion de las rutas

const express = require('express');
const router = express.Router();

const home = require('../controllers/home');
const image = require('../controllers/image');

module.exports = app => {
    
    app.get('/', home.index);
    app.get('/image/:image_id', image.index);
    app.post('/images', image.create);
    app.post('/images/:image_id/like', image.like);
    app.post('/images/:image_id/comment', image.comment);
    app.delete('/images/:image_id', image.remove);

    app.use(router);
}