var _    = require('lodash'),
    glob = require('glob');



/*
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];


    // If glob pattern is array so we use each pattern 
    // in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    }
    else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        }
        else {
            glob(globPatterns, {sync: true},
                function(err, files) {
                    if (removeRoot) {
                        files = files.map(function(file) {
                            return file.replace(removeRoot, '');
                        });
                    }

                    output = _.union(output, files);
            });
        }
    }


    return  output;
};
*/



module.exports.getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
 
    // The output array
    var output = [];
 
    // If glob pattern is array then we use each pattern in a 
    // recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
              output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } 
    else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } 
        else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            if (excludes.hasOwnProperty(i)) {
                                file = file.replace(excludes[i], '');
                            }
                        }
                    } 
                    else {
                        file = file.replace(excludes, '');
                    }

                    return file;
                });
            }

            output = _.union(output, files);
        }
    }
 
    return output;
};
