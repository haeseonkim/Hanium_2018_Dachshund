app.controller("MainController",
               ['$scope', 
                '$rootScope',
                '$location', 
                '$window', 
                '$routeParams',
                'UserAuthFactory',
                'AuthenticationFactory',
    function($scope, $rootScope, $location, $window, $routeParams,
             UserAuthFactory, AuthenticationFactory) {

        $scope.isLogin = false

        if($window.sessionStorage.user !== undefined ){
            $scope.isLogin = true
        }


        $scope.Login = function() {
            $location.path('/login')
        }

    }
]);
