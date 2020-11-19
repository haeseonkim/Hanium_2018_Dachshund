app.factory('UserAuthFactory', 
            function($window, $location, $http, AuthenticationFactory) {
    return {
        login: function(userId, password) {
            return $http.post('/login', {
                userId: userId,
                password: password
            });
        },
        getone: function(userId) {
            return $http.get('/api/v1/users/' + userId);
        },
        duplicate: function(userId) {
            return $http.get('/users/' + userId);
        },
        signup: function(user) {
            return $http.post('/users', user);
        },
        getmail: function(option) {
            if (option) return $http.get('/api/v1/mail?' + option);
            else        return $http.get('/api/v1/mail');
           
        },
        readmail: function(seqno) {
            return $http.get('/api/v1/mail/' + seqno);
        },
        filedownload: function(seqno, filename) {
            return $http.get('/api/v1/mail/' + seqno + '/' + filename)
        },
        logout: function(cb) {
            return $http.delete('/logout');
        }
    }
});
