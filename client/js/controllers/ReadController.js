app.controller("ReadController",
               ['$scope', 
                '$rootScope',
                '$location', 
                '$window', 
                '$routeParams',
                'UserAuthFactory',
                'AuthenticationFactory',
    function($scope, $rootScope, $location, $window, $routeParams,
             UserAuthFactory, AuthenticationFactory) {

        $scope.header      = null
        $scope.attachments = null
        $scope.start       = null
        $scope.seqno       = $routeParams.seqno
        $scope.limit       = $routeParams.limit
        if ($routeParams.start) $scope.start = $routeParams.start
        $scope.param       = $scope.start ? '?start=' + $scope.start : '?start='



        $scope.readmail = function() {
            UserAuthFactory.readmail($scope.seqno)
                           .then(function onSuccess(response) {

                    if (response.data.header)  
                        $scope.header  = response.data.header

                    if (response.data.attachments && response.data.attachments.length > 0)    
                        $scope.attachments  = response.data.attachments

                }, function onError(response) {
                    $scope.error = response.data.message;
                });
        }


        $scope.getArraytoString = function(array) {
            let str = ''
            if (!array)  return
            for (let i=0; i < array.length; i++) {
                if (i != 0) str += ','
                str += array[i]
            }

            return  str;
        }


        $scope.getFullDate = function(date) {
            let d   = new Date(date)
            let ret = d.getFullYear() + '/'
            if ((d.getMonth()+1) < 10)  ret += '0' + (d.getMonth() + 1) + '/'
            else                        ret +=       (d.getMonth() + 1) + '/'

            if (d.getDate() < 10)  ret += '0' + d.getDate() + ' '
            else                   ret +=       d.getDate() + ' '

            if (d.getHours() < 10)  ret += '0' + d.getHours() + ':'
            else                    ret +=       d.getHours() + ':'

            if (d.getMinutes() < 10)  ret += '0' + d.getMinutes() + ':'
            else                      ret +=       d.getMinutes() + ':'

            if (d.getSeconds() < 10)  ret += '0' + d.getSeconds()
            else                      ret +=       d.getSeconds()

            return ret
        }


        $scope.getArraytoDate = function(array) {
            let str = ''
            if (!array)  return
            for (let i=0; i < array.length; i++) {
                if (i != 0) str += ','
                str += $scope.getFullDate(array[i])
            }

            return  str;
        }



        $scope.init = function() {

            if($window.sessionStorage.user !== undefined  &&
               $window.sessionStorage.user !== null){
                $scope.user = JSON.parse($window.sessionStorage.user)
                $scope.readmail()
            }
            else {
                $location.path('/login')
            }
        }


        $scope.toInteger = function(size) {
            return parseInt(size/1024, 10)
        }
    }
]);
