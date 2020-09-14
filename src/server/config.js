// CONFIGURACION DEL SERVIDOR CON EXPRESS

const path = require('path');
const exphbs = require('express-handlebars');

const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const errorHandler = require('errorhandler');

const routes = require('../routes/index');

const handlebars = require('handlebars');

module.exports = app => {
    // Settings
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        partialsDir: path.join(app.get('views'), 'partials'),
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: '.hbs',
        helpers: require('./helpers'),
        handlebars: handlebars
    }));//configuracion del motor de plantillas (handelbars)
    app.set('view engine', '.hbs');

    // middlewares
    app.use(morgan('dev'));
    app.use(multer({ dest: path.join(__dirname, '../public/upload/temp') }).single('image'));
    app.use(express.urlencoded({ extended: false }));// recibir los datos de los formularios html
    app.use(express.json());

    // routes
    routes(app);

    // static
    app.use('/public', express.static(path.join(__dirname, '../public')));

    // errorhandlers
    if ('development' === app.get('env')) {
        app.use(errorHandler);
    }

    return app;
}
