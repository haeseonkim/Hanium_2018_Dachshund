var StringUtil = {
    validate: function(str) {
       if (typeof str === 'undefined' || str === null ||
           str === ''                 || str.length <= 0) {
           return false;
       }

       return true;
    }
};


module.exports = StringUtil;
