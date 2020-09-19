const {Image} = require('../models');
const { model } = require('../models/image');

module.exports = {
    
    async popular() {
        const images = await Image.find()
            .limit(9)
            .sort({likes: -1});
        return images;
    }
}