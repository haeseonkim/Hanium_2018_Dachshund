var  _            = require('lodash'),
     processmode  = process.env.NODE_ENV || 'development',
     env          = require('../env/' + processmode),
     hashMap      = require('hashmap');


var  map = null;



module.exports.init = function() {
    if (!env.app.globalHash) return;

    try {
        map = new hashMap();
        console.log('Success, init global hash created.');
    }
    catch(e) {
        console.log('Failed, init global hash.');
    }
};


module.exports.destroy = function() {
    if (map) {
        map.clear();
        map = null;
    }
};


module.exports.get = function() {
    return  map;
};


module.exports.set = function(key, value) {
    if (map) {
        if (map.get(key)) {
            console.log('key exists : [' + key + '] and removed.');
            map.remove(key);
        }
        
        console.log('[hash] set [key: ' + key + ']');
        map.set(key, value);
    }
    else {
        console.log('[hash] map is not initialized.');
    }
};


module.exports.get = function(key) {
    if (map) {
        return  map.get(key);
    }
    else {
        console.log('[hash] map is not initialized.');
        return  null;
    }
};


module.exports.remove = function(key) {
    if (map) {
        if (map.get(key)) {
            console.log('remove key [' + key + ']');
            map.remove(key);
        }
        else {
            console.log('not found key [' + key + ']');
        }
    }
    else {
        console.log('[hash] map is not initialized.');
    }
};
