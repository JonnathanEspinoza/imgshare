// helpers para handlebars
const moment = require('moment');

const helpers = {};

helpers.timeago = timestamp => moment(timestamp).startOf('minute').fromNow();

module.exports = helpers;