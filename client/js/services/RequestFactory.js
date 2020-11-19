app.factory('RequestFactory', 
            function($window, $location, $http, AuthenticationFactory) {
    return {
        get: function(url, params='') {
            console.log('Call')
            return $http.get(url + params)
        },
        
        post: function(url, data) {
            console.log('Call')
            return $http.post(url, data)
        },
        
        delete: function(url) {
            console.log('Call')
            return $http.delete(url)
        },
        put: function(url, data) {
            console.log('Call')
            return $http.put(url, data)
        },

        /*
        //id 중복체크 후 post(추가)
        insert: function(url, data) {
            console.log('id중복 체크')
            return $http.post(url, data)
        },
        */
    }
});