const Stats = require('./stats');
const Images = require('./images');
const Comment = require('./comments');

module.exports = async viewModel => {

    const results = await Promise.all([
        Stats(),
        Images.popular(),
        Comment.newest(),
    ]);

    viewModel.sidebar = {
        stats: results[0],
        popular: results[1],
        commments: results[2]
    }

    return viewModel;

}