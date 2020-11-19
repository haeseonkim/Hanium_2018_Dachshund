app.factory('AuthenticationFactory', function($window) {
    var auth = {
        isAuthenticated: function() {
            var user = auth.getAuthenticationInfo();
            if (user && user.userId && user.userId.length > 0) {
                return true;
            }
            else {
                return false;
            }
        },
        saveAuthentication: function(user) {
            if (user) {
                /* If saved value is object, then it saved by string */
                $window.sessionStorage.user = JSON.stringify(user);
                $window.sessionStorage.prevUser = JSON.stringify(user);
            }
        },
        resaveAuthentication: function(user) {
            this.saveAuthentication(user);
        },
        getAuthenticationInfo: function() {
            if ($window.sessionStorage.user) {
                var  value = $window.sessionStorage.user;
                try {
                    return JSON.parse(value);
                }
                catch(e) {
                    return value;
                }
            }
            else {
                return null;
            }
        },
        deleteAuthentication: function() {
            if ($window.sessionStorage.user) {
                delete $window.sessionStorage.user;
            }
            if ($window.sessionStorage.url) {
                delete $window.sessionStorage.url;
            }

            this.isLogged = false;
        },
        savePreviousUrl: function(url) {
            $window.sessionStorage.url = url;
        },
        redirectPreviousUrl: function() {
            if ($window.sessionStorage.url) {
                return $window.sessionStorage.url;
            }
            else {
                return '/';
            }
        }
    }
 

    return auth;
});
