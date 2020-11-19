app.controller("RotationController",
               ['$scope',
                '$rootScope',
                '$location',
                '$window',
                '$routeParams',
                'UserAuthFactory',
                'AuthenticationFactory',
                'RequestFactory',
    function ($scope, $rootScope, $location, $window, $routeParams,
             UserAuthFactory, AuthenticationFactory, RequestFactory) {

        $scope.isLogin = false
        $scope.items = [
            { a: 1 },
            { a: 2 },
            { a: 3 },
            { a: 1 },
            { a: 1 },
            { a: 1 },
            { a: 1 },
            { a: 1 },
            { a: 1 },
            { a: 1 },
        ]

        //ContentRotation
        $scope.ro = {
            Text: '',
            Image: '',
            Media: ''

        }

        if ($window.sessionStorage.user !== undefined) {
            $scope.isLogin = true
        }


        //save ��ư ������ �����.
        $scope.actionSaveRotation = function () {

            let data = {
                Text: $scope.ro.Text,
                Image: $scope.ro.Image,
                Media: $scope.ro.Media
            }
            console.log('Hello')
            console.log(data)
            RequestFactory.put('/api/content/rotation', data)
                .then(function onSuccess(response) {
                    if (response.status === 200) {

                        console.log(response)
                        $scope.init2() //���ε�..
                    }
                    else {
                        $scope.error = response.data.message;
                    }

                }, function onError(response) {
                    $scope.error = response.data.message;
                })

        }

        //init �Լ�
        //���� controller���� new data ��������.
        $scope.init2 = function () {
            RequestFactory.get('/api/content/rotation')
                .then(function onSuccess(response) {
                    if (response.status === 200) {
                        console.log(response.data)
                        $scope.items = response.data //�迭������ item ������ �Ҵ��.
                        //console.log($scope.items)
                    }
                    else {
                        $scope.error = response.data.message;
                    }

                }, function onError(response) {
                    $scope.error = response.data.message;
                })
        }
        //init()��

    }
               ]);
