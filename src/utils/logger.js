const morgan = require('morgan');
module.exports = {
  httpLogger: morgan(':method :url :status :res[content-length] - :response-time ms')
};
