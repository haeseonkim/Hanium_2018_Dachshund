app.controller('HeaderController',
               ['$rootScope',
                '$scope',
                '$location',
                '$window',
                'UserAuthFactory',
                'AuthenticationFactory',
                'RequestFactory',                
    function($rootScope, $scope, $location, $window,
             UserAuthFactory, 
             AuthenticationFactory,
             RequestFactory) {

        console.log('HeaderController Loding');

        
        
        $scope.isLogin = false;
        $scope.error   = '';

        if($window.sessionStorage.user !== undefined ){
            $scope.isLogin = true;
            $scope.user    = JSON.parse($window.sessionStorage.user);
        }


        $scope.logout = function () {
            console.log('logout function');

            RequestFactory.delete('/api/logout')
                          .then(function onSuccess(response) {

                          }, function onError(response){

                          })



            // UserAuthFactory.logout();
            AuthenticationFactory.deleteAuthentication()
            $location.url('#!/main');
        }
    }
]);

