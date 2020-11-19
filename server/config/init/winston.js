var  _            = require('lodash'),
     processmode  = process.env.NODE_ENV || 'development',
     env          = require('../env/' + processmode),
     winston      = require('winston');



module.exports.init = function() {
    try {
        console.log('Success, init winston.');
    }
    catch(e) {
        console.log('Failed, init winston.');
    }
};



module.exports.add = function(loggerName, transportOptions) {
    try {
        winston.loggers.add(loggerName, {file:transportOptions});
    }
    catch(e) {
        console.log(e);
        return null;
    }
};



module.exports.get = function(loggerName) {
    try {
        return winston.loggers.get(loggerName);
    }
    catch(e) {
        console.log(e);
        return null;
    }
};
