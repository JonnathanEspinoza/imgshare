// Mostrar estadisticas
const { Image, Comment } = require('../models');

async function imageCunter() {
    return await Image.countDocuments();
}

async function commentsCounter() {
    return await Comment.countDocuments();
}

async function imageTotalViewsCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' }
        }
    }]);
    return result[0].viewsTotal;
}

async function likesTotalCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes' }
        }
    }]);
    return result[0].likesTotal;
}

module.exports = async () => {
    // Promesa que ejecuta las funciones designadas en paralelo(todas a la vez). Devuelve un arreglo con los resultados en el orden en que se especifican la funciones
    const result = await Promise.all([
        imageCunter(),
        commentsCounter(),
        imageTotalViewsCounter(),
        likesTotalCounter(),
    ]);

    return {
        images: result[0],
        comments: result[1],
        views: result[2],
        likes: result[3]
    }
}