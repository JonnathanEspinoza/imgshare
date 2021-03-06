// controllers

const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');

const { Image, Comment } = require('../models');
const sidebar = require('../helpers/sidebar');

const ctrl = {};

ctrl.index = async (req, res) => {
    //console.log('Params:',req.params.image_id);
    let viewModel = {image: {}, comments: {}};

    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });// $regex => expresiones regulares
    //console.log(image);
    if (image) {
        
        image.views = image.views + 1;
        viewModel.image = image;
        await image.save();
        const comments = await Comment.find({ image_id: image._id });
        viewModel.comments = comments;

        viewModel = await sidebar(viewModel);

        res.render('image', viewModel);
    } else {
        res.redirect('/');
    }

};

ctrl.create = (req, res) => {

    const saveImage = async () => {
        const imgURL = randomNumber();// obtner un nombre aleatorio
        const images = await Image.find({ filename: imgURL });
        if (images.length > 0) {
            saveImage();
        } else {
            //console.log(imgURL);
            const imageTempPath = req.file.path; // lugar en donde se almacena la imagen
            const ext = path.extname(req.file.originalname).toLowerCase();// obtener la extencion (.png, etc)
            const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`)// ruta en donde colocar la imagen

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath); // mueve el archivo de public/temp a public/upload
                const newImg = new Image({
                    title: req.body.title,
                    filename: imgURL + ext,
                    description: req.body.description,
                });
                const imageSave = await newImg.save();
                res.redirect('/image/' + imgURL);
                //res.send('works');
            } else {
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Only Images are allowed' });
            }
        }
    }
    saveImage();
};

ctrl.like = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if (image){
        image.likes = image.likes + 1;
        await image.save();
        res.json({likes: image.likes});
    }else{
        res.status(500).json({error: 'Internal Error'});
    }
};

ctrl.comment = async (req, res) => {
    //console.log(req.body);
    const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
    if (image) {
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        //console.log(newComment);
        await newComment.save();
        res.redirect('/image/' + image.uniqueId);
    }else{
        res.redirect('/');
    }
};

ctrl.remove = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image){
        await fs.unlink(path.resolve('./src/public/upload/'+image.filename));
        await Comment.deleteOne({image_id: image._id});
        await image.remove();
        res.json(true);
    }
};

module.exports = ctrl;