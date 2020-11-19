app.factory('LocalStorageFactory', function($window) {

    return  {
        get: function(key) {
            try {
                return JSON.parse($window.localStorage.getItem(key));
            } 
            catch(e) {
                return null;
            }
        },
        set: function(key, data) {
            try {
                $window.localStorage.setItem(key, JSON.stringify(data));
            } 
            catch(e) {
            }

            return;
        },
        remove: function(key) {
            return  $window.localStorage.removeItem(key);
        }
    }
});
