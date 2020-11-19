app.factory('TokenInterceptor', function($q, $window, AuthenticationFactory) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            return config || $q.when(config);
        },
        response: function(response) {
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                AuthenticationFactory.deleteAuthentication();
                $window.location.href = '/';

                return $q.reject(rejection);
            }
            else {
                return $q.reject(rejection);
            }
        }
    };
});
